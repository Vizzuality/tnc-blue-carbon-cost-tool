import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@api/modules/auth/guards/roles.guard';

@Controller('admin')
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
export class AdminController {}
