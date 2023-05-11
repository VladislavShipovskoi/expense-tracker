import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/entities/users/create-user-dto';
import { User, UsersDocument } from 'src/entities/users/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    const existUser = await this.usersModel.collection.findOne({
      username: createUserDto.username,
    });

    if (existUser) {
      return null;
    }

    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }

  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username });
  }

  async validateUser(username: string): Promise<User | null> {
    const user = await this.findOne(username);
    if (!user) {
      return null;
    }

    return user;
  }
}
