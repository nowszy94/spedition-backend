import { Injectable } from '@nestjs/common';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { ContractorsService } from '../contractors/contractors.service';
import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
import { NewOrderIdService } from './new-order-id.service';
import { SpeditionOrderStatusService } from './spedition-order-status.service';

@Injectable()
export class SpeditionOrdersService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor(
    private readonly contractorService: ContractorsService,
    private readonly speditionOrderStatusService: SpeditionOrderStatusService,
    private readonly newOrderIdService: NewOrderIdService,
  ) {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  findAll(companyId: string) {
    return this.speditionOrderRepository.findAllSpeditionOrders(companyId);
  }

  async createDraftSpeditionOrder(
    companyId: string,
    createSpeditionOrderDto: CreateSpeditionOrderDto,
    creator: SpeditionOrder['creator'],
  ): Promise<SpeditionOrder> {
    const contractorFromDto = createSpeditionOrderDto.contractor;

    const contractor: SpeditionOrder['contractor'] | undefined =
      contractorFromDto
        ? await this.getContractorForOrder(
            companyId,
            contractorFromDto.id,
            contractorFromDto.contactId,
          )
        : undefined;

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      companyId,
      createSpeditionOrderDto,
      creator,
      contractor,
    );

    await this.speditionOrderRepository.createSpeditionOrder({
      ...newSpeditionOrder,
      status: 'DRAFT',
    });

    return newSpeditionOrder;
  }

  async createActiveSpeditionOrder(
    companyId: string,
    createSpeditionOrderDto: CreateSpeditionOrderDto,
    creator: SpeditionOrder['creator'],
  ) {
    const contractorFromDto = createSpeditionOrderDto.contractor;

    const contractor: SpeditionOrder['contractor'] | undefined =
      contractorFromDto
        ? await this.getContractorForOrder(
            companyId,
            contractorFromDto.id,
            contractorFromDto.contactId,
          )
        : undefined;
    const newOrderId = await this.newOrderIdService.createNewOrderId(
      companyId,
      new Date(createSpeditionOrderDto.unloading.date),
    );

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      companyId,
      createSpeditionOrderDto,
      creator,
      contractor,
      newOrderId,
    );

    await this.speditionOrderRepository.createSpeditionOrder({
      ...newSpeditionOrder,
      status: 'CREATED',
    });

    return newSpeditionOrder;
  }

  async findOne(id: string, companyId: string) {
    return await this.speditionOrderRepository.findSpeditionOrderById(
      companyId,
      id,
    );
  }

  async update(
    id: string,
    companyId: string,
    updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ): Promise<SpeditionOrder | null> {
    const foundSpeditionOrder =
      await this.speditionOrderRepository.findSpeditionOrderById(companyId, id);

    if (!foundSpeditionOrder) {
      return null;
    }

    const contractor = await this.contractorService.findOne(
      companyId,
      updateSpeditionOrderDto.contractor?.id,
    );

    const selectedContact = contractor?.contacts.find(
      (contact) => contact.id === updateSpeditionOrderDto.contractor.contactId,
    );

    const updatedSpeditionOrder: SpeditionOrder = {
      id: foundSpeditionOrder.id,
      orderId: foundSpeditionOrder.orderId,
      companyId: foundSpeditionOrder.companyId,
      creationDate: foundSpeditionOrder.creationDate,
      status: foundSpeditionOrder.status,
      creator: foundSpeditionOrder.creator,
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
    };

    await this.speditionOrderRepository.updateSpeditionOrder(
      updatedSpeditionOrder,
    );

    return updatedSpeditionOrder;
  }

  async changeStatus(
    id: string,
    companyId: string,
    newStatus: SpeditionOrder['status'],
  ): Promise<SpeditionOrder | null> {
    const foundSpeditionOrder =
      await this.speditionOrderRepository.findSpeditionOrderById(companyId, id);

    if (!foundSpeditionOrder) {
      return null;
    }

    const updatedSpeditionOrder =
      await this.speditionOrderStatusService.handleStatusChange(
        foundSpeditionOrder,
        newStatus,
      );

    await this.speditionOrderRepository.updateSpeditionOrder(
      updatedSpeditionOrder,
    );

    return updatedSpeditionOrder;
  }

  async changeOrderId(
    id: string,
    companyId: string,
    newOrderId: SpeditionOrder['orderId'],
  ) {
    const foundSpeditionOrder =
      await this.speditionOrderRepository.findSpeditionOrderById(companyId, id);

    if (!foundSpeditionOrder) {
      return null;
    }

    const updatedSpeditionOrder = {
      ...foundSpeditionOrder,
      orderId: newOrderId,
    }; // TODO add validation if there's already order with such id

    await this.speditionOrderRepository.updateSpeditionOrder(
      updatedSpeditionOrder,
    );
  }

  async changeContractor(
    id: string,
    companyId: string,
    newContractor?: {
      id: string;
      contactId?: string;
    },
  ) {
    const foundSpeditionOrder =
      await this.speditionOrderRepository.findSpeditionOrderById(companyId, id);

    if (!foundSpeditionOrder) {
      return null;
    }

    const contractor =
      newContractor &&
      (await this.contractorService.findOne(companyId, newContractor.id));

    const foundContact =
      newContractor.contactId &&
      contractor &&
      contractor.contacts.find(
        (contact) => contact.id === newContractor.contactId,
      );

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

    await this.speditionOrderRepository.updateSpeditionOrder(
      updatedSpeditionOrder,
    );
  }

  async remove(id: string, companyId: string) {
    await this.speditionOrderRepository.deleteSpeditionOrder(companyId, id);
  }

  private getContractorForOrder = async (
    companyId: string,
    contractorId: string,
    contactId?: string,
  ): Promise<SpeditionOrder['contractor']> => {
    const foundContractor = await this.contractorService.findOne(
      companyId,
      contractorId,
    );

    if (!foundContractor) {
      throw new Error(`Contractor for ${contractorId} not found `);
    }

    const foundContact = foundContractor.contacts.find(
      (contact) => contact.id === contactId,
    );

    if (contactId && !foundContact) {
      throw new Error(
        `Contact(id: ${contactId}) for contractor ${contractorId} not found`,
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
}
