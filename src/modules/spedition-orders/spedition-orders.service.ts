import { Injectable } from '@nestjs/common';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { ContractorsService } from '../contractors/contractors.service';
import { SpeditionOrdersRepository } from './spedition-orders.repository';
import { DynamoDBSpeditionOrderRepository } from '../../infra/dynamodb/spedition-orders/spedition-order.repository';
import { COMPANY_ID } from '../../const';

@Injectable()
export class SpeditionOrdersService {
  private readonly speditionOrderRepository: SpeditionOrdersRepository;

  constructor(private readonly contractorService: ContractorsService) {
    this.speditionOrderRepository = new DynamoDBSpeditionOrderRepository();
  }

  findAll() {
    return this.speditionOrderRepository.findAllSpeditionOrders(COMPANY_ID);
  }

  async create(createSpeditionOrderDto: CreateSpeditionOrderDto) {
    const foundContractor = await this.contractorService.findOne(
      createSpeditionOrderDto.contractor.id,
    );

    const foundContact = foundContractor?.contacts.find(
      (contact) => contact.id === createSpeditionOrderDto.contractor.contactId,
    );

    const contractor: SpeditionOrder['contractor'] = foundContractor && {
      id: foundContractor.id,
      name: foundContractor.name,
      address: foundContractor.address,
      email: foundContractor.email,
      phoneNumber: foundContractor.phoneNumber,
      nip: foundContractor.phoneNumber,
      contact: foundContact && {
        id: foundContact.id,
        name: foundContact.name,
        email: foundContact.email,
        phoneNumber: foundContact.phoneNumber,
      },
    };
    const newOrderId = await this.createNewOrderId();

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      createSpeditionOrderDto,
      {
        id: '1',
        name: 'Dominik Kasprzak',
        email: 'd.kasprzak@rajkotransport.eu',
        phoneNumber: '+48 451-683-803',
      },
      contractor,
      newOrderId,
    );

    await this.speditionOrderRepository.createSpeditionOrder(newSpeditionOrder);

    return newSpeditionOrder;
  }

  async findOne(id: string) {
    return await this.speditionOrderRepository.findSpeditionOrderById(
      COMPANY_ID,
      id,
    );
  }

  async update(
    id: string,
    updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ): Promise<SpeditionOrder | null> {
    const foundSpeditionOrder =
      await this.speditionOrderRepository.findSpeditionOrderById(
        updateSpeditionOrderDto.companyId,
        id,
      );

    if (!foundSpeditionOrder) {
      return null;
    }

    const contractor = await this.contractorService.findOne(
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
      loading: updateSpeditionOrderDto.loading,
      unloading: updateSpeditionOrderDto.unloading,
      loadDetails: updateSpeditionOrderDto.loadDetails,
      freight: updateSpeditionOrderDto.freight,
      driver: updateSpeditionOrderDto.driver,
      vehicle: updateSpeditionOrderDto.vehicle,
      additionalInfo: updateSpeditionOrderDto.additionalInfo,
      creator: {
        id: '1',
        name: 'Dominik Kasprzak',
        email: 'd.kasprzak@rajkotransport.eu',
        phoneNumber: '+48 451-683-803',
      },
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

  async remove(id: string) {
    await this.speditionOrderRepository.deleteSpeditionOrder(COMPANY_ID, id);
  }

  private async createNewOrderId(): Promise<string> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfCurrentMonthTime = startOfCurrentMonth.getTime();

    const orders =
      await this.speditionOrderRepository.findAllSpeditionOrders(COMPANY_ID);

    const thisMonthOrders = orders.filter(
      ({ creationDate }) => startOfCurrentMonthTime <= creationDate,
    );

    const nextOrderId = thisMonthOrders.length + 1;

    const normalCurrentMonth = currentMonth + 1;
    const preparedMonth =
      normalCurrentMonth >= 10 ? normalCurrentMonth : `0${normalCurrentMonth}`;

    return `${nextOrderId}/${preparedMonth}/${currentYear}`;
  }
}
