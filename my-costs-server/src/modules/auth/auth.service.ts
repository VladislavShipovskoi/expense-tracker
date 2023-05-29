import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  Res,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginWithCredentials(user: User, @Res() res: Response): Promise<void> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user._id as string);
    res
      .cookie('jwt', { ...accessToken, ...refreshToken }, { httpOnly: true })
      .status(HttpStatus.OK)
      .send({ ...accessToken, ...refreshToken, username: user.username });
  }

  async registrationUser(createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(createUserDto);
  }

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotAcceptableException(
        `User with name: ${username} does not exist`,
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new NotAcceptableException('Password incorrect');
    }

    return user;
  }

  async generateAccessToken(user: User) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }

  async generateRefreshToken(userId: string) {
    return {
      refresh_token: this.jwtService.sign(
        { userId },
        {
          secret: this.configService.get('jwt.accessTokenSecret'),
          expiresIn: this.configService.get('jwt.accessTokenExpiration'),
        },
      ),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return { error: error.message };
    }
  }

  getTokens(request: Request) {
    return { ...request.cookies.jwt };
  }

  async getUserByTokenData(token: string): Promise<User | null> {
    const tokenPayload = this.jwtService.verify(token);
    return await this.usersService.findOne(tokenPayload.user.username);
  }
}
