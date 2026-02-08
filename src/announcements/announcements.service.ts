import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementType } from './entities/announcement-type.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CreateAnnouncementTypeDto } from './dto/create-announcement-type.dto';
import { UpdateAnnouncementTypeDto } from './dto/update-announcement-type.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(AnnouncementType)
    private readonly announcementTypeRepository: Repository<AnnouncementType>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  // Announcements CRUD
  async createAnnouncement(
    createDto: CreateAnnouncementDto,
    creatorId: number,
  ): Promise<Announcement> {
    // Verify ecclesiastical unit exists if provided
    if (createDto.code_unite_ecclesiale) {
      const unit = await this.unitRepository.findOne({
        where: { code: createDto.code_unite_ecclesiale },
      });

      if (!unit) {
        throw new NotFoundException(
          `Ecclesiastical unit with ID ${createDto.code_unite_ecclesiale} not found`,
        );
      }
    }

    // Verify announcement type exists if provided
    if (createDto.code_type) {
      const announcementType = await this.announcementTypeRepository.findOne({
        where: { code: createDto.code_type },
      });

      if (!announcementType) {
        throw new NotFoundException(
          `Announcement type with ID ${createDto.code_type} not found`,
        );
      }
    }

    const announcement = this.announcementRepository.create({
      ...createDto,
      code_createur: creatorId,
    });

    return await this.announcementRepository.save(announcement);
  }

  async findAllAnnouncements(queryDto: QueryAnnouncementDto) {
    const {
      search,
      code_unite_ecclesiale,
      code_type,
      date_from,
      date_to,
      active_only,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.announcementRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.ecclesiasticalUnit', 'unit')
      .leftJoinAndSelect('announcement.announcementType', 'type')
      .leftJoinAndSelect('announcement.creator', 'creator');

    // Search filter
    if (search) {
      queryBuilder.where(
        '(announcement.libelle ILIKE :search OR announcement.contenu ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Unit filter
    if (code_unite_ecclesiale) {
      queryBuilder.andWhere(
        'announcement.code_unite_ecclesiale = :code_unite_ecclesiale',
        { code_unite_ecclesiale },
      );
    }

    // Type filter
    if (code_type) {
      queryBuilder.andWhere('announcement.code_type = :code_type', {
        code_type,
      });
    }

    // Date range filter (publication date)
    if (date_from && date_to) {
      queryBuilder.andWhere(
        'announcement.date_publication BETWEEN :date_from AND :date_to',
        { date_from, date_to },
      );
    } else if (date_from) {
      queryBuilder.andWhere('announcement.date_publication >= :date_from', {
        date_from,
      });
    } else if (date_to) {
      queryBuilder.andWhere('announcement.date_publication <= :date_to', {
        date_to,
      });
    }

    // Active only filter (not expired)
    if (active_only) {
      const now = new Date();
      queryBuilder.andWhere(
        '(announcement.date_expiration IS NULL OR announcement.date_expiration > :now)',
        { now },
      );
    }

    // Order by publication date (newest first)
    queryBuilder.orderBy('announcement.date_publication', 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [announcements, total] = await queryBuilder.getManyAndCount();

    return {
      data: announcements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneAnnouncement(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit', 'announcementType', 'creator'],
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async updateAnnouncement(
    id: number,
    updateDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { code: id },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
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

    // Verify new announcement type exists if changing
    if (updateDto.code_type) {
      const announcementType = await this.announcementTypeRepository.findOne({
        where: { code: updateDto.code_type },
      });

      if (!announcementType) {
        throw new NotFoundException(
          `Announcement type with ID ${updateDto.code_type} not found`,
        );
      }
    }

    Object.assign(announcement, updateDto);
    return await this.announcementRepository.save(announcement);
  }

  async removeAnnouncement(id: number): Promise<{ message: string }> {
    const announcement = await this.announcementRepository.findOne({
      where: { code: id },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    await this.announcementRepository.remove(announcement);
    return { message: 'Announcement deleted successfully' };
  }

  // Announcement Types CRUD
  async createAnnouncementType(
    createDto: CreateAnnouncementTypeDto,
  ): Promise<AnnouncementType> {
    const announcementType = this.announcementTypeRepository.create(createDto);
    return await this.announcementTypeRepository.save(announcementType);
  }

  async findAllAnnouncementTypes(): Promise<AnnouncementType[]> {
    return await this.announcementTypeRepository.find({
      order: { libelle: 'ASC' },
    });
  }

  async findOneAnnouncementType(id: number): Promise<AnnouncementType> {
    const announcementType = await this.announcementTypeRepository.findOne({
      where: { code: id },
    });

    if (!announcementType) {
      throw new NotFoundException(`Announcement type with ID ${id} not found`);
    }

    return announcementType;
  }

  async updateAnnouncementType(
    id: number,
    updateDto: UpdateAnnouncementTypeDto,
  ): Promise<AnnouncementType> {
    const announcementType = await this.announcementTypeRepository.findOne({
      where: { code: id },
    });

    if (!announcementType) {
      throw new NotFoundException(`Announcement type with ID ${id} not found`);
    }

    Object.assign(announcementType, updateDto);
    return await this.announcementTypeRepository.save(announcementType);
  }

  async removeAnnouncementType(id: number): Promise<{ message: string }> {
    const announcementType = await this.announcementTypeRepository.findOne({
      where: { code: id },
    });

    if (!announcementType) {
      throw new NotFoundException(`Announcement type with ID ${id} not found`);
    }

    await this.announcementTypeRepository.remove(announcementType);
    return { message: 'Announcement type deleted successfully' };
  }

  // Get active announcements (not expired)
  async getActiveAnnouncements(limit: number = 10): Promise<Announcement[]> {
    const now = new Date();

    return await this.announcementRepository.find({
      where: [
        {
          date_expiration: MoreThanOrEqual(now),
        },
        {
          date_expiration: IsNull(),
        },
      ],
      relations: ['ecclesiasticalUnit', 'announcementType', 'creator'],
      order: { date_publication: 'DESC' },
      take: limit,
    });
  }

  // Get announcements by ecclesiastical unit
  async getAnnouncementsByUnit(unitId: number): Promise<Announcement[]> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
    });

    if (!unit) {
      throw new NotFoundException(
        `Ecclesiastical unit with ID ${unitId} not found`,
      );
    }

    return await this.announcementRepository.find({
      where: { code_unite_ecclesiale: unitId },
      relations: ['ecclesiasticalUnit', 'announcementType', 'creator'],
      order: { date_publication: 'DESC' },
    });
  }

  // Statistics
  async getStats() {
    const total = await this.announcementRepository.count();

    const now = new Date();
    const active = await this.announcementRepository
      .createQueryBuilder('announcement')
      .where(
        '(announcement.date_expiration IS NULL OR announcement.date_expiration > :now)',
        { now },
      )
      .getCount();

    const byType = await this.announcementRepository
      .createQueryBuilder('announcement')
      .leftJoin('announcement.announcementType', 'type')
      .select('type.libelle', 'type')
      .addSelect('COUNT(announcement.code)', 'count')
      .groupBy('type.libelle')
      .getRawMany();

    const byUnit = await this.announcementRepository
      .createQueryBuilder('announcement')
      .leftJoin('announcement.ecclesiasticalUnit', 'unit')
      .select('unit.libelle', 'unit')
      .addSelect('COUNT(announcement.code)', 'count')
      .groupBy('unit.libelle')
      .getRawMany();

    return {
      total,
      active,
      expired: total - active,
      byType,
      byUnit,
    };
  }
}
