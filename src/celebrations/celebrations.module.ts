import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CelebrationsService } from './celebrations.service';
import { CelebrationsController } from './celebrations.controller';
import { Celebration } from './entities/celebration.entity';
import { MassIntention } from './entities/mass-intention.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Celebration, MassIntention, EcclesiasticalUnit]),
  ],
  controllers: [CelebrationsController],
  providers: [CelebrationsService],
  exports: [CelebrationsService],
})
export class CelebrationsModule {}
