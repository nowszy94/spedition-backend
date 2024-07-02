import { NotFoundException } from '@nestjs/common';

export class SpeditionOrderNotFoundException extends NotFoundException {
  constructor(speditionOrderId: string) {
    super(`spedition order with id ${speditionOrderId} not found`);
  }
}
