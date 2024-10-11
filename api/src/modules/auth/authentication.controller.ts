import {
  Controller,
  UseGuards,
  Headers,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { User } from '@shared/entities/users/user.entity';
import { LocalAuthGuard } from '@api/modules/auth/guards/local-auth.guard';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { Public } from '@api/modules/auth/decorators/is-public.decorator';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { ControllerResponse } from '@api/types/controller-response.type';
import { AuthGuard } from '@nestjs/passport';
import { ResetPassword } from '@api/modules/auth/strategies/reset-password.strategy';
import { authContract } from '@shared/contracts/auth.contract';
import { AuthenticationService } from '@api/modules/auth/authentication.service';
import { SignUp } from '@api/modules/auth/strategies/sign-up.strategy';
import { CommandBus } from '@nestjs/cqrs';
import { RequestPasswordRecoveryCommand } from '@api/modules/auth/commands/request-password-recovery.command';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private readonly commandBus: CommandBus,
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

  @UseGuards(AuthGuard(SignUp))
  @TsRestHandler(authContract.signUp)
  async signUp(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(authContract.signUp, async ({ body }) => {
      await this.authService.signUp(user, body);
      return {
        body: null,
        status: 201,
      };
    });
  }

  @UseGuards(AuthGuard(ResetPassword))
  @TsRestHandler(authContract.resetPassword)
  async resetPassword(@GetUser() user: User): Promise<ControllerResponse> {
    return tsRestHandler(
      authContract.resetPassword,
      async ({ body: { password } }) => {
        await this.authService.resetPassword(user, password);
        return {
          body: null,
          status: 201,
        };
      },
    );
  }

  @TsRestHandler(authContract.requestPasswordRecovery)
  async requestPasswordRecovery(
    @Headers('origin') origin: string,
  ): Promise<ControllerResponse> {
    return tsRestHandler(
      authContract.requestPasswordRecovery,
      async ({ body: { email } }) => {
        await this.commandBus.execute(
          new RequestPasswordRecoveryCommand(email),
        );
        return {
          body: null,
          status: HttpStatus.CREATED,
        };
      },
    );
  }

  @Public()
  @TsRestHandler(authContract.validateToken)
  async validateToken(): Promise<ControllerResponse> {
    return tsRestHandler(
      authContract.validateToken,
      async ({ headers: { authorization }, query: { tokenType } }) => {
        await this.authService.verifyToken(authorization, tokenType);
        return {
          body: null,
          status: HttpStatus.OK,
        };
      },
    );
  }
}
