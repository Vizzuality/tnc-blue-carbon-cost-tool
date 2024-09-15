import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@shared/entities/users/user.entity';
import { AuthenticationService } from '@api/modules/auth/authentication/authentication.service';
import { LoginDto } from '@api/modules/auth/dtos/login.dto';
import { LocalAuthGuard } from '@api/modules/auth/guards/local-auth.guard';
import { GetUser } from '@api/modules/auth/decorators/get-user.decorator';
import { Public } from '@api/modules/auth/decorators/is-public.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Public()
  @Post('signup')
  async signup(@Body() signupDto: LoginDto) {
    return this.authService.signUp(signupDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User) {
    return this.authService.logIn(user);
  }
}
