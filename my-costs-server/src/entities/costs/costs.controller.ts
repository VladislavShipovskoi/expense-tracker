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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/create-cost-dto';
import { AuthService } from '../auth/auth.service';
import { JWTGuard } from '../auth/guards/jwt.guard';

@Controller('cost')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JWTGuard)
  @HttpCode(HttpStatus.OK)
  async getAllCost(@Req() req: Request, @Res() res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.getUserByTokenData(token);
    const allCosts = await this.costsService.findAll();
    const userCosts = allCosts.filter(
      (cost) => cost.userId === user._id.toString(),
    );
    return res.send(userCosts);
  }

  @Post('create')
  async createCost(@Body() createCostDto: CreateCostDto, @Res() res: Response) {
    await this.costsService.createCost(createCostDto);
    res.statusCode = HttpStatus.CREATED;
    return res.send('cost created');
  }
}