import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityType } from './entities/activity-type.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityTypeDto } from './dto/create-activity-type.dto';
import { UpdateActivityTypeDto } from './dto/update-activity-type.dto';
import { QueryActivityDto } from './dto/query-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(ActivityType)
    private readonly activityTypeRepository: Repository<ActivityType>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  // Activities CRUD
  async createActivity(createDto: CreateActivityDto): Promise<Activity> {
    // Verify ecclesiastical unit exists
    const unit = await this.unitRepository.findOne({
      where: { code: createDto.code_unite_ecclesiale },
    });

    if (!unit) {
      throw new NotFoundException(
        `Ecclesiastical unit with ID ${createDto.code_unite_ecclesiale} not found`,
      );
    }

    // Verify activity type exists if provided
    if (createDto.code_type_activite) {
      const activityType = await this.activityTypeRepository.findOne({
        where: { code: createDto.code_type_activite },
      });

      if (!activityType) {
        throw new NotFoundException(
          `Activity type with ID ${createDto.code_type_activite} not found`,
        );
      }
    }

    const activity = this.activityRepository.create(createDto);
    return await this.activityRepository.save(activity);
  }

  async findAllActivities(queryDto: QueryActivityDto) {
    const {
      search,
      code_unite_ecclesiale,
      code_type_activite,
      frequence,
      statut,
      date_from,
      date_to,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.ecclesiasticalUnit', 'unit')
      .leftJoinAndSelect('activity.activityType', 'type');

    // Search filter
    if (search) {
      queryBuilder.where(
        '(activity.libelle ILIKE :search OR activity.description ILIKE :search OR activity.lieu ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Unit filter
    if (code_unite_ecclesiale) {
      queryBuilder.andWhere(
        'activity.code_unite_ecclesiale = :code_unite_ecclesiale',
        { code_unite_ecclesiale },
      );
    }

    // Type filter
    if (code_type_activite) {
      queryBuilder.andWhere(
        'activity.code_type_activite = :code_type_activite',
        { code_type_activite },
      );
    }

    // Frequency filter
    if (frequence) {
      queryBuilder.andWhere('activity.frequence = :frequence', { frequence });
    }

    // Status filter
    if (statut !== undefined) {
      queryBuilder.andWhere('activity.statut = :statut', { statut });
    }

    // Date range filter
    if (date_from && date_to) {
      queryBuilder.andWhere('activity.date_activite BETWEEN :date_from AND :date_to', {
        date_from,
        date_to,
      });
    } else if (date_from) {
      queryBuilder.andWhere('activity.date_activite >= :date_from', { date_from });
    } else if (date_to) {
      queryBuilder.andWhere('activity.date_activite <= :date_to', { date_to });
    }

    // Order by date
    queryBuilder.orderBy('activity.date_activite', 'ASC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [activities, total] = await queryBuilder.getManyAndCount();

    return {
      data: activities,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneActivity(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit', 'activityType'],
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async updateActivity(
    id: number,
    updateDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { code: id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
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

    // Verify new activity type exists if changing
    if (updateDto.code_type_activite) {
      const activityType = await this.activityTypeRepository.findOne({
        where: { code: updateDto.code_type_activite },
      });

      if (!activityType) {
        throw new NotFoundException(
          `Activity type with ID ${updateDto.code_type_activite} not found`,
        );
      }
    }

    Object.assign(activity, updateDto);
    return await this.activityRepository.save(activity);
  }

  async removeActivity(id: number): Promise<{ message: string }> {
    const activity = await this.activityRepository.findOne({
      where: { code: id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    await this.activityRepository.remove(activity);
    return { message: 'Activity deleted successfully' };
  }

  // Activity Types CRUD
  async createActivityType(
    createDto: CreateActivityTypeDto,
    creatorId: number,
  ): Promise<ActivityType> {
    const activityType = this.activityTypeRepository.create({
      ...createDto,
      code_createur: creatorId,
    });

    return await this.activityTypeRepository.save(activityType);
  }

  async findAllActivityTypes(): Promise<ActivityType[]> {
    return await this.activityTypeRepository.find({
      order: { libelle: 'ASC' },
    });
  }

  async findOneActivityType(id: number): Promise<ActivityType> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { code: id },
    });

    if (!activityType) {
      throw new NotFoundException(`Activity type with ID ${id} not found`);
    }

    return activityType;
  }

  async updateActivityType(
    id: number,
    updateDto: UpdateActivityTypeDto,
    updaterId: number,
  ): Promise<ActivityType> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { code: id },
    });

    if (!activityType) {
      throw new NotFoundException(`Activity type with ID ${id} not found`);
    }

    Object.assign(activityType, {
      ...updateDto,
      code_modificateur: updaterId,
    });

    return await this.activityTypeRepository.save(activityType);
  }

  async removeActivityType(id: number): Promise<{ message: string }> {
    const activityType = await this.activityTypeRepository.findOne({
      where: { code: id },
    });

    if (!activityType) {
      throw new NotFoundException(`Activity type with ID ${id} not found`);
    }

    await this.activityTypeRepository.remove(activityType);
    return { message: 'Activity type deleted successfully' };
  }

  // Statistics
  async getStats() {
    const total = await this.activityRepository.count();
    const active = await this.activityRepository.count({
      where: { statut: 1 },
    });

    const byType = await this.activityRepository
      .createQueryBuilder('activity')
      .leftJoin('activity.activityType', 'type')
      .select('type.libelle', 'type')
      .addSelect('COUNT(activity.code)', 'count')
      .groupBy('type.libelle')
      .getRawMany();

    const byFrequency = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.frequence', 'frequency')
      .addSelect('COUNT(activity.code)', 'count')
      .groupBy('activity.frequence')
      .getRawMany();

    const byStatus = await this.activityRepository
      .createQueryBuilder('activity')
      .select('activity.statut', 'status')
      .addSelect('COUNT(activity.code)', 'count')
      .groupBy('activity.statut')
      .getRawMany();

    return {
      total,
      active,
      byType,
      byFrequency,
      byStatus,
    };
  }

  // Get upcoming activities
  async getUpcomingActivities(limit: number = 10): Promise<Activity[]> {
    const now = new Date();

    return await this.activityRepository.find({
      where: {
        date_activite: MoreThanOrEqual(now),
        statut: 1,
      },
      relations: ['ecclesiasticalUnit', 'activityType'],
      order: { date_activite: 'ASC' },
      take: limit,
    });
  }
}
