import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SacredObjectsService } from './sacred-objects.service';
import { SacredObjectsController } from './sacred-objects.controller';
import { SacredObject } from './entities/sacred-object.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SacredObject, EcclesiasticalUnit])],
  controllers: [SacredObjectsController],
  providers: [SacredObjectsService],
  exports: [SacredObjectsService],
})
export class SacredObjectsModule {}
