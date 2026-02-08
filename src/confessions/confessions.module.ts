import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionsService } from './confessions.service';
import { ConfessionsController } from './confessions.controller';
import { Confession } from './entities/confession.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Confession, EcclesiasticalUnit])],
  controllers: [ConfessionsController],
  providers: [ConfessionsService],
  exports: [ConfessionsService],
})
export class ConfessionsModule {}
