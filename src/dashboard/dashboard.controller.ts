import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Get system overview statistics (Admin only)',
    description:
      'Returns comprehensive statistics including total counts, recent activity, and distributions. Only accessible to SUPER_ADMIN and ADMIN roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'System overview statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        overview: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number' },
            totalEcclesiasticalUnits: { type: 'number' },
            totalCelebrations: { type: 'number' },
            totalActivities: { type: 'number' },
            totalAnnouncements: { type: 'number' },
            totalConfessions: { type: 'number' },
            totalHolyPlaces: { type: 'number' },
            totalSacredObjects: { type: 'number' },
          },
        },
        recentActivity: {
          type: 'object',
          properties: {
            newUsersLast30Days: { type: 'number' },
            upcomingCelebrationsNext7Days: { type: 'number' },
            activeAnnouncements: { type: 'number' },
          },
        },
        distributions: {
          type: 'object',
          properties: {
            usersByRole: { type: 'array' },
            unitsByType: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getOverview() {
    return this.dashboardService.getOverviewStatistics();
  }

  @Get('user-growth')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Get user growth statistics (Admin only)',
    description:
      'Returns monthly user registration statistics for the specified number of months.',
  })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of months to include (default: 12)',
    example: 12,
  })
  @ApiResponse({
    status: 200,
    description: 'User growth statistics retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'string', example: '2026-01' },
          newUsers: { type: 'number', example: 45 },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getUserGrowth(@Query('months', ParseIntPipe) months: number = 12) {
    return this.dashboardService.getUserGrowthStatistics(months);
  }

  @Get('my-parish')
  @UseGuards(RolesGuard)
  @Roles('PRIEST', 'DEACON', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Get my parish statistics',
    description:
      'Returns statistics for ecclesiastical units managed by the current user. Accessible to PRIEST, DEACON, and ADMIN roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Parish statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        parishInfo: {
          type: 'object',
          properties: {
            units: { type: 'array' },
          },
        },
        statistics: {
          type: 'object',
          properties: {
            totalCelebrations: { type: 'number' },
            totalActivities: { type: 'number' },
            totalAnnouncements: { type: 'number' },
            totalSubscribers: { type: 'number' },
          },
        },
        upcomingCelebrations: { type: 'array' },
        recentActivities: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getMyParishStatistics(@GetUser() user: User) {
    return this.dashboardService.getMyParishStatistics(user.code);
  }

  @Get('my-dashboard')
  @ApiOperation({
    summary: 'Get personal dashboard',
    description:
      'Returns personalized dashboard with subscriptions, upcoming events, and recent announcements. Accessible to all authenticated users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Personal dashboard retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        subscriptions: { type: 'array' },
        upcomingCelebrations: { type: 'array' },
        upcomingActivities: { type: 'array' },
        recentAnnouncements: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyDashboard(@GetUser() user: User) {
    return this.dashboardService.getMyDashboard(user.code);
  }

  @Get('activity-statistics')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Get activity statistics by date range (Admin only)',
    description:
      'Returns activity statistics for a specific date range including celebrations, activities, announcements, and new users.',
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    description: 'Start date in ISO format (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    description: 'End date in ISO format (YYYY-MM-DD)',
    example: '2026-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        period: {
          type: 'object',
          properties: {
            start: { type: 'string' },
            end: { type: 'string' },
          },
        },
        statistics: {
          type: 'object',
          properties: {
            celebrationsCreated: { type: 'number' },
            activitiesCreated: { type: 'number' },
            announcementsPublished: { type: 'number' },
            newUsers: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid dates' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getActivityStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getActivityStatistics(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('most-active-parishes')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({
    summary: 'Get most active parishes (Admin only)',
    description:
      'Returns a list of the most active parishes based on subscribers, celebrations, activities, and announcements.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of parishes to return (default: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Most active parishes retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'number' },
          libelle: { type: 'string' },
          subscribers: { type: 'number' },
          celebrations: { type: 'number' },
          activities: { type: 'number' },
          announcements: { type: 'number' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async getMostActiveParishes(
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.dashboardService.getMostActiveParishes(limit);
  }
}
