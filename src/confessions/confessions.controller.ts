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
import { ConfessionsService } from './confessions.service';
import { CreateConfessionDto } from './dto/create-confession.dto';
import { UpdateConfessionDto } from './dto/update-confession.dto';
import { QueryConfessionDto } from './dto/query-confession.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Confession } from './entities/confession.entity';

@ApiTags('Confessions')
@ApiBearerAuth('JWT-auth')
@Controller('confessions')
@UseGuards(JwtAuthGuard)
export class ConfessionsController {
  constructor(private readonly confessionsService: ConfessionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new confession schedule' })
  @ApiBody({ type: CreateConfessionDto })
  @ApiResponse({
    status: 201,
    description: 'Confession schedule created successfully',
    type: Confession,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createConfession(@Body() createDto: CreateConfessionDto) {
    return this.confessionsService.createConfession(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all confession schedules with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of confession schedules retrieved successfully',
    type: [Confession],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllConfessions(@Query() queryDto: QueryConfessionDto) {
    return this.confessionsService.findAllConfessions(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get confession statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        upcoming: { type: 'number' },
        past: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async getStats() {
    return this.confessionsService.getStats();
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get confession schedules by unit ID' })
  @ApiParam({ name: 'unitId', type: 'number', description: 'Unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Confession schedules for the unit retrieved successfully',
    type: [Confession],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getConfessionsByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.confessionsService.getConfessionsByUnit(unitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a confession schedule by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Confession ID' })
  @ApiResponse({
    status: 200,
    description: 'Confession schedule retrieved successfully',
    type: Confession,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Confession schedule not found' })
  async findOneConfession(@Param('id', ParseIntPipe) id: number) {
    return this.confessionsService.findOneConfession(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update a confession schedule' })
  @ApiParam({ name: 'id', type: 'number', description: 'Confession ID' })
  @ApiBody({ type: UpdateConfessionDto })
  @ApiResponse({
    status: 200,
    description: 'Confession schedule updated successfully',
    type: Confession,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Confession schedule not found' })
  async updateConfession(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateConfessionDto,
  ) {
    return this.confessionsService.updateConfession(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a confession schedule' })
  @ApiParam({ name: 'id', type: 'number', description: 'Confession ID' })
  @ApiResponse({
    status: 200,
    description: 'Confession schedule deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Confession schedule not found' })
  async removeConfession(@Param('id', ParseIntPipe) id: number) {
    return this.confessionsService.removeConfession(id);
  }
}
