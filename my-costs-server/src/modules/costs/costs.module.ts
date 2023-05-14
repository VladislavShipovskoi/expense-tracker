import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';
import { Cost, CostSchema } from './costs.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Cost.name, schema: CostSchema }]),
  ],
  controllers: [CostsController],
  providers: [CostsService],
})
export class CostsModule {}
