import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { LoginUserDto } from './dto/login-user-dto';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.usersService.findOne(loginUserDto.username);
    if (!user) {
      return null;
    }

    return user;
  }

  async registrationUser(createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(createUserDto);
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
          secret: jwtConstants.secret,
          expiresIn: '30d',
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

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  getToken(request: Request) {
    return request.headers.authorization.split(' ')[1];
  }

  async getUserByTokenData(token: string): Promise<User | null> {
    const parsedToken = this.parseJwt(token);
    return await this.usersService.findOne(parsedToken.user.username);
  }
}
