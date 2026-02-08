import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confession } from './entities/confession.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateConfessionDto } from './dto/create-confession.dto';
import { UpdateConfessionDto } from './dto/update-confession.dto';
import { QueryConfessionDto } from './dto/query-confession.dto';

@Injectable()
export class ConfessionsService {
  constructor(
    @InjectRepository(Confession)
    private readonly confessionRepository: Repository<Confession>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  async createConfession(
    createDto: CreateConfessionDto,
  ): Promise<Confession> {
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

    const confession = this.confessionRepository.create(createDto);
    return await this.confessionRepository.save(confession);
  }

  async findAllConfessions(queryDto: QueryConfessionDto) {
    const {
      search,
      code_unite_ecclesiale,
      granularite,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.confessionRepository
      .createQueryBuilder('confession')
      .leftJoinAndSelect('confession.ecclesiasticalUnit', 'unit');

    // Search filter
    if (search) {
      queryBuilder.where('(confession.lieu ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Unit filter
    if (code_unite_ecclesiale) {
      queryBuilder.andWhere(
        'confession.code_unite_ecclesiale = :code_unite_ecclesiale',
        { code_unite_ecclesiale },
      );
    }

    // Granularity filter
    if (granularite) {
      queryBuilder.andWhere('confession.granularite = :granularite', {
        granularite,
      });
    }

    // Order by start time
    queryBuilder.orderBy('confession.horaire_debut', 'ASC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [confessions, total] = await queryBuilder.getManyAndCount();

    return {
      data: confessions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneConfession(id: number): Promise<Confession> {
    const confession = await this.confessionRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit'],
    });

    if (!confession) {
      throw new NotFoundException(`Confession schedule with ID ${id} not found`);
    }

    return confession;
  }

  async updateConfession(
    id: number,
    updateDto: UpdateConfessionDto,
  ): Promise<Confession> {
    const confession = await this.confessionRepository.findOne({
      where: { code: id },
    });

    if (!confession) {
      throw new NotFoundException(`Confession schedule with ID ${id} not found`);
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

    Object.assign(confession, updateDto);
    return await this.confessionRepository.save(confession);
  }

  async removeConfession(id: number): Promise<{ message: string }> {
    const confession = await this.confessionRepository.findOne({
      where: { code: id },
    });

    if (!confession) {
      throw new NotFoundException(`Confession schedule with ID ${id} not found`);
    }

    await this.confessionRepository.remove(confession);
    return { message: 'Confession schedule deleted successfully' };
  }

  // Get confessions by ecclesiastical unit
  async getConfessionsByUnit(unitId: number): Promise<Confession[]> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
    });

    if (!unit) {
      throw new NotFoundException(
        `Ecclesiastical unit with ID ${unitId} not found`,
      );
    }

    return await this.confessionRepository.find({
      where: { code_unite_ecclesiale: unitId },
      relations: ['ecclesiasticalUnit'],
      order: { horaire_debut: 'ASC' },
    });
  }

  // Statistics
  async getStats() {
    const total = await this.confessionRepository.count();

    const byGranularity = await this.confessionRepository
      .createQueryBuilder('confession')
      .select('confession.granularite', 'granularity')
      .addSelect('COUNT(confession.code)', 'count')
      .groupBy('confession.granularite')
      .getRawMany();

    const byUnit = await this.confessionRepository
      .createQueryBuilder('confession')
      .leftJoin('confession.ecclesiasticalUnit', 'unit')
      .select('unit.libelle', 'unit')
      .addSelect('COUNT(confession.code)', 'count')
      .groupBy('unit.libelle')
      .getRawMany();

    return {
      total,
      byGranularity,
      byUnit,
    };
  }
}
