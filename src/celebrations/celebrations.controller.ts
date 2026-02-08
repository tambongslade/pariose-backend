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
import { CelebrationsService } from './celebrations.service';
import { CreateCelebrationDto } from './dto/create-celebration.dto';
import { UpdateCelebrationDto } from './dto/update-celebration.dto';
import { CreateMassIntentionDto } from './dto/create-mass-intention.dto';
import { UpdateMassIntentionDto } from './dto/update-mass-intention.dto';
import { QueryCelebrationDto } from './dto/query-celebration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Celebration } from './entities/celebration.entity';
import { MassIntention } from './entities/mass-intention.entity';

@ApiTags('Celebrations')
@ApiBearerAuth('JWT-auth')
@Controller('celebrations')
@UseGuards(JwtAuthGuard)
export class CelebrationsController {
  constructor(private readonly celebrationsService: CelebrationsService) {}

  // Celebrations endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new celebration' })
  @ApiBody({ type: CreateCelebrationDto })
  @ApiResponse({
    status: 201,
    description: 'Celebration created successfully',
    type: Celebration,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createCelebration(@Body() createDto: CreateCelebrationDto) {
    return this.celebrationsService.createCelebration(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all celebrations with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of celebrations retrieved successfully',
    type: [Celebration],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllCelebrations(@Query() queryDto: QueryCelebrationDto) {
    return this.celebrationsService.findAllCelebrations(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get celebration statistics' })
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
    return this.celebrationsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a celebration by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Celebration ID' })
  @ApiResponse({
    status: 200,
    description: 'Celebration retrieved successfully',
    type: Celebration,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Celebration not found' })
  async findOneCelebration(@Param('id', ParseIntPipe) id: number) {
    return this.celebrationsService.findOneCelebration(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update a celebration' })
  @ApiParam({ name: 'id', type: 'number', description: 'Celebration ID' })
  @ApiBody({ type: UpdateCelebrationDto })
  @ApiResponse({
    status: 200,
    description: 'Celebration updated successfully',
    type: Celebration,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Celebration not found' })
  async updateCelebration(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCelebrationDto,
  ) {
    return this.celebrationsService.updateCelebration(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a celebration' })
  @ApiParam({ name: 'id', type: 'number', description: 'Celebration ID' })
  @ApiResponse({
    status: 200,
    description: 'Celebration deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Celebration not found' })
  async removeCelebration(@Param('id', ParseIntPipe) id: number) {
    return this.celebrationsService.removeCelebration(id);
  }

  // Mass Intentions endpoints
  @Post('intentions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new mass intention' })
  @ApiBody({ type: CreateMassIntentionDto })
  @ApiResponse({
    status: 201,
    description: 'Mass intention created successfully',
    type: MassIntention,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createMassIntention(
    @Body() createDto: CreateMassIntentionDto,
    @GetUser() user: User,
  ) {
    return this.celebrationsService.createMassIntention(createDto, user.code);
  }

  @Get('intentions/all')
  @ApiOperation({ summary: 'Get all mass intentions with optional celebration filter' })
  @ApiQuery({
    name: 'celebrationId',
    type: 'number',
    required: false,
    description: 'Filter by celebration ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of mass intentions retrieved successfully',
    type: [MassIntention],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllIntentions(@Query('celebrationId') celebrationId?: string) {
    const parsedId = celebrationId ? parseInt(celebrationId, 10) : undefined;
    return this.celebrationsService.findAllIntentions(parsedId);
  }

  @Get('intentions/:id')
  @ApiOperation({ summary: 'Get a mass intention by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Mass intention ID' })
  @ApiResponse({
    status: 200,
    description: 'Mass intention retrieved successfully',
    type: MassIntention,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Mass intention not found' })
  async findOneIntention(@Param('id', ParseIntPipe) id: number) {
    return this.celebrationsService.findOneIntention(id);
  }

  @Patch('intentions/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update a mass intention' })
  @ApiParam({ name: 'id', type: 'number', description: 'Mass intention ID' })
  @ApiBody({ type: UpdateMassIntentionDto })
  @ApiResponse({
    status: 200,
    description: 'Mass intention updated successfully',
    type: MassIntention,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Mass intention not found' })
  async updateMassIntention(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMassIntentionDto,
    @GetUser() user: User,
  ) {
    return this.celebrationsService.updateMassIntention(
      id,
      updateDto,
      user.code,
    );
  }

  @Delete('intentions/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a mass intention' })
  @ApiParam({ name: 'id', type: 'number', description: 'Mass intention ID' })
  @ApiResponse({
    status: 200,
    description: 'Mass intention deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Mass intention not found' })
  async removeMassIntention(@Param('id', ParseIntPipe) id: number) {
    return this.celebrationsService.removeMassIntention(id);
  }
}
