import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { firstValueFrom } from 'rxjs';

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
  findAll() {
    return this.ordersClient.send('findAllOrders',{})
  }

  @Get(':id')
  async findOne(@Param('id') id: string ){
  
      try {
        const order = await firstValueFrom(
          this.ordersClient.send('findOneOrder', { id: +id })
        );
        return order;
  
      } catch (error) {
        throw new RpcException(error);
      }
      
    }

}
