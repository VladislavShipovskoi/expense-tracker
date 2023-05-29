import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpStatus,
  UseGuards,
  HttpCode,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost-dto';
import { AuthService } from '../auth/auth.service';
import { UpdateCostDto } from './dto/update-cost-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('costs')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCost(@Req() req: Request, @Res() res: Response) {
    const tokens = this.authService.getTokens(req);
    const user = await this.authService.getUserByTokenData(tokens.access_token);
    const allCosts = await this.costsService.findAll();
    const userCosts = allCosts.filter(
      (cost) => cost.userId === user._id.toString(),
    );
    return res.send(userCosts);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @HttpCode(HttpStatus.OK)
  async createCost(@Body() createCostDto: CreateCostDto, @Req() req: Request) {
    const tokens = this.authService.getTokens(req);
    const user = this.authService.getUserByTokenData(tokens.access_token);

    return await this.costsService.createCost({
      ...createCostDto,
      userId: (await user)._id as string,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCost(
    @Body() updateCostDto: UpdateCostDto,
    @Param('id') id: string,
  ) {
    return await this.costsService.updateCost(updateCostDto, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCost(@Param('id') id: string) {
    return await this.costsService.removeCost(id);
  }
}
