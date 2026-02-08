import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcclesiasticalUnitsService } from './ecclesiastical-units.service';
import { EcclesiasticalUnitsController } from './ecclesiastical-units.controller';
import { EcclesiasticalUnit } from './entities/ecclesiastical-unit.entity';
import { EcclesiasticalUnitTranslation } from './entities/ecclesiastical-unit-translation.entity';
import { User } from '../users/entities/user.entity';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EcclesiasticalUnit,
      EcclesiasticalUnitTranslation,
      User,
    ]),
    LanguagesModule,
  ],
  controllers: [EcclesiasticalUnitsController],
  providers: [EcclesiasticalUnitsService],
  exports: [EcclesiasticalUnitsService],
})
export class EcclesiasticalUnitsModule {}
