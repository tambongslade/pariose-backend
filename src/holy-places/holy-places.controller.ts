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
  ParseFloatPipe,
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
import { HolyPlacesService } from './holy-places.service';
import { CreateHolyPlaceDto } from './dto/create-holy-place.dto';
import { UpdateHolyPlaceDto } from './dto/update-holy-place.dto';
import { QueryHolyPlaceDto } from './dto/query-holy-place.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { HolyPlace } from './entities/holy-place.entity';

@ApiTags('Holy Places')
@ApiBearerAuth('JWT-auth')
@Controller('holy-places')
@UseGuards(JwtAuthGuard)
export class HolyPlacesController {
  constructor(private readonly holyPlacesService: HolyPlacesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new holy place' })
  @ApiBody({ type: CreateHolyPlaceDto })
  @ApiResponse({
    status: 201,
    description: 'Holy place created successfully',
    type: HolyPlace,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async createHolyPlace(@Body() createDto: CreateHolyPlaceDto) {
    return this.holyPlacesService.createHolyPlace(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all holy places with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'List of holy places retrieved successfully',
    type: [HolyPlace],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllHolyPlaces(@Query() queryDto: QueryHolyPlaceDto) {
    return this.holyPlacesService.findAllHolyPlaces(queryDto);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Get holy place statistics' })
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
    return this.holyPlacesService.getStats();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find holy places near a location' })
  @ApiQuery({ name: 'latitude', type: 'number', description: 'Latitude coordinate' })
  @ApiQuery({ name: 'longitude', type: 'number', description: 'Longitude coordinate' })
  @ApiQuery({
    name: 'radius',
    type: 'number',
    required: false,
    description: 'Search radius in kilometers (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Nearby holy places retrieved successfully',
    type: [HolyPlace],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findNearbyHolyPlaces(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius') radius?: string,
  ) {
    const parsedRadius = radius ? parseFloat(radius) : 10;
    return this.holyPlacesService.findNearbyHolyPlaces(
      latitude,
      longitude,
      parsedRadius,
    );
  }

  @Get('unit/:unitId')
  @ApiOperation({ summary: 'Get holy places by unit ID' })
  @ApiParam({ name: 'unitId', type: 'number', description: 'Unit ID' })
  @ApiResponse({
    status: 200,
    description: 'Holy places for the unit retrieved successfully',
    type: [HolyPlace],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHolyPlacesByUnit(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.holyPlacesService.getHolyPlacesByUnit(unitId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a holy place by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Holy place ID' })
  @ApiResponse({
    status: 200,
    description: 'Holy place retrieved successfully',
    type: HolyPlace,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Holy place not found' })
  async findOneHolyPlace(@Param('id', ParseIntPipe) id: number) {
    return this.holyPlacesService.findOneHolyPlace(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @ApiOperation({ summary: 'Update a holy place' })
  @ApiParam({ name: 'id', type: 'number', description: 'Holy place ID' })
  @ApiBody({ type: UpdateHolyPlaceDto })
  @ApiResponse({
    status: 200,
    description: 'Holy place updated successfully',
    type: HolyPlace,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Holy place not found' })
  async updateHolyPlace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateHolyPlaceDto,
  ) {
    return this.holyPlacesService.updateHolyPlace(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'PRIEST', 'DEACON')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a holy place' })
  @ApiParam({ name: 'id', type: 'number', description: 'Holy place ID' })
  @ApiResponse({
    status: 200,
    description: 'Holy place deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Holy place not found' })
  async removeHolyPlace(@Param('id', ParseIntPipe) id: number) {
    return this.holyPlacesService.removeHolyPlace(id);
  }
}
