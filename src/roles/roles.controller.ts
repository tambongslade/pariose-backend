import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from './entities/role.entity';

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new role (Super Admin only)',
    description: 'Creates a new role in the system. Only accessible to SUPER_ADMIN.'
  })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Conflict - Role already exists' })
  async create(@Body() createRoleDto: CreateRoleDto, @GetUser() user: User) {
    return this.rolesService.create(createRoleDto, user.code);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Returns a list of all roles with their permissions. Accessible to ADMIN and SUPER_ADMIN.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully',
    type: [Role],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Get role statistics',
    description: 'Returns statistics about roles and their permissions counts.'
  })
  @ApiResponse({
    status: 200,
    description: 'Role statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalRoles: { type: 'number' },
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'number' },
              libelle: { type: 'string' },
              permissionsCount: { type: 'number' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  async getStats() {
    return this.rolesService.getRoleStats();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Get a specific role by ID',
    description: 'Returns details of a specific role including its permissions.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: Role,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Update a role (Super Admin only)',
    description: 'Updates a role. System roles cannot be modified. Only accessible to SUPER_ADMIN.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Role name already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @GetUser() user: User,
  ) {
    return this.rolesService.update(id, updateRoleDto, user.code);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a role (Super Admin only)',
    description: 'Deletes a role. System roles cannot be deleted. Only accessible to SUPER_ADMIN.'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Cannot delete system role' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
