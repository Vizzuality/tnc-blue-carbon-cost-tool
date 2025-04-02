import { InternalServerErrorException } from '@nestjs/common';

export class CalculationException extends InternalServerErrorException {
  constructor(message?: string) {
    super(message);
  }
}
