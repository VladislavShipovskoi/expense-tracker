import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { Response } from 'express';
import { RegistrationGuard } from './guards/registration.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RegistrationGuard)
  @Post('registrtion')
  async registrationUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.authService.registrationUser(createUserDto);
    res.statusCode = HttpStatus.CREATED;
    return res.send('user created');
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginWithCredentials(req.body, res);
  }
}
