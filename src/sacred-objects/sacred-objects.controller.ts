import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SacredObjectsService } from './sacred-objects.service';
import { CreateSacredObjectDto } from './dto/create-sacred-object.dto';
import { UpdateSacredObjectDto } from './dto/update-sacred-object.dto';
import { QuerySacredObjectDto } from './dto/query-sacred-object.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { SacredObject } from './entities/sacred-object.entity';

@ApiTags('Sacred Objects')
@ApiBearerAuth('JWT-auth')
@Controller('sacred-objects')
@UseGuards(JwtAuthGuard)
export class SacredObjectsController {
  constructor(private readonly sacredObjectsService: SacredObjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new sacred object' })
  @ApiBody({ type: CreateSacredObjectDto })
  @ApiResponse({
    status: 201,
    description: 'Sacred object created successfully',
    type: SacredObject,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async create(@Body() createDto: CreateSacredObjectDto, @GetUser() user: User) {
    return this.sacredObjectsService.create(createDto, user.code);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sacred objects with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of sacred objects retrieved successfully',
    type: [SacredObject],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() queryDto: QuerySacredObjectDto) {
    return this.sacredObjectsService.findAll(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get sacred object statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byType: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async getStats() {
    return this.sacredObjectsService.getStats();
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get sacred objects by unit ID' })
  @ApiParam({ name: 'unitId', type: 'number', description: 'Unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Sacred objects for the unit retrieved successfully',
    type: [SacredObject],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.sacredObjectsService.findByUnit(unitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sacred object by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sacred object ID' })
  @ApiResponse({
    status: 200,
    description: 'Sacred object retrieved successfully',
    type: SacredObject,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sacred object not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sacredObjectsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update a sacred object' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sacred object ID' })
  @ApiBody({ type: UpdateSacredObjectDto })
  @ApiResponse({
    status: 200,
    description: 'Sacred object updated successfully',
    type: SacredObject,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Sacred object not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSacredObjectDto,
    @GetUser() user: User,
  ) {
    return this.sacredObjectsService.update(id, updateDto, user.code);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a sacred object' })
  @ApiParam({ name: 'id', type: 'number', description: 'Sacred object ID' })
  @ApiResponse({
    status: 200,
    description: 'Sacred object deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Sacred object not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sacredObjectsService.remove(id);
  }
}
