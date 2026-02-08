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
import { EcclesiasticalUnitsService } from './ecclesiastical-units.service';
import { CreateEcclesiasticalUnitDto } from './dto/create-ecclesiastical-unit.dto';
import { UpdateEcclesiasticalUnitDto } from './dto/update-ecclesiastical-unit.dto';
import { QueryEcclesiasticalUnitDto } from './dto/query-ecclesiastical-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { EcclesiasticalUnit } from './entities/ecclesiastical-unit.entity';

@ApiTags('Ecclesiastical Units')
@ApiBearerAuth('JWT-auth')
@Controller('ecclesiastical-units')
@UseGuards(JwtAuthGuard)
export class EcclesiasticalUnitsController {
  constructor(
    private readonly ecclesiasticalUnitsService: EcclesiasticalUnitsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new ecclesiastical unit' })
  @ApiBody({ type: CreateEcclesiasticalUnitDto })
  @ApiResponse({
    status: 201,
    description: 'Ecclesiastical unit created successfully',
    type: EcclesiasticalUnit,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async create(
    @Body() createDto: CreateEcclesiasticalUnitDto,
    @GetUser() user: User,
  ) {
    return this.ecclesiasticalUnitsService.create(createDto, user.code);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ecclesiastical units with filtering and pagination' })
  @ApiQuery({ type: QueryEcclesiasticalUnitDto })
  @ApiResponse({
    status: 200,
    description: 'List of ecclesiastical units retrieved successfully',
    type: [EcclesiasticalUnit],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() queryDto: QueryEcclesiasticalUnitDto) {
    return this.ecclesiasticalUnitsService.findAll(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get ecclesiastical units statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byType: { type: 'object' },
        byParentUnit: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getStats() {
    return this.ecclesiasticalUnitsService.getStats();
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get hierarchical tree structure of ecclesiastical units' })
  @ApiQuery({
    name: 'rootId',
    required: false,
    type: Number,
    description: 'Root unit ID to start the hierarchy from',
  })
  @ApiResponse({
    status: 200,
    description: 'Hierarchy tree retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          type: { type: 'string' },
          children: { type: 'array' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHierarchy(@Query('rootId') rootId?: string) {
    const parsedRootId = rootId ? parseInt(rootId, 10) : undefined;
    return this.ecclesiasticalUnitsService.getHierarchy(parsedRootId);
  }

  @Get('my-subscriptions')
  @ApiOperation({ summary: 'Get current user subscriptions to ecclesiastical units' })
  @ApiResponse({
    status: 200,
    description: 'User subscriptions retrieved successfully',
    type: [EcclesiasticalUnit],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMySubscriptions(@GetUser() user: User) {
    return this.ecclesiasticalUnitsService.getUserSubscriptions(user.code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ecclesiastical unit by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiQuery({
    name: 'lang',
    required: false,
    type: String,
    description: 'Language code (e.g., en, fr). If not provided, returns all translations.',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Ecclesiastical unit retrieved successfully',
    type: EcclesiasticalUnit,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
  ) {
    if (lang) {
      return this.ecclesiasticalUnitsService.findOneInLanguage(id, lang);
    }
    return this.ecclesiasticalUnitsService.findOne(id);
  }

  @Get(':id/subscribers')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get all subscribers of a specific ecclesiastical unit' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscribers list retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          nom: { type: 'string' },
          prenom: { type: 'string' },
          email: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async getSubscribers(@Param('id', ParseIntPipe) id: number) {
    return this.ecclesiasticalUnitsService.getSubscribers(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @ApiOperation({ summary: 'Update an ecclesiastical unit' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiBody({ type: UpdateEcclesiasticalUnitDto })
  @ApiResponse({
    status: 200,
    description: 'Ecclesiastical unit updated successfully',
    type: EcclesiasticalUnit,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEcclesiasticalUnitDto,
    @GetUser() user: User,
  ) {
    return this.ecclesiasticalUnitsService.update(id, updateDto, user.code);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an ecclesiastical unit (soft delete)' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Ecclesiastical unit deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ecclesiasticalUnitsService.remove(id);
  }

  @Post(':id/subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subscribe current user to an ecclesiastical unit' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully subscribed to ecclesiastical unit',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Already subscribed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async subscribe(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.ecclesiasticalUnitsService.subscribe(id, user.code);
  }

  @Delete(':id/subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe current user from an ecclesiastical unit' })
  @ApiParam({ name: 'id', type: Number, description: 'Ecclesiastical unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unsubscribed from ecclesiastical unit',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Not subscribed to this unit' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Ecclesiastical unit not found' })
  async unsubscribe(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.ecclesiasticalUnitsService.unsubscribe(id, user.code);
  }
}
