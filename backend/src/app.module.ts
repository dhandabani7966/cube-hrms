import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { EssModule } from './modules/ess/ess.module';
import { CasesModule } from './modules/cases/cases.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OffboardingModule } from './modules/offboarding/offboarding.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TenantContextService } from './common/context/tenant-context.service';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    OnboardingModule,
    EmployeesModule,
    EssModule,
    CasesModule,
    DocumentsModule,
    OffboardingModule,
  ],
  providers: [
    TenantContextService,
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
