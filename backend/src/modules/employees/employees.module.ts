import { Module } from '@nestjs/common';
import {
  EmployeesController,
  DepartmentsController,
  DesignationsController,
  LocationsController,
} from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  controllers: [
    EmployeesController,
    DepartmentsController,
    DesignationsController,
    LocationsController,
  ],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
