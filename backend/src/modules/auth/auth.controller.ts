import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { Public } from '../../common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@CurrentTenant() tenantId: string, @Body() body: { email: string; password?: string }) {
    return this.authService.login(tenantId, body.email);
  }

  @Get('me')
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}
