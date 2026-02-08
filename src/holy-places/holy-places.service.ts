import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolyPlace } from './entities/holy-place.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { CreateHolyPlaceDto } from './dto/create-holy-place.dto';
import { UpdateHolyPlaceDto } from './dto/update-holy-place.dto';
import { QueryHolyPlaceDto } from './dto/query-holy-place.dto';

@Injectable()
export class HolyPlacesService {
  constructor(
    @InjectRepository(HolyPlace)
    private readonly holyPlaceRepository: Repository<HolyPlace>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
  ) {}

  async createHolyPlace(createDto: CreateHolyPlaceDto): Promise<HolyPlace> {
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

    const holyPlace = this.holyPlaceRepository.create({
      ...createDto,
      longitude: createDto.longitude?.toString(),
      latitude: createDto.latitude?.toString(),
    });

    return await this.holyPlaceRepository.save(holyPlace);
  }

  async findAllHolyPlaces(queryDto: QueryHolyPlaceDto) {
    const {
      search,
      code_unite_ecclesiale,
      latitude,
      longitude,
      radius,
      page = 1,
      limit = 10,
    } = queryDto;

    const queryBuilder = this.holyPlaceRepository
      .createQueryBuilder('holyPlace')
      .leftJoinAndSelect('holyPlace.ecclesiasticalUnit', 'unit');

    // Search filter
    if (search) {
      queryBuilder.where(
        '(holyPlace.libelle ILIKE :search OR holyPlace.adresse ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Unit filter
    if (code_unite_ecclesiale) {
      queryBuilder.andWhere(
        'holyPlace.code_unite_ecclesiale = :code_unite_ecclesiale',
        { code_unite_ecclesiale },
      );
    }

    // Location-based search using Haversine formula
    if (latitude && longitude && radius) {
      queryBuilder.andWhere(
        `(6371 * acos(cos(radians(:latitude)) * cos(radians(CAST(holyPlace.latitude AS FLOAT))) *
         cos(radians(CAST(holyPlace.longitude AS FLOAT)) - radians(:longitude)) +
         sin(radians(:latitude)) * sin(radians(CAST(holyPlace.latitude AS FLOAT))))) <= :radius`,
        { latitude, longitude, radius },
      );
    }

    // Order by name
    queryBuilder.orderBy('holyPlace.libelle', 'ASC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [holyPlaces, total] = await queryBuilder.getManyAndCount();

    return {
      data: holyPlaces,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneHolyPlace(id: number): Promise<HolyPlace> {
    const holyPlace = await this.holyPlaceRepository.findOne({
      where: { code: id },
      relations: ['ecclesiasticalUnit'],
    });

    if (!holyPlace) {
      throw new NotFoundException(`Holy place with ID ${id} not found`);
    }

    return holyPlace;
  }

  async updateHolyPlace(
    id: number,
    updateDto: UpdateHolyPlaceDto,
  ): Promise<HolyPlace> {
    const holyPlace = await this.holyPlaceRepository.findOne({
      where: { code: id },
    });

    if (!holyPlace) {
      throw new NotFoundException(`Holy place with ID ${id} not found`);
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

    // Convert coordinates to string if provided
    const updateData = {
      ...updateDto,
      longitude: updateDto.longitude?.toString(),
      latitude: updateDto.latitude?.toString(),
    };

    Object.assign(holyPlace, updateData);
    return await this.holyPlaceRepository.save(holyPlace);
  }

  async removeHolyPlace(id: number): Promise<{ message: string }> {
    const holyPlace = await this.holyPlaceRepository.findOne({
      where: { code: id },
    });

    if (!holyPlace) {
      throw new NotFoundException(`Holy place with ID ${id} not found`);
    }

    await this.holyPlaceRepository.remove(holyPlace);
    return { message: 'Holy place deleted successfully' };
  }

  // Get holy places by ecclesiastical unit
  async getHolyPlacesByUnit(unitId: number): Promise<HolyPlace[]> {
    const unit = await this.unitRepository.findOne({
      where: { code: unitId },
    });

    if (!unit) {
      throw new NotFoundException(
        `Ecclesiastical unit with ID ${unitId} not found`,
      );
    }

    return await this.holyPlaceRepository.find({
      where: { code_unite_ecclesiale: unitId },
      relations: ['ecclesiasticalUnit'],
      order: { libelle: 'ASC' },
    });
  }

  // Find nearby holy places
  async findNearbyHolyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 10,
  ): Promise<any[]> {
    const places = await this.holyPlaceRepository
      .createQueryBuilder('holyPlace')
      .leftJoinAndSelect('holyPlace.ecclesiasticalUnit', 'unit')
      .where('holyPlace.latitude IS NOT NULL')
      .andWhere('holyPlace.longitude IS NOT NULL')
      .getMany();

    // Calculate distance for each place and filter by radius
    const placesWithDistance = places
      .map((place) => {
        const lat1 = parseFloat(place.latitude);
        const lon1 = parseFloat(place.longitude);
        const lat2 = latitude;
        const lon2 = longitude;

        // Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...place, distance };
      })
      .filter((place) => place.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return placesWithDistance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Statistics
  async getStats() {
    const total = await this.holyPlaceRepository.count();

    const withCoordinates = await this.holyPlaceRepository
      .createQueryBuilder('holyPlace')
      .where('holyPlace.latitude IS NOT NULL')
      .andWhere('holyPlace.longitude IS NOT NULL')
      .getCount();

    const byUnit = await this.holyPlaceRepository
      .createQueryBuilder('holyPlace')
      .leftJoin('holyPlace.ecclesiasticalUnit', 'unit')
      .select('unit.libelle', 'unit')
      .addSelect('COUNT(holyPlace.code)', 'count')
      .groupBy('unit.libelle')
      .getRawMany();

    return {
      total,
      withCoordinates,
      withoutCoordinates: total - withCoordinates,
      byUnit,
    };
  }
}
