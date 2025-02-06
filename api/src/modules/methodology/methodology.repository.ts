import { Injectable } from '@nestjs/common';
import { MethodologySource } from '@shared/entities/methodology/methodology-source.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MethodologySourcesRepository extends Repository<MethodologySource> {}
