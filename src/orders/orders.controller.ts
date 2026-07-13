import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { string } from 'joi';
import { stat } from 'fs';

@Controller('orders')
export class OrdersController {
  constructor(
      @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
    ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)
  }


  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {

    return this.ordersClient.send('findAllOrders', orderPaginationDto)
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string ){
  
      try {
        const order = await firstValueFrom(
          this.ordersClient.send('findOneOrder', { id })
        );
        return order;
  
      } catch (error) {
        throw new RpcException(error);
      }
      
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto, 
    @Query() paginationDto: PaginationDto,
  ){
  
      try {
        return this.ordersClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        });
        
      } catch (error) {
        throw new RpcException(error);
      }
      
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto,
  ){
    try {
        return this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error) {
      throw new RpcException(error);
    }
  }

}
