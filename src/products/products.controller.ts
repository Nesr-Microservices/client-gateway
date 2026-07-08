import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(){
    return 'Crea un producto';
  }

  @Get()
  findAllProducts( @Query() PaginationDto: PaginationDto){
    return this.productsClient.send({cmd: 'find_all_product'}, PaginationDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string ){

    try {
      const product = await firstValueFrom(
        this.productsClient.send({cmd: 'find_one_product'}, { id })
      );
      return product;

    } catch (error) {
      throw new BadRequestException(error);
    }
    
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string ){
    return 'Esta función elimina el producto ' + id;
  }

  @Patch(':id')
  patchProduct(
    @Param('id') id: string,
    @Body() body:any
  ){
    return 'Esta función actualiza el producto ' + id;
  }

}
