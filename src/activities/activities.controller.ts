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
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Activity } from './entities/activity.entity';
import { ActivityType } from './entities/activity-type.entity';

@ApiTags('Activities')
@ApiBearerAuth('JWT-auth')
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Activities endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON', 'VOLUNTEER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
    type: Activity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createActivity(@Body() createDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of activities retrieved successfully',
    type: [Activity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllActivities(@Query() queryDto: QueryActivityDto) {
    return this.activitiesService.findAllActivities(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get activity statistics' })
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
    return this.activitiesService.getStats();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming activities' })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Maximum number of activities to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming activities retrieved successfully',
    type: [Activity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUpcomingActivities(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.activitiesService.getUpcomingActivities(parsedLimit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity retrieved successfully',
    type: Activity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async findOneActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOneActivity(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON', 'VOLUNTEER')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity ID' })
  @ApiBody({ type: UpdateActivityDto })
  @ApiResponse({
    status: 200,
    description: 'Activity updated successfully',
    type: Activity,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateActivityDto,
  ) {
    return this.activitiesService.updateActivity(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async removeActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.removeActivity(id);
  }

  // Activity Types endpoints
  @Post('types')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new activity type' })
  @ApiBody({ type: CreateActivityTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Activity type created successfully',
    type: ActivityType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createActivityType(
    @Body() createDto: CreateActivityTypeDto,
    @GetUser() user: User,
  ) {
    return this.activitiesService.createActivityType(createDto, user.code);
  }

  @Get('types/all')
  @ApiOperation({ summary: 'Get all activity types' })
  @ApiResponse({
    status: 200,
    description: 'List of activity types retrieved successfully',
    type: [ActivityType],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllActivityTypes() {
    return this.activitiesService.findAllActivityTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get an activity type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity type ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity type retrieved successfully',
    type: ActivityType,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Activity type not found' })
  async findOneActivityType(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOneActivityType(id);
  }

  @Patch('types/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @ApiOperation({ summary: 'Update an activity type' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity type ID' })
  @ApiBody({ type: UpdateActivityTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Activity type updated successfully',
    type: ActivityType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Activity type not found' })
  async updateActivityType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateActivityTypeDto,
    @GetUser() user: User,
  ) {
    return this.activitiesService.updateActivityType(id, updateDto, user.code);
  }

  @Delete('types/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an activity type' })
  @ApiParam({ name: 'id', type: 'number', description: 'Activity type ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity type deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Activity type not found' })
  async removeActivityType(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.removeActivityType(id);
  }
}
