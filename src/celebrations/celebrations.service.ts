import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celebration } from './entities/celebration.entity';
import { MassIntention } from './entities/mass-intention.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateCelebrationDto } from './dto/create-celebration.dto';
import { UpdateCelebrationDto } from './dto/update-celebration.dto';
import { CreateMassIntentionDto } from './dto/create-mass-intention.dto';
import { UpdateMassIntentionDto } from './dto/update-mass-intention.dto';
import { QueryCelebrationDto } from './dto/query-celebration.dto';

@Injectable()
export class CelebrationsService {
  constructor(
    @InjectRepository(Celebration)
    private readonly celebrationRepository: Repository<Celebration>,
    @InjectRepository(MassIntention)
    private readonly intentionRepository: Repository<MassIntention>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  // Celebrations CRUD
  async createCelebration(createDto: CreateCelebrationDto): Promise<Celebration> {
    // Verify ecclesiastical unit exists
    const unit = await this.unitRepository.findOne({
      where: { code: createDto.code_unite_ecclesiale },
    });

    if (!unit) {
      throw new NotFoundException(
        `Ecclesiastical unit with ID ${createDto.code_unite_ecclesiale} not found`,
      );
    }

    const celebration = this.celebrationRepository.create(createDto);
    return await this.celebrationRepository.save(celebration);
  }

  async findAllCelebrations(queryDto: QueryCelebrationDto) {
    const {
      search,
      code_unite_ecclesiale,
      granularite,
      code_type,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.celebrationRepository
      .createQueryBuilder('celebration')
      .leftJoinAndSelect('celebration.ecclesiasticalUnit', 'unit')
      .leftJoinAndSelect('celebration.intentions', 'intentions');

    // Search filter
    if (search) {
      queryBuilder.where('celebration.libelle ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Unit filter
    if (code_unite_ecclesiale) {
      queryBuilder.andWhere(
        'celebration.code_unite_ecclesiale = :code_unite_ecclesiale',
        { code_unite_ecclesiale },
      );
    }

    // Granularity filter
    if (granularite) {
      queryBuilder.andWhere('celebration.granularite = :granularite', {
        granularite,
      });
    }

    // Type filter
    if (code_type) {
      queryBuilder.andWhere('celebration.code_type = :code_type', {
        code_type,
      });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [celebrations, total] = await queryBuilder.getManyAndCount();

    return {
      data: celebrations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneCelebration(id: number): Promise<Celebration> {
    const celebration = await this.celebrationRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit', 'intentions', 'intentions.creator'],
    });

    if (!celebration) {
      throw new NotFoundException(`Celebration with ID ${id} not found`);
    }

    return celebration;
  }

  async updateCelebration(
    id: number,
    updateDto: UpdateCelebrationDto,
  ): Promise<Celebration> {
    const celebration = await this.celebrationRepository.findOne({
      where: { code: id },
    });

    if (!celebration) {
      throw new NotFoundException(`Celebration with ID ${id} not found`);
    }

    // Verify new unit exists if changing
    if (updateDto.code_unite_ecclesiale) {
      const unit = await this.unitRepository.findOne({
        where: { code: updateDto.code_unite_ecclesiale },
      });

      if (!unit) {
        throw new NotFoundException(
          `Ecclesiastical unit with ID ${updateDto.code_unite_ecclesiale} not found`,
        );
      }
    }

    Object.assign(celebration, updateDto);
    return await this.celebrationRepository.save(celebration);
  }

  async removeCelebration(id: number): Promise<{ message: string }> {
    const celebration = await this.celebrationRepository.findOne({
      where: { code: id },
      relations: ['intentions'],
    });

    if (!celebration) {
      throw new NotFoundException(`Celebration with ID ${id} not found`);
    }

    await this.celebrationRepository.remove(celebration);
    return { message: 'Celebration deleted successfully' };
  }

  // Mass Intentions CRUD
  async createMassIntention(
    createDto: CreateMassIntentionDto,
    creatorId: number,
  ): Promise<MassIntention> {
    // Verify celebration exists
    const celebration = await this.celebrationRepository.findOne({
      where: { code: createDto.code_celebration_eucharistique },
    });

    if (!celebration) {
      throw new NotFoundException(
        `Celebration with ID ${createDto.code_celebration_eucharistique} not found`,
      );
    }

    const intention = this.intentionRepository.create({
      ...createDto,
      montant_verse: createDto.montant_verse?.toString(),
      code_createur: creatorId,
    });

    return await this.intentionRepository.save(intention);
  }

  async findAllIntentions(celebrationId?: number) {
    const queryBuilder = this.intentionRepository
      .createQueryBuilder('intention')
      .leftJoinAndSelect('intention.celebration', 'celebration')
      .leftJoinAndSelect('intention.creator', 'creator')
      .select([
        'intention',
        'celebration.code',
        'celebration.libelle',
        'creator.code',
        'creator.username',
        'creator.noms',
        'creator.prenoms',
      ]);

    if (celebrationId) {
      queryBuilder.where(
        'intention.code_celebration_eucharistique = :celebrationId',
        { celebrationId },
      );
    }

    return await queryBuilder.getMany();
  }

  async findOneIntention(id: number): Promise<MassIntention> {
    const intention = await this.intentionRepository.findOne({
      where: { code: id },
      relations: ['celebration', 'creator'],
    });

    if (!intention) {
      throw new NotFoundException(`Mass intention with ID ${id} not found`);
    }

    return intention;
  }

  async updateMassIntention(
    id: number,
    updateDto: UpdateMassIntentionDto,
    updaterId: number,
  ): Promise<MassIntention> {
    const intention = await this.intentionRepository.findOne({
      where: { code: id },
    });

    if (!intention) {
      throw new NotFoundException(`Mass intention with ID ${id} not found`);
    }

    // Verify new celebration exists if changing
    if (updateDto.code_celebration_eucharistique) {
      const celebration = await this.celebrationRepository.findOne({
        where: { code: updateDto.code_celebration_eucharistique },
      });

      if (!celebration) {
        throw new NotFoundException(
          `Celebration with ID ${updateDto.code_celebration_eucharistique} not found`,
        );
      }
    }

    Object.assign(intention, {
      ...updateDto,
      montant_verse: updateDto.montant_verse?.toString(),
      code_modificateur: updaterId,
    });

    return await this.intentionRepository.save(intention);
  }

  async removeMassIntention(id: number): Promise<{ message: string }> {
    const intention = await this.intentionRepository.findOne({
      where: { code: id },
    });

    if (!intention) {
      throw new NotFoundException(`Mass intention with ID ${id} not found`);
    }

    await this.intentionRepository.remove(intention);
    return { message: 'Mass intention deleted successfully' };
  }

  // Statistics
  async getStats() {
    const totalCelebrations = await this.celebrationRepository.count();
    const totalIntentions = await this.intentionRepository.count();

    const byType = await this.celebrationRepository
      .createQueryBuilder('celebration')
      .select('celebration.code_type', 'type')
      .addSelect('COUNT(celebration.code)', 'count')
      .groupBy('celebration.code_type')
      .getRawMany();

    const byGranularity = await this.celebrationRepository
      .createQueryBuilder('celebration')
      .select('celebration.granularite', 'granularity')
      .addSelect('COUNT(celebration.code)', 'count')
      .groupBy('celebration.granularite')
      .getRawMany();

    return {
      totalCelebrations,
      totalIntentions,
      byType,
      byGranularity,
    };
  }
}
