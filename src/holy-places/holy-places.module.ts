import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolyPlacesService } from './holy-places.service';
import { HolyPlacesController } from './holy-places.controller';
import { HolyPlace } from './entities/holy-place.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HolyPlace, EcclesiasticalUnit])],
  controllers: [HolyPlacesController],
  providers: [HolyPlacesService],
  exports: [HolyPlacesService],
})
export class HolyPlacesModule {}
