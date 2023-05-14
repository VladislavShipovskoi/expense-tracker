import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/dto/create-user-dto';
import { User, UsersDocument } from 'src/modules/users/users.schema';
import * as bcrypt from 'bcrypt';

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

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const createdUser = new this.usersModel({
      username: createUserDto.username,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username });
  }
}
