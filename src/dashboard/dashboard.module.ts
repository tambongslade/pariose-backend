import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../users/entities/user.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { Celebration } from '../celebrations/entities/celebration.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Confession } from '../confessions/entities/confession.entity';
import { HolyPlace } from '../holy-places/entities/holy-place.entity';
import { SacredObject } from '../sacred-objects/entities/sacred-object.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      EcclesiasticalUnit,
      Celebration,
      Activity,
      Announcement,
      Confession,
      HolyPlace,
      SacredObject,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
