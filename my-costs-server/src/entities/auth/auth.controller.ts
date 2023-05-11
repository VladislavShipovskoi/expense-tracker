import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user-dto';
import { Response } from 'express';
import { RegistrationGuard } from './guards/registration.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './login-user-dto';
import { LoginGuard } from './guards/login.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private usersServise: UsersService,
    private authServise: AuthService,
  ) {}

  @UseGuards(RegistrationGuard)
  @Post('registrtion')
  async registrationUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.authServise.registrationUser(createUserDto);
    res.statusCode = HttpStatus.CREATED;
    return res.send('user created');
  }

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.authServise.loginUser(loginUserDto);
    res.statusCode = HttpStatus.OK;
    return res.send({ username: user.username });
  }
}
