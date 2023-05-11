import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/entities/auth/dto/create-user-dto';
import { User, UsersDocument } from 'src/entities/users/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async registartion(createUserDto: CreateUserDto): Promise<User | null> {
    const existUser = await this.usersModel.collection.findOne({
      username: createUserDto.username,
    });

    if (existUser) {
      return null;
    }

    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }
}
