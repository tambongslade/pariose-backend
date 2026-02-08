import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SacredObject } from './entities/sacred-object.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateSacredObjectDto } from './dto/create-sacred-object.dto';
import { UpdateSacredObjectDto } from './dto/update-sacred-object.dto';
import { QuerySacredObjectDto } from './dto/query-sacred-object.dto';

@Injectable()
export class SacredObjectsService {
  constructor(
    @InjectRepository(SacredObject)
    private readonly sacredObjectRepository: Repository<SacredObject>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  async create(createDto: CreateSacredObjectDto, creatorId: number): Promise<SacredObject> {
    if (createDto.code_unite_ecclesiale) {
      const unit = await this.unitRepository.findOne({
        where: { code: createDto.code_unite_ecclesiale },
      });
      if (!unit) {
        throw new NotFoundException(`Ecclesiastical unit with ID ${createDto.code_unite_ecclesiale} not found`);
      }
    }

    const sacredObject = this.sacredObjectRepository.create({
      ...createDto,
      code_createur: creatorId,
    });
    return await this.sacredObjectRepository.save(sacredObject);
  }

  async findAll(queryDto: QuerySacredObjectDto) {
    const { search, code_unite_ecclesiale, page = 1, limit = 10 } = queryDto;

    const queryBuilder = this.sacredObjectRepository
      .createQueryBuilder('object')
      .leftJoinAndSelect('object.ecclesiasticalUnit', 'unit')
      .leftJoinAndSelect('object.creator', 'creator');

    if (search) {
      queryBuilder.where('(object.libelle ILIKE :search OR object.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (code_unite_ecclesiale) {
      queryBuilder.andWhere('object.code_unite_ecclesiale = :code_unite_ecclesiale', {
        code_unite_ecclesiale,
      });
    }

    queryBuilder.orderBy('object.libelle', 'ASC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [objects, total] = await queryBuilder.getManyAndCount();

    return {
      data: objects,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<SacredObject> {
    const object = await this.sacredObjectRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit', 'creator', 'modifier'],
    });

    if (!object) {
      throw new NotFoundException(`Sacred object with ID ${id} not found`);
    }

    return object;
  }

  async update(id: number, updateDto: UpdateSacredObjectDto, modifierId: number): Promise<SacredObject> {
    const object = await this.sacredObjectRepository.findOne({ where: { code: id } });

    if (!object) {
      throw new NotFoundException(`Sacred object with ID ${id} not found`);
    }

    if (updateDto.code_unite_ecclesiale) {
      const unit = await this.unitRepository.findOne({
        where: { code: updateDto.code_unite_ecclesiale },
      });
      if (!unit) {
        throw new NotFoundException(`Ecclesiastical unit with ID ${updateDto.code_unite_ecclesiale} not found`);
      }
    }

    Object.assign(object, { ...updateDto, code_modificateur: modifierId });
    return await this.sacredObjectRepository.save(object);
  }

  async remove(id: number): Promise<{ message: string }> {
    const object = await this.sacredObjectRepository.findOne({ where: { code: id } });

    if (!object) {
      throw new NotFoundException(`Sacred object with ID ${id} not found`);
    }

    await this.sacredObjectRepository.remove(object);
    return { message: 'Sacred object deleted successfully' };
  }

  async findByUnit(unitId: number): Promise<SacredObject[]> {
    const unit = await this.unitRepository.findOne({ where: { code: unitId } });

    if (!unit) {
      throw new NotFoundException(`Ecclesiastical unit with ID ${unitId} not found`);
    }

    return await this.sacredObjectRepository.find({
      where: { code_unite_ecclesiale: unitId },
      relations: ['ecclesiasticalUnit', 'creator'],
      order: { libelle: 'ASC' },
    });
  }

  async getStats() {
    const total = await this.sacredObjectRepository.count();

    const byUnit = await this.sacredObjectRepository
      .createQueryBuilder('object')
      .leftJoin('object.ecclesiasticalUnit', 'unit')
      .select('unit.libelle', 'unit')
      .addSelect('COUNT(object.code)', 'count')
      .groupBy('unit.libelle')
      .getRawMany();

    return { total, byUnit };
  }
}
