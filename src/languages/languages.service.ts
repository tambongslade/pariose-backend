import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  /**
   * Create a new language
   */
  async create(createDto: CreateLanguageDto): Promise<Language> {
    // Check if language code already exists
    const existing = await this.languageRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Language with code '${createDto.code}' already exists`,
      );
    }

    // If setting as default, unset other defaults
    if (createDto.is_default) {
      await this.languageRepository.update(
        { is_default: true },
        { is_default: false },
      );
    }

    const language = this.languageRepository.create(createDto);
    return await this.languageRepository.save(language);
  }

  /**
   * Get all languages
   */
  async findAll(): Promise<Language[]> {
    return await this.languageRepository.find({
      order: { is_default: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Get all active languages
   */
  async findAllActive(): Promise<Language[]> {
    return await this.languageRepository.find({
      where: { is_active: true },
      order: { is_default: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Get a specific language by code
   */
  async findOne(code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      throw new NotFoundException(`Language with code '${code}' not found`);
    }

    return language;
  }

  /**
   * Get the default language
   */
  async getDefaultLanguage(): Promise<Language> {
    const defaultLang = await this.languageRepository.findOne({
      where: { is_default: true },
    });

    if (!defaultLang) {
      throw new NotFoundException('No default language configured');
    }

    return defaultLang;
  }

  /**
   * Update a language
   */
  async update(
    code: string,
    updateDto: UpdateLanguageDto,
  ): Promise<Language> {
    const language = await this.findOne(code);

    // If setting as default, unset other defaults
    if (updateDto.is_default) {
      await this.languageRepository.update(
        { is_default: true },
        { is_default: false },
      );
    }

    Object.assign(language, updateDto);
    return await this.languageRepository.save(language);
  }

  /**
   * Delete a language
   */
  async remove(code: string): Promise<{ message: string }> {
    const language = await this.findOne(code);

    // Prevent deletion of default language
    if (language.is_default) {
      throw new BadRequestException(
        'Cannot delete the default language. Set another language as default first.',
      );
    }

    await this.languageRepository.remove(language);

    return {
      message: `Language '${code}' has been successfully deleted`,
    };
  }

  /**
   * Set a language as default
   */
  async setAsDefault(code: string): Promise<Language> {
    const language = await this.findOne(code);

    if (!language.is_active) {
      throw new BadRequestException(
        'Cannot set an inactive language as default. Activate it first.',
      );
    }

    // Unset other defaults
    await this.languageRepository.update(
      { is_default: true },
      { is_default: false },
    );

    language.is_default = true;
    return await this.languageRepository.save(language);
  }

  /**
   * Activate a language
   */
  async activate(code: string): Promise<Language> {
    const language = await this.findOne(code);
    language.is_active = true;
    return await this.languageRepository.save(language);
  }

  /**
   * Deactivate a language
   */
  async deactivate(code: string): Promise<Language> {
    const language = await this.findOne(code);

    // Prevent deactivation of default language
    if (language.is_default) {
      throw new BadRequestException(
        'Cannot deactivate the default language. Set another language as default first.',
      );
    }

    language.is_active = false;
    return await this.languageRepository.save(language);
  }
}
