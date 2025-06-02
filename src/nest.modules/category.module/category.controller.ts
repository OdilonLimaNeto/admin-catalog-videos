import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { type CreateCategoryDTO } from './dto/create.category.dto';
import { UpdateCategoryDTO } from './dto/update.category.dto';
import { CreateCategoryUseCase } from '@core/category/application/use.cases/create.category/create.category.use.case';
import { UpdateCategoryUseCase } from '@core/category/application/use.cases/update.category/update.category.use.case';
import { DeleteCategoryUseCase } from '@core/category/application/use.cases/delete.category/delete.category.use.case';
import { GetCategoryUseCase } from '@core/category/application/use.cases/get.category/get.category.use.case';
import {
  ListCategoryUseCase,
  type ListCategoryOutput,
} from '@core/category/application/use.cases/list.category/list.category.use.case';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './presenters/category.presenter';
import type { CategoryOutput } from '@core/category/application/use.cases/common/category.output';
import type { SearchDategoryDTO } from './dto/search.category.dto';

@Controller('category')
export class CategoryController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getCategoryUseCase: GetCategoryUseCase;

  @Inject(ListCategoryUseCase)
  private listCategoryUseCase: ListCategoryUseCase;

  @Post()
  async create(@Body() data: CreateCategoryDTO): Promise<CategoryPresenter> {
    const output = await this.createCategoryUseCase.execute(data);
    return CategoryController.serialize(output);
  }

  @Get()
  async search(@Query() data: SearchDategoryDTO) {
    const output = await this.listCategoryUseCase.execute(data);
    return CategoryController.serializeCollection(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() data: UpdateCategoryDTO,
  ): Promise<CategoryPresenter> {
    const output = await this.updateCategoryUseCase.execute({ ...data, id });
    return CategoryController.serialize(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    id: string,
  ): Promise<CategoryPresenter> {
    const output = await this.getCategoryUseCase.execute({ id });
    return CategoryController.serialize(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ): Promise<void> {
    await this.deleteCategoryUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput): CategoryPresenter {
    return new CategoryPresenter(output);
  }

  static serializeCollection(
    output: ListCategoryOutput,
  ): CategoryCollectionPresenter {
    return new CategoryCollectionPresenter(output);
  }
}
