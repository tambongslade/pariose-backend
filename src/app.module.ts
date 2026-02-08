import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { LanguagesModule } from './languages/languages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EcclesiasticalUnitsModule } from './ecclesiastical-units/ecclesiastical-units.module';
import { CelebrationsModule } from './celebrations/celebrations.module';
import { ActivitiesModule } from './activities/activities.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ConfessionsModule } from './confessions/confessions.module';
import { HolyPlacesModule } from './holy-places/holy-places.module';
import { SacredObjectsModule } from './sacred-objects/sacred-objects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getDatabaseConfig(configService),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    LanguagesModule,
    DashboardModule,
    EcclesiasticalUnitsModule,
    CelebrationsModule,
    ActivitiesModule,
    AnnouncementsModule,
    ConfessionsModule,
    HolyPlacesModule,
    SacredObjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
