import { Injectable, Logger } from '@nestjs/common';

import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { SpeditionOrdersRepository } from './ports/spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/dynamodb-spedition-order.repository';
import { NewOrderIdService } from './new-order-id.service';
import { SpeditionOrderStatusService } from './spedition-order-status.service';
import { User } from '../users/entities/user.entity';
import { SpeditionOrdersFiltersEntity } from './entities/spedition-orders-filters.entity';
import { SpeditionOrderNotFoundException } from './errors/SpeditionOrderNotFoundException';
import { ContractorsRepository } from '../contractors/contractors-repository.port';
import { DynamoDBContractorsRepository } from '../../infra/dynamodb/contractors/contractors.repository';
import { ContractorForUpdateSpeditionOrderNotExist } from './errors/ContractorForUpdateSpeditionOrderNotExist';
import { ContractorContactForUpdateSpeditionOrderNotExist } from './errors/ContractorContactForUpdateSpeditionOrderNotExist';
import { UsersRepository } from '../users/users-repository.port';
import { DynamoDBUsersRepository } from '../../infra/dynamodb/users/user.repository';
import { CreatorNotFoundException } from './errors/CreatorNotFoundException';

@Injectable()
export class SpeditionOrdersService {
  private readonly logger = new Logger(SpeditionOrdersService.name);
  private readonly speditionOrderRepository: SpeditionOrdersRepository;
  private readonly contractorsRepository: ContractorsRepository;
  private readonly usersRepository: UsersRepository;

  constructor(
    private readonly speditionOrderStatusService: SpeditionOrderStatusService,
    private readonly newOrderIdService: NewOrderIdService,
  ) {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
    this.contractorsRepository = new DynamoDBContractorsRepository();
    this.usersRepository = new DynamoDBUsersRepository();
  }

  findAll(companyId: string) {
    return this.speditionOrderRepository.findAll(companyId);
  }

  findAllWithLimit(companyId: string, limit: number) {
    return this.speditionOrderRepository.findAllWithLimit(companyId, limit);
  }

  async findAllByFilters(
    companyId: string,
    filters: SpeditionOrdersFiltersEntity,
  ) {
    const { orderMonthYear, creator, contractor } = filters;
    const promises: Array<Promise<Array<SpeditionOrder>>> = [];

    if (orderMonthYear) {
      promises.push(
        this.speditionOrderRepository.findAllByMonthYear(
          companyId,
          orderMonthYear,
        ),
      );
    }
    if (creator) {
      promises.push(
        this.speditionOrderRepository.findAllByCreatorId(companyId, creator.id),
      );
    }
    if (contractor) {
      promises.push(
        this.speditionOrderRepository.findAllByContractorId(
          companyId,
          contractor.id,
        ),
      );
    }

    this.logger.debug(
      `Calling ${promises.length} queries to filter by ${JSON.stringify(filters)} in company ${companyId}`,
    );

    const filteredOrders = await Promise.all(promises);

    return this.mergeSpeditionOrders(filteredOrders);
  }

  private mergeSpeditionOrders = (
    speditionOrders: Array<Array<SpeditionOrder>>,
  ) => {
    if (speditionOrders.length === 1) {
      return speditionOrders[0];
    }

    const sortedBySize = speditionOrders.sort((a, b) => a.length - b.length);
    const shortestList = sortedBySize[0];

    const [shortestSet, ...longerSets] = sortedBySize
      .map((list) => list.map((item) => item.id))
      .map((list) => new Set(list));

    const result: Array<SpeditionOrder> = [];

    shortestSet.forEach((speditionOrderId) => {
      if (longerSets.every((longerSet) => longerSet.has(speditionOrderId))) {
        result.push(
          shortestList.find(
            (speditionOrder) => speditionOrderId === speditionOrder.id,
          ),
        );
      }
    });

    return result;
  };

  async createDraftSpeditionOrder(
    user: User,
    createSpeditionOrderDto: CreateSpeditionOrderDto,
  ): Promise<SpeditionOrder> {
    const companyId = user.companyId;
    const contractorFromDto = createSpeditionOrderDto.contractor;

    const contractor: SpeditionOrder['contractor'] | undefined =
      contractorFromDto
        ? await this.getContractorForOrder(
            companyId,
            contractorFromDto.id,
            contractorFromDto.contactId,
          )
        : undefined;

    const creator = user.toCreator();
    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      companyId,
      createSpeditionOrderDto,
      creator,
      contractor,
    );

    await this.speditionOrderRepository.create({
      ...newSpeditionOrder,
      status: 'DRAFT',
    });

    return newSpeditionOrder;
  }

  async createActiveSpeditionOrder(
    user: User,
    createSpeditionOrderDto: CreateSpeditionOrderDto,
  ) {
    const creator = user.toCreator();
    const contractorFromDto = createSpeditionOrderDto.contractor;

    const contractor = contractorFromDto
      ? await this.getContractorForOrder(
          user.companyId,
          contractorFromDto.id,
          contractorFromDto.contactId,
        )
      : undefined;

    const newOrderId = await this.newOrderIdService.createNewOrderId(
      user,
      new Date(createSpeditionOrderDto.unloading[0].date),
    );

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      user.companyId,
      createSpeditionOrderDto,
      creator,
      contractor,
      newOrderId,
    );

    await this.speditionOrderRepository.create({
      ...newSpeditionOrder,
      status: 'CREATED',
    });

    return newSpeditionOrder;
  }

  async findOne(speditionOrderId: string, companyId: string) {
    return await this.findSpeditionOrderOrThrow(companyId, speditionOrderId);
  }

  async update(
    id: string,
    companyId: string,
    updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ): Promise<SpeditionOrder | null> {
    const foundSpeditionOrder = await this.findSpeditionOrderOrThrow(
      companyId,
      id,
    );

    const contractor = updateSpeditionOrderDto.contractor
      ? await this.contractorsRepository.findContractorById(
          companyId,
          updateSpeditionOrderDto.contractor.id,
        )
      : null;

    if (updateSpeditionOrderDto.contractor && !contractor) {
      throw new ContractorForUpdateSpeditionOrderNotExist(
        updateSpeditionOrderDto.contractor.id,
      );
    }

    const selectedContact = contractor?.contacts.find(
      (contact) => contact.id === updateSpeditionOrderDto.contractor.contactId,
    );

    if (updateSpeditionOrderDto.contractor.contactId && !selectedContact) {
      throw new ContractorContactForUpdateSpeditionOrderNotExist(
        updateSpeditionOrderDto.contractor.id,
        updateSpeditionOrderDto.contractor.contactId,
      );
    }

    let creator = foundSpeditionOrder.creator;

    if (updateSpeditionOrderDto.creator.id !== foundSpeditionOrder.creator.id) {
      const fetchedUser = await this.usersRepository.findUserBySub(
        updateSpeditionOrderDto.creator.id,
      );

      // TODO i should have separate index for this wi have both userId and companyId in query
      if (!fetchedUser || fetchedUser.companyId !== companyId) {
        throw new CreatorNotFoundException(
          companyId,
          updateSpeditionOrderDto.creator.id,
        );
      }

      creator = fetchedUser.toCreator();
    }

    const updatedSpeditionOrder: SpeditionOrder = {
      id: foundSpeditionOrder.id,
      orderId: foundSpeditionOrder.orderId,
      companyId: foundSpeditionOrder.companyId,
      creationDate: foundSpeditionOrder.creationDate,
      status: foundSpeditionOrder.status,
      creator,
      loading: updateSpeditionOrderDto.loading,
      unloading: updateSpeditionOrderDto.unloading,
      loadDetails: updateSpeditionOrderDto.loadDetails,
      freight: updateSpeditionOrderDto.freight,
      driver: updateSpeditionOrderDto.driver,
      vehicle: updateSpeditionOrderDto.vehicle,
      additionalInfo: updateSpeditionOrderDto.additionalInfo,
      contractor: contractor && {
        id: contractor.id,
        name: contractor.name,
        email: contractor.email,
        address: contractor.address,
        phoneNumber: contractor.phoneNumber,
        nip: contractor.nip,
        contact: selectedContact,
      },
      comment: updateSpeditionOrderDto.comment,
    };

    await this.speditionOrderRepository.update(updatedSpeditionOrder);

    return updatedSpeditionOrder;
  }

  async changeStatus(
    id: string,
    user: User,
    newStatus: SpeditionOrder['status'],
  ): Promise<SpeditionOrder | null> {
    const foundSpeditionOrder = await this.findSpeditionOrderOrThrow(
      user.companyId,
      id,
    );

    const updatedSpeditionOrder =
      await this.speditionOrderStatusService.handleStatusChange(
        foundSpeditionOrder,
        newStatus,
        user,
      );

    await this.speditionOrderRepository.update(updatedSpeditionOrder);

    return updatedSpeditionOrder;
  }

  async changeOrderId(
    id: string,
    companyId: string,
    newOrderId: SpeditionOrder['orderId'],
  ) {
    const foundSpeditionOrder = await this.findSpeditionOrderOrThrow(
      companyId,
      id,
    );

    const updatedSpeditionOrder = {
      ...foundSpeditionOrder,
      orderId: newOrderId,
    }; // TODO add validation if there's already order with such id

    return await this.speditionOrderRepository.update(updatedSpeditionOrder);
  }

  async changeContractor(
    id: string,
    companyId: string,
    newContractor?: {
      id: string;
      contactId?: string;
    },
  ) {
    const foundSpeditionOrder = await this.speditionOrderRepository.findById(
      companyId,
      id,
    );

    if (!foundSpeditionOrder) {
      return null;
    }

    const contractor =
      newContractor &&
      (await this.contractorsRepository.findContractorById(
        companyId,
        newContractor.id,
      ));

    if (newContractor && !contractor) {
      throw new ContractorForUpdateSpeditionOrderNotExist(newContractor.id);
    }

    const foundContact =
      newContractor.contactId &&
      contractor &&
      contractor.contacts.find(
        (contact) => contact.id === newContractor.contactId,
      );

    if (newContractor.contactId && !foundContact) {
      throw new ContractorContactForUpdateSpeditionOrderNotExist(
        newContractor.id,
        newContractor.contactId,
      );
    }

    const updatedSpeditionOrder = {
      ...foundSpeditionOrder,
      contractor: contractor && {
        id: contractor.id,
        name: contractor.name,
        email: contractor.email,
        address: contractor.address,
        phoneNumber: contractor.phoneNumber,
        nip: contractor.nip,
        contact: foundContact,
      },
    };

    await this.speditionOrderRepository.update(updatedSpeditionOrder);
  }

  async changeLoadingCompleted(
    id: string,
    companyId: string,
    loadingCompleted: {
      index: number;
      completed: boolean;
    },
  ) {
    const foundSpeditionOrder = await this.findSpeditionOrderOrThrow(
      companyId,
      id,
    );

    const updatedSpeditionOrder = {
      ...foundSpeditionOrder,
      loading: foundSpeditionOrder.loading.map((loadingItem, index) => {
        if (index === loadingCompleted.index) {
          return {
            ...loadingItem,
            completed: loadingCompleted.completed,
          };
        }
        return loadingItem;
      }),
    };

    return await this.speditionOrderRepository.update(updatedSpeditionOrder);
  }

  async changeUnloadingCompleted(
    id: string,
    companyId: string,
    unloadingCompleted: {
      index: number;
      completed: boolean;
    },
  ) {
    const foundSpeditionOrder = await this.findSpeditionOrderOrThrow(
      companyId,
      id,
    );

    const updatedSpeditionOrder = {
      ...foundSpeditionOrder,
      unloading: foundSpeditionOrder.unloading.map((unloadingItem, index) => {
        if (index === unloadingCompleted.index) {
          return {
            ...unloadingItem,
            completed: unloadingCompleted.completed,
          };
        }
        return unloadingItem;
      }),
    };

    return await this.speditionOrderRepository.update(updatedSpeditionOrder);
  }

  async remove(id: string, companyId: string) {
    await this.speditionOrderRepository.delete(companyId, id);
  }

  private getContractorForOrder = async (
    companyId: string,
    contractorId: string,
    contactId?: string,
  ): Promise<SpeditionOrder['contractor']> => {
    const foundContractor = await this.contractorsRepository.findContractorById(
      companyId,
      contractorId,
    );

    if (!foundContractor) {
      return null;
    }

    const foundContact = foundContractor.contacts.find(
      (contact) => contact.id === contactId,
    );

    if (contactId && !foundContact) {
      throw new ContractorContactForUpdateSpeditionOrderNotExist(
        contractorId,
        contactId,
      );
    }

    return {
      id: foundContractor.id,
      name: foundContractor.name,
      address: foundContractor.address,
      email: foundContractor.email,
      phoneNumber: foundContractor.phoneNumber,
      nip: foundContractor.nip,
      contact: foundContact && {
        id: foundContact.id,
        name: foundContact.name,
        email: foundContact.email,
        phoneNumber: foundContact.phoneNumber,
      },
    };
  };

  private async findSpeditionOrderOrThrow(
    companyId: string,
    speditionOrderId: string,
  ) {
    const contractor = await this.speditionOrderRepository.findById(
      companyId,
      speditionOrderId,
    );
    if (!contractor) {
      throw new SpeditionOrderNotFoundException(speditionOrderId);
    }
    return contractor;
  }
}
