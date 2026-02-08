import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EcclesiasticalUnit } from '../ecclesiastical-units/entities/ecclesiastical-unit.entity';
import { Celebration } from '../celebrations/entities/celebration.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Confession } from '../confessions/entities/confession.entity';
import { HolyPlace } from '../holy-places/entities/holy-place.entity';
import { SacredObject } from '../sacred-objects/entities/sacred-object.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EcclesiasticalUnit)
    private readonly unitRepository: Repository<EcclesiasticalUnit>,
    @InjectRepository(Celebration)
    private readonly celebrationRepository: Repository<Celebration>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(Confession)
    private readonly confessionRepository: Repository<Confession>,
    @InjectRepository(HolyPlace)
    private readonly holyPlaceRepository: Repository<HolyPlace>,
    @InjectRepository(SacredObject)
    private readonly sacredObjectRepository: Repository<SacredObject>,
  ) {}

  /**
   * Get overview statistics for SUPER_ADMIN and ADMIN
   */
  async getOverviewStatistics() {
    const [
      totalUsers,
      totalUnits,
      totalCelebrations,
      totalActivities,
      totalAnnouncements,
      totalConfessions,
      totalHolyPlaces,
      totalSacredObjects,
      recentUsers,
      upcomingCelebrations,
      activeAnnouncements,
    ] = await Promise.all([
      // Count totals
      this.userRepository.count(),
      this.unitRepository.count(),
      this.celebrationRepository.count(),
      this.activityRepository.count(),
      this.announcementRepository.count(),
      this.confessionRepository.count(),
      this.holyPlaceRepository.count(),
      this.sacredObjectRepository.count(),

      // Recent users (last 30 days)
      this.userRepository.count({
        where: {
          date_creation: MoreThan(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        },
      }),

      // Upcoming celebrations (next 7 days) - if you have a date field
      this.celebrationRepository
        .createQueryBuilder('celebration')
        .where('celebration.date_creation >= :now', { now: new Date() })
        .getCount(),

      // Active announcements
      this.announcementRepository
        .createQueryBuilder('announcement')
        .where(
          '(announcement.date_expiration IS NULL OR announcement.date_expiration >= :now)',
          { now: new Date() },
        )
        .getCount(),
    ]);

    // Get users by role
    const usersByRole = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .select('role.libelle', 'role')
      .addSelect('COUNT(user.code)', 'count')
      .groupBy('role.libelle')
      .getRawMany();

    // Get units by type
    const unitsByType = await this.unitRepository
      .createQueryBuilder('unit')
      .select('unit.code_type', 'type')
      .addSelect('COUNT(unit.code)', 'count')
      .groupBy('unit.code_type')
      .getRawMany();

    return {
      overview: {
        totalUsers,
        totalEcclesiasticalUnits: totalUnits,
        totalCelebrations,
        totalActivities,
        totalAnnouncements,
        totalConfessions,
        totalHolyPlaces,
        totalSacredObjects,
      },
      recentActivity: {
        newUsersLast30Days: recentUsers,
        upcomingCelebrationsNext7Days: upcomingCelebrations,
        activeAnnouncements,
      },
      distributions: {
        usersByRole: usersByRole.map((r) => ({
          role: r.role,
          count: parseInt(r.count),
        })),
        unitsByType: unitsByType.map((u) => ({
          type: u.type,
          count: parseInt(u.count),
        })),
      },
    };
  }

  /**
   * Get user growth statistics (ADMIN/SUPER_ADMIN)
   */
  async getUserGrowthStatistics(months: number = 12) {
    const growth: Array<{ month: string; newUsers: number }> = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await this.userRepository.count({
        where: {
          date_creation: Between(startDate, endDate),
        },
      });

      growth.push({
        month: startDate.toISOString().slice(0, 7),
        newUsers: count,
      });
    }

    return growth;
  }

  /**
   * Get parish statistics for PRIEST/DEACON
   */
  async getMyParishStatistics(userId: number) {
    // Find the user with their ecclesiastical unit assignments
    const user = await this.userRepository.findOne({
      where: { code: userId },
      relations: ['roles'],
    });

    if (!user) {
      return null;
    }

    // For now, we'll get statistics for all units the user created
    // In a real implementation, you'd have a proper assignment system
    const myUnits = await this.unitRepository.find({
      where: { code_createur: userId },
    });

    if (myUnits.length === 0) {
      return {
        message: 'No parish assigned',
        statistics: null,
      };
    }

    const unitIds = myUnits.map((u) => u.code);

    const [
      totalCelebrations,
      totalActivities,
      totalAnnouncements,
      totalSubscribers,
      upcomingCelebrations,
      recentActivities,
    ] = await Promise.all([
      // Count celebrations in my units
      this.celebrationRepository
        .createQueryBuilder('celebration')
        .where('celebration.code_unite_ecclesiale IN (:...unitIds)', { unitIds })
        .getCount(),

      // Count activities in my units
      this.activityRepository
        .createQueryBuilder('activity')
        .where('activity.code_unite_ecclesiale IN (:...unitIds)', { unitIds })
        .getCount(),

      // Count announcements in my units
      this.announcementRepository
        .createQueryBuilder('announcement')
        .where('announcement.code_unite_ecclesiale IN (:...unitIds)', { unitIds })
        .getCount(),

      // Count total subscribers across my units
      this.unitRepository
        .createQueryBuilder('unit')
        .leftJoin('unit.subscribers', 'subscriber')
        .where('unit.code IN (:...unitIds)', { unitIds })
        .select('COUNT(DISTINCT subscriber.code)', 'count')
        .getRawOne()
        .then((result) => parseInt(result.count) || 0),

      // Upcoming celebrations (next 30 days)
      this.celebrationRepository
        .createQueryBuilder('celebration')
        .where('celebration.code_unite_ecclesiale IN (:...unitIds)', {
          unitIds,
        })
        .andWhere('celebration.date_celebration >= :now', { now: new Date() })
        .andWhere(
          'celebration.date_celebration <= :future',
          { future: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        )
        .orderBy('celebration.date_celebration', 'ASC')
        .take(10)
        .getMany(),

      // Recent activities (last 30 days)
      this.activityRepository
        .createQueryBuilder('activity')
        .where('activity.code_unite_ecclesiale IN (:...unitIds)', {
          unitIds,
        })
        .andWhere('activity.date_debut >= :past', {
          past: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        })
        .orderBy('activity.date_debut', 'DESC')
        .take(10)
        .getMany(),
    ]);

    return {
      parishInfo: {
        units: myUnits.map((u) => ({
          code: u.code,
          libelle: u.libelle,
          titre: u.titre,
        })),
      },
      statistics: {
        totalCelebrations,
        totalActivities,
        totalAnnouncements,
        totalSubscribers,
      },
      upcomingCelebrations,
      recentActivities,
    };
  }

  /**
   * Get personal dashboard for regular users
   */
  async getMyDashboard(userId: number) {
    const user = await this.userRepository.findOne({
      where: { code: userId },
      relations: ['roles'],
    });

    if (!user) {
      return null;
    }

    // Get subscribed units
    const subscribedUnits = await this.unitRepository
      .createQueryBuilder('unit')
      .leftJoin('unit.subscribers', 'subscriber')
      .where('subscriber.code = :userId', { userId })
      .getMany();

    const unitIds = subscribedUnits.map((u) => u.code);

    if (unitIds.length === 0) {
      return {
        subscriptions: [],
        upcomingCelebrations: [],
        upcomingActivities: [],
        recentAnnouncements: [],
      };
    }

    const [upcomingCelebrations, upcomingActivities, recentAnnouncements] =
      await Promise.all([
        // Upcoming celebrations in subscribed units
        this.celebrationRepository
          .createQueryBuilder('celebration')
          .leftJoinAndSelect(
            'celebration.ecclesiasticalUnit',
            'unit',
          )
          .where('celebration.code_unite_ecclesiale IN (:...unitIds)', {
            unitIds,
          })
          .andWhere('celebration.date_celebration >= :now', {
            now: new Date(),
          })
          .orderBy('celebration.date_celebration', 'ASC')
          .take(10)
          .getMany(),

        // Upcoming activities in subscribed units
        this.activityRepository
          .createQueryBuilder('activity')
          .leftJoinAndSelect('activity.ecclesiasticalUnit', 'unit')
          .where('activity.code_unite_ecclesiale IN (:...unitIds)', {
            unitIds,
          })
          .andWhere('activity.date_debut >= :now', { now: new Date() })
          .orderBy('activity.date_debut', 'ASC')
          .take(10)
          .getMany(),

        // Recent announcements in subscribed units
        this.announcementRepository
          .createQueryBuilder('announcement')
          .leftJoinAndSelect(
            'announcement.ecclesiasticalUnit',
            'unit',
          )
          .where('announcement.code_unite_ecclesiale IN (:...unitIds)', {
            unitIds,
          })
          .andWhere(
            '(announcement.date_expiration IS NULL OR announcement.date_expiration >= :now)',
            { now: new Date() },
          )
          .orderBy('announcement.date_publication', 'DESC')
          .take(10)
          .getMany(),
      ]);

    return {
      subscriptions: subscribedUnits.map((u) => ({
        code: u.code,
        libelle: u.libelle,
        titre: u.titre,
        adresse: u.adresse,
      })),
      upcomingCelebrations,
      upcomingActivities,
      recentAnnouncements,
    };
  }

  /**
   * Get activity statistics by date range (ADMIN/SUPER_ADMIN)
   */
  async getActivityStatistics(startDate: Date, endDate: Date) {
    const [
      celebrationsCount,
      activitiesCount,
      announcementsCount,
      newUsersCount,
    ] = await Promise.all([
      this.celebrationRepository.count({
        where: {
          date_creation: Between(startDate, endDate),
        },
      }),

      this.activityRepository.count({
        where: {
          date_creation: Between(startDate, endDate),
        },
      }),

      this.announcementRepository.count({
        where: {
          date_creation: Between(startDate, endDate),
        },
      }),

      this.userRepository.count({
        where: {
          date_creation: Between(startDate, endDate),
        },
      }),
    ]);

    return {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      statistics: {
        celebrationsCreated: celebrationsCount,
        activitiesCreated: activitiesCount,
        announcementsPublished: announcementsCount,
        newUsers: newUsersCount,
      },
    };
  }

  /**
   * Get most active parishes (ADMIN/SUPER_ADMIN)
   */
  async getMostActiveParishes(limit: number = 10) {
    const parishes = await this.unitRepository
      .createQueryBuilder('unit')
      .leftJoin('unit.subscribers', 'subscriber')
      .select('unit.code', 'code')
      .addSelect('unit.libelle', 'libelle')
      .addSelect('COUNT(DISTINCT subscriber.code)', 'subscriberCount')
      .groupBy('unit.code')
      .addGroupBy('unit.libelle')
      .orderBy('"subscriberCount"', 'DESC')
      .limit(limit)
      .getRawMany();

    // Get additional stats for each parish
    const parishStats = await Promise.all(
      parishes.map(async (parish) => {
        const [celebrationsCount, activitiesCount, announcementsCount] =
          await Promise.all([
            this.celebrationRepository
              .createQueryBuilder('celebration')
              .where('celebration.code_unite_ecclesiale = :code', { code: parish.code })
              .getCount(),
            this.activityRepository
              .createQueryBuilder('activity')
              .where('activity.code_unite_ecclesiale = :code', { code: parish.code })
              .getCount(),
            this.announcementRepository
              .createQueryBuilder('announcement')
              .where('announcement.code_unite_ecclesiale = :code', { code: parish.code })
              .getCount(),
          ]);

        return {
          code: parish.code,
          libelle: parish.libelle,
          subscribers: parseInt(parish.subscriberCount) || 0,
          celebrations: celebrationsCount,
          activities: activitiesCount,
          announcements: announcementsCount,
        };
      }),
    );

    return parishStats;
  }
}
