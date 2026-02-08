import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { EcclesiasticalUnit } from './entities/ecclesiastical-unit.entity';
import { EcclesiasticalUnitTranslation } from './entities/ecclesiastical-unit-translation.entity';
import { User } from '../users/entities/user.entity';
import { CreateEcclesiasticalUnitDto } from './dto/create-ecclesiastical-unit.dto';
import { UpdateEcclesiasticalUnitDto } from './dto/update-ecclesiastical-unit.dto';
import { QueryEcclesiasticalUnitDto } from './dto/query-ecclesiastical-unit.dto';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class EcclesiasticalUnitsService {
  constructor(
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
    @InjectRepository(EcclesiasticalUnitTranslation)
    private readonly translationRepository: Repository<EcclesiasticalUnitTranslation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly languagesService: LanguagesService,
  ) {}

  async create(
    createDto: CreateEcclesiasticalUnitDto,
    creatorId: number,
  ): Promise<EcclesiasticalUnit> {
    // Check if parent exists (if specified)
    if (createDto.code_unite_parent) {
      const parent = await this.unitRepository.findOne({
        where: { code: createDto.code_unite_parent },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent unit with ID ${createDto.code_unite_parent} not found`,
        );
      }
    }

    const unit = this.unitRepository.create({
      ...createDto,
      longitude: createDto.longitude?.toString(),
      latitude: createDto.latitude?.toString(),
      altitude: createDto.altitude?.toString(),
      code_createur: creatorId,
    });

    const savedUnit = await this.unitRepository.save(unit);

    // Handle translations if provided
    if (createDto.translations && createDto.translations.length > 0) {
      const translations = createDto.translations.map((trans) =>
        this.translationRepository.create({
          ecclesiasticalUnitCode: savedUnit.code,
          languageCode: trans.languageCode,
          nom: trans.nom,
          description: trans.description,
          adresse: trans.adresse,
        }),
      );

      await this.translationRepository.save(translations);
    }

    // Return with translations
    return this.findOne(savedUnit.code);
  }

  async findAll(queryDto: QueryEcclesiasticalUnitDto) {
    const {
      search,
      code_type,
      code_unite_parent,
      statut_canonique,
      latitude,
      longitude,
      radius,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.unitRepository
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.parent', 'parent')
      .leftJoinAndSelect('unit.children', 'children');

    // Search filter
    if (search) {
      queryBuilder.where(
        '(unit.libelle ILIKE :search OR unit.description ILIKE :search OR unit.adresse ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Type filter
    if (code_type) {
      queryBuilder.andWhere('unit.code_type = :code_type', { code_type });
    }

    // Parent filter
    if (code_unite_parent !== undefined) {
      if (code_unite_parent === 0 || code_unite_parent === null) {
        queryBuilder.andWhere('unit.code_unite_parent IS NULL');
      } else {
        queryBuilder.andWhere('unit.code_unite_parent = :code_unite_parent', {
          code_unite_parent,
        });
      }
    }

    // Status filter
    if (statut_canonique) {
      queryBuilder.andWhere('unit.statut_canonique = :statut_canonique', {
        statut_canonique,
      });
    }

    // Location-based filter (within radius)
    if (latitude && longitude && radius) {
      // Haversine formula for distance calculation
      queryBuilder.andWhere(
        `(
          6371 * acos(
            cos(radians(:latitude)) *
            cos(radians(CAST(unit.latitude AS FLOAT))) *
            cos(radians(CAST(unit.longitude AS FLOAT)) - radians(:longitude)) +
            sin(radians(:latitude)) *
            sin(radians(CAST(unit.latitude AS FLOAT)))
          )
        ) <= :radius`,
        { latitude, longitude, radius },
      );
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [units, total] = await queryBuilder.getManyAndCount();

    return {
      data: units,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<EcclesiasticalUnit> {
    const unit = await this.unitRepository.findOne({
      where: { code: id },
      relations: ['parent', 'children', 'subscribers', 'translations', 'translations.language'],
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${id} not found`);
    }

    return unit;
  }

  /**
   * Find one unit with translation in specific language
   */
  async findOneInLanguage(id: number, languageCode: string = 'en'): Promise<EcclesiasticalUnit> {
    const unit = await this.unitRepository
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.parent', 'parent')
      .leftJoinAndSelect('unit.children', 'children')
      .leftJoinAndSelect(
        'unit.translations',
        'translation',
        'translation.languageCode = :languageCode',
        { languageCode },
      )
      .leftJoinAndSelect('translation.language', 'language')
      .where('unit.code = :id', { id })
      .getOne();

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${id} not found`);
    }

    // If no translation found for requested language, fallback to default language
    if (!unit.translations || unit.translations.length === 0) {
      const defaultLang = await this.languagesService.getDefaultLanguage();
      const defaultTranslation = await this.translationRepository.findOne({
        where: {
          ecclesiasticalUnitCode: id,
          languageCode: defaultLang.code,
        },
        relations: ['language'],
      });

      if (defaultTranslation) {
        unit.translations = [defaultTranslation];
      }
    }

    return unit;
  }

  async update(
    id: number,
    updateDto: UpdateEcclesiasticalUnitDto,
    updaterId: number,
  ): Promise<EcclesiasticalUnit> {
    const unit = await this.unitRepository.findOne({
      where: { code: id },
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${id} not found`);
    }

    // Check if new parent exists and prevent circular reference
    if (updateDto.code_unite_parent !== undefined) {
      if (updateDto.code_unite_parent === id) {
        throw new BadRequestException('Unit cannot be its own parent');
      }

      if (updateDto.code_unite_parent) {
        const parent = await this.unitRepository.findOne({
          where: { code: updateDto.code_unite_parent },
        });

        if (!parent) {
          throw new NotFoundException(
            `Parent unit with ID ${updateDto.code_unite_parent} not found`,
          );
        }

        // Check for circular reference
        if (await this.isCircularReference(id, updateDto.code_unite_parent)) {
          throw new BadRequestException(
            'Cannot set parent: would create circular reference',
          );
        }
      }
    }

    Object.assign(unit, {
      ...updateDto,
      longitude: updateDto.longitude?.toString(),
      latitude: updateDto.latitude?.toString(),
      altitude: updateDto.altitude?.toString(),
      code_modificateur: updaterId,
    });

    const savedUnit = await this.unitRepository.save(unit);
    return savedUnit;
  }

  async remove(id: number): Promise<{ message: string }> {
    const unit = await this.unitRepository.findOne({
      where: { code: id },
      relations: ['children'],
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${id} not found`);
    }

    // Check if unit has children
    if (unit.children && unit.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete unit with child units. Delete or reassign children first.',
      );
    }

    await this.unitRepository.remove(unit);

    return { message: 'Ecclesiastical unit deleted successfully' };
  }

  async getHierarchy(id?: number): Promise<EcclesiasticalUnit[]> {
    const queryBuilder = this.unitRepository
      .createQueryBuilder('unit')
      .leftJoinAndSelect('unit.children', 'children')
      .leftJoinAndSelect('children.children', 'grandchildren');

    if (id) {
      queryBuilder.where('unit.code = :id', { id });
    } else {
      queryBuilder.where('unit.code_unite_parent IS NULL');
    }

    return await queryBuilder.getMany();
  }

  async subscribe(unitId: number, userId: number): Promise<EcclesiasticalUnit> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
      relations: ['subscribers'],
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${unitId} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { code: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if already subscribed
    const isSubscribed = unit.subscribers.some((sub) => sub.code === userId);
    if (isSubscribed) {
      throw new ConflictException('User is already subscribed to this unit');
    }

    unit.subscribers.push(user);
    return await this.unitRepository.save(unit);
  }

  async unsubscribe(
    unitId: number,
    userId: number,
  ): Promise<EcclesiasticalUnit> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
      relations: ['subscribers'],
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${unitId} not found`);
    }

    unit.subscribers = unit.subscribers.filter((sub) => sub.code !== userId);
    return await this.unitRepository.save(unit);
  }

  async getSubscribers(unitId: number): Promise<User[]> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
      relations: ['subscribers'],
    });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${unitId} not found`);
    }

    return unit.subscribers;
  }

  async getUserSubscriptions(userId: number): Promise<EcclesiasticalUnit[]> {
    const units = await this.unitRepository
      .createQueryBuilder('unit')
      .innerJoin('unit.subscribers', 'subscriber')
      .where('subscriber.code = :userId', { userId })
      .getMany();

    return units;
  }

  async getStats() {
    const total = await this.unitRepository.count();

    const byType = await this.unitRepository
      .createQueryBuilder('unit')
      .select('unit.code_type', 'type')
      .addSelect('COUNT(unit.code)', 'count')
      .groupBy('unit.code_type')
      .getRawMany();

    const rootUnits = await this.unitRepository.count({
      where: { code_unite_parent: IsNull() },
    });

    return {
      total,
      rootUnits,
      byType,
    };
  }

  private async isCircularReference(
    unitId: number,
    parentId: number,
  ): Promise<boolean> {
    let currentId = parentId;
    const visited = new Set<number>();

    while (currentId) {
      if (currentId === unitId) {
        return true;
      }

      if (visited.has(currentId)) {
        return false; // Already checked this branch
      }

      visited.add(currentId);

      const parent = await this.unitRepository.findOne({
        where: { code: currentId },
      });

      if (!parent || !parent.code_unite_parent) {
        return false;
      }

      currentId = parent.code_unite_parent;
    }

    return false;
  }
}
