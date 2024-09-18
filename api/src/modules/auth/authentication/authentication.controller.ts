import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { User } from '@shared/entities/users/user.entity';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { LocalAuthGuard } from '@api/modules/auth/guards/local-auth.guard';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { Public } from '@api/modules/auth/decorators/is-public.decorator';
import { PasswordRecoveryService } from '@api/modules/auth/services/password-recovery.service';
import { authContract } from '@shared/contracts/auth/auth.contract';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private readonly passwordRecovery: PasswordRecoveryService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @TsRestHandler(authContract.login)
  async login(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(authContract.login, async () => {
      const userWithAccessToken = await this.authService.logIn(user);
      return {
        body: userWithAccessToken,
        status: 201,
      };
    });
  }

  // TODO: Wrap this in a ts-rest handler
  @Public()
  @Post('recover-password')
  async recoverPassword(
    @Headers('origin') origin: string,
    @Body() body: { email: string },
  ) {
    await this.passwordRecovery.recoverPassword(body.email, origin);
  }
}
