import { Injectable } from '@nestjs/common';
import { CreateSpeditionOrderDto } from './dto/create-spedition-order.dto';
import { UpdateSpeditionOrderDto } from './dto/update-spedition-order.dto';
import { speditionOrders as speditionOrdersData } from './spedition-orders-mock-data';
import { SpeditionOrder } from './entities/spedition-order.entity';
import { ContractorsService } from '../contractors/contractors.service';

@Injectable()
export class SpeditionOrdersService {
  private speditionOrders: SpeditionOrder[];

  constructor(private readonly contractorService: ContractorsService) {
    this.speditionOrders = speditionOrdersData;
  }

  create(createSpeditionOrderDto: CreateSpeditionOrderDto) {
    const foundContractor = this.contractorService.findOne(
      createSpeditionOrderDto.contractor.id,
    );

    if (!foundContractor) {
      throw new Error(
        `No contractor found for ${createSpeditionOrderDto.contractor.id}`,
      );
    }

    const foundContact = foundContractor.contacts.find(
      (contact) => contact.id === createSpeditionOrderDto.contractor.contactId,
    );

    const contractor: SpeditionOrder['contractor'] = {
      ...foundContractor,
      contact: foundContact,
    };

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      createSpeditionOrderDto,
      {
        id: '1',
        name: 'Dominik Kasprzak',
        email: 'd.kasprzak@rajkotransport.eu',
        phoneNumber: '+48 451-683-803',
      },
      contractor,
      this.createNewOrderId(),
    );

    this.speditionOrders.push(newSpeditionOrder);

    return newSpeditionOrder;
  }

  findAll() {
    return this.speditionOrders.filter(({ status }) => status !== 'REMOVED');
  }

  findOne(id: string) {
    return this.speditionOrders.find(
      (speditionOrder) =>
        speditionOrder.id === id && speditionOrder.status !== 'REMOVED',
    );
  }

  update(
    id: string,
    updateSpeditionOrderDto: UpdateSpeditionOrderDto,
  ): SpeditionOrder {
    const contractor = this.contractorService.findOne(
      updateSpeditionOrderDto.contractor.id,
    );

    const selectedContact = contractor.contacts.find(
      (contact) => contact.id === updateSpeditionOrderDto.contractor.contactId,
    );

    const updatedSpeditionOrder: SpeditionOrder = {
      ...updateSpeditionOrderDto,
      creator: {
        id: '1',
        name: 'Dominik Kasprzak',
        email: 'd.kasprzak@rajkotransport.eu',
        phoneNumber: '+48 451-683-803',
      },
      contractor: {
        id: contractor.id,
        name: contractor.name,
        email: contractor.email,
        address: contractor.address,
        phoneNumber: contractor.phoneNumber,
        nip: contractor.nip,
        contact: selectedContact,
      },
    };

    this.speditionOrders = this.speditionOrders.map(
      (speditionOrder): SpeditionOrder => {
        if (speditionOrder.id === id && speditionOrder.status !== 'REMOVED') {
          return updatedSpeditionOrder;
        }

        return speditionOrder;
      },
    );

    return updatedSpeditionOrder;
  }

  remove(id: string) {
    this.speditionOrders = this.speditionOrders.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'REMOVED',
        };
      }
      return item;
    });
  }

  private createNewOrderId(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfCurrentMonthTime = startOfCurrentMonth.getTime();

    const thisMonthOrders = this.speditionOrders.filter(
      ({ creationDate }) => startOfCurrentMonthTime <= creationDate,
    );

    const nextOrderId = thisMonthOrders.length + 1;

    const normalCurrentMonth = currentMonth + 1;
    const preparedMonth =
      normalCurrentMonth >= 10 ? normalCurrentMonth : `0${normalCurrentMonth}`;

    return `${nextOrderId}/${preparedMonth}/${currentYear}`;
  }
}