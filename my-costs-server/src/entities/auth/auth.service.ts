import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { LoginUserDto } from './login-user-dto';
import { CreateUserDto } from '../users/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

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
}
