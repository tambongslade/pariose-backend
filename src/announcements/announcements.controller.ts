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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CreateAnnouncementTypeDto } from './dto/create-announcement-type.dto';
import { UpdateAnnouncementTypeDto } from './dto/update-announcement-type.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementType } from './entities/announcement-type.entity';

@ApiTags('Announcements')
@ApiBearerAuth('JWT-auth')
@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Announcements endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({
    status: 201,
    description: 'Announcement created successfully',
    type: Announcement,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createAnnouncement(
    @Body() createDto: CreateAnnouncementDto,
    @GetUser() user: User,
  ) {
    return this.announcementsService.createAnnouncement(createDto, user.code);
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcements with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of announcements retrieved successfully',
    type: [Announcement],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllAnnouncements(@Query() queryDto: QueryAnnouncementDto) {
    return this.announcementsService.findAllAnnouncements(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get announcement statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        expired: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async getStats() {
    return this.announcementsService.getStats();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active announcements' })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Maximum number of announcements to return (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Active announcements retrieved successfully',
    type: [Announcement],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getActiveAnnouncements(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.announcementsService.getActiveAnnouncements(parsedLimit);
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get announcements by unit ID' })
  @ApiParam({ name: 'unitId', type: 'number', description: 'Unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcements for the unit retrieved successfully',
    type: [Announcement],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAnnouncementsByUnit(
    @Param('unitId', ParseIntPipe) unitId: number,
  ) {
    return this.announcementsService.getAnnouncementsByUnit(unitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an announcement by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement retrieved successfully',
    type: Announcement,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async findOneAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.findOneAnnouncement(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update an announcement' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement ID' })
  @ApiBody({ type: UpdateAnnouncementDto })
  @ApiResponse({
    status: 200,
    description: 'Announcement updated successfully',
    type: Announcement,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async updateAnnouncement(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.updateAnnouncement(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async removeAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.removeAnnouncement(id);
  }

  // Announcement Types endpoints
  @Post('types')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new announcement type' })
  @ApiBody({ type: CreateAnnouncementTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Announcement type created successfully',
    type: AnnouncementType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createAnnouncementType(@Body() createDto: CreateAnnouncementTypeDto) {
    return this.announcementsService.createAnnouncementType(createDto);
  }

  @Get('types/all')
  @ApiOperation({ summary: 'Get all announcement types' })
  @ApiResponse({
    status: 200,
    description: 'List of announcement types retrieved successfully',
    type: [AnnouncementType],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllAnnouncementTypes() {
    return this.announcementsService.findAllAnnouncementTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get an announcement type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement type ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement type retrieved successfully',
    type: AnnouncementType,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Announcement type not found' })
  async findOneAnnouncementType(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.findOneAnnouncementType(id);
  }

  @Patch('types/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @ApiOperation({ summary: 'Update an announcement type' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement type ID' })
  @ApiBody({ type: UpdateAnnouncementTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Announcement type updated successfully',
    type: AnnouncementType,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Announcement type not found' })
  async updateAnnouncementType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAnnouncementTypeDto,
  ) {
    return this.announcementsService.updateAnnouncementType(id, updateDto);
  }

  @Delete('types/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an announcement type' })
  @ApiParam({ name: 'id', type: 'number', description: 'Announcement type ID' })
  @ApiResponse({
    status: 200,
    description: 'Announcement type deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Announcement type not found' })
  async removeAnnouncementType(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.removeAnnouncementType(id);
  }
}
