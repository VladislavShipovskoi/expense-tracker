import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { Response } from 'express';
import { RegistrationGuard } from './guards/registration.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(RegistrationGuard)
  @Post('registration')
  async registrationUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.authService.registrationUser(createUserDto);
    return res.status(HttpStatus.CREATED).send();
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginUser(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginWithCredentials(req.body, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(
    @Body() body: { username: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { refresh_token } = this.authService.getTokens(req);
    const validToken = this.authService.verifyToken(refresh_token);
    const user = await this.usersService.findOne(body.username);
    const accessToken = await this.authService.generateAccessToken(user);

    if (!validToken.error || validToken.error === 'jwt expired') {
      const refreshToken = await this.authService.generateRefreshToken(
        user._id as string,
      );
      res.cookie(
        'jwt',
        { ...accessToken, ...refreshToken },
        { httpOnly: true },
      );
      return res
        .status(HttpStatus.OK)
        .send({ ...accessToken, ...refreshToken, username: user.username });
    } else {
      res.status(HttpStatus.BAD_REQUEST).send({ error: validToken.error });
    }
  }
}
