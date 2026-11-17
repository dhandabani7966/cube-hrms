import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TenantContextService],
  exports: [AuthService],
})
export class AuthModule {}
