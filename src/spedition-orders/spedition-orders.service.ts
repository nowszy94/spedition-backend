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
      id: foundContractor.id,
      name: foundContractor.name,
      contact: foundContact,
    };

    const newSpeditionOrder = CreateSpeditionOrderDto.toNewEntity(
      createSpeditionOrderDto,
      { id: '1', name: 'Dominik Kasprzak' },
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
    this.speditionOrders = this.speditionOrders.map(
      (speditionOrder): SpeditionOrder => {
        if (speditionOrder.id === id && speditionOrder.status !== 'REMOVED') {
          return updateSpeditionOrderDto;
        }

        return speditionOrder;
      },
    );

    return updateSpeditionOrderDto;
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
