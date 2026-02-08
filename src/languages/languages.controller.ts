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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Languages')
@ApiBearerAuth('JWT-auth')
@Controller('languages')
@UseGuards(JwtAuthGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new language (Admin only)' })
  @ApiBody({ type: CreateLanguageDto })
  @ApiResponse({
    status: 201,
    description: 'Language created successfully',
    type: Language,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Language code already exists' })
  async create(@Body() createDto: CreateLanguageDto) {
    return this.languagesService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({
    status: 200,
    description: 'List of all languages retrieved successfully',
    type: [Language],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.languagesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({
    status: 200,
    description: 'List of active languages retrieved successfully',
    type: [Language],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllActive() {
    return this.languagesService.findAllActive();
  }

  @Get('default')
  @ApiOperation({ summary: 'Get the default language' })
  @ApiResponse({
    status: 200,
    description: 'Default language retrieved successfully',
    type: Language,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'No default language configured' })
  async getDefaultLanguage() {
    return this.languagesService.getDefaultLanguage();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a specific language by code' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code (e.g., en, fr)',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Language retrieved successfully',
    type: Language,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async findOne(@Param('code') code: string) {
    return this.languagesService.findOne(code);
  }

  @Patch(':code')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update a language (Admin only)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code',
    example: 'en',
  })
  @ApiBody({ type: UpdateLanguageDto })
  @ApiResponse({
    status: 200,
    description: 'Language updated successfully',
    type: Language,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async update(
    @Param('code') code: string,
    @Body() updateDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(code, updateDto);
  }

  @Delete(':code')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a language (Admin only)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Language deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Cannot delete default language' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async remove(@Param('code') code: string) {
    return this.languagesService.remove(code);
  }

  @Post(':code/set-default')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set a language as default (Admin only)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Language set as default successfully',
    type: Language,
  })
  @ApiResponse({ status: 400, description: 'Cannot set inactive language as default' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async setAsDefault(@Param('code') code: string) {
    return this.languagesService.setAsDefault(code);
  }

  @Post(':code/activate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a language (Admin only)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Language activated successfully',
    type: Language,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async activate(@Param('code') code: string) {
    return this.languagesService.activate(code);
  }

  @Post(':code/deactivate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate a language (Admin only)' })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Language code',
    example: 'en',
  })
  @ApiResponse({
    status: 200,
    description: 'Language deactivated successfully',
    type: Language,
  })
  @ApiResponse({ status: 400, description: 'Cannot deactivate default language' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Language not found' })
  async deactivate(@Param('code') code: string) {
    return this.languagesService.deactivate(code);
  }
}
