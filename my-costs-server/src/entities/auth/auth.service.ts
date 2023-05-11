import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.schema';
import { LoginUserDto } from './login-user-dto';
import { CreateUserDto } from '../users/create-user-dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
