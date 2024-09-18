import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { User } from '@shared/entities/users/user.entity';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { LoginDto } from '@api/modules/auth/dtos/login.dto';
import { LocalAuthGuard } from '@api/modules/auth/guards/local-auth.guard';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { Public } from '@api/modules/auth/decorators/is-public.decorator';
import { PasswordRecoveryService } from '@api/modules/auth/services/password-recovery.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private readonly passwordRecovery: PasswordRecoveryService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User) {
    return this.authService.logIn(user);
  }

  @Public()
  @Post('recover-password')
  async recoverPassword(
    @Headers('origin') origin: string,
    @Body() body: { email: string },
  ) {
    await this.passwordRecovery.recoverPassword(body.email, origin);
  }
}
