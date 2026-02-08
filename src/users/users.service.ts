import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto, creatorId?: number) {
    // Check if username already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Get roles
    let roles: Role[];
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      roles = await this.roleRepository.find({
        where: { code: In(createUserDto.roleIds) },
      });

      if (roles.length !== createUserDto.roleIds.length) {
        throw new NotFoundException('One or more roles not found');
      }
    } else {
      // Default to USER role
      const userRole = await this.roleRepository.findOne({
        where: { libelle: 'USER' },
      });

      if (!userRole) {
        throw new NotFoundException('Default USER role not found');
      }

      roles = [userRole];
    }

    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles,
      code_createur: creatorId,
    });

    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(queryDto: QueryUserDto) {
    const { search, role, page = 1, limit = 10 } = queryDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.code',
        'user.username',
        'user.noms',
        'user.prenoms',
        'user.date_naissance',
        'user.contact_1',
        'user.contact_2',
        'user.addresse',
        'user.date_creation',
        'user.date_modification',
        'roles.code',
        'roles.libelle',
      ]);

    // Search filter
    if (search) {
      queryBuilder.where(
        '(user.username ILIKE :search OR user.noms ILIKE :search OR user.prenoms ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Role filter
    if (role) {
      queryBuilder.andWhere('roles.libelle = :role', { role });
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { code: id },
      relations: ['roles', 'roles.permissions'],
      select: {
        code: true,
        username: true,
        noms: true,
        prenoms: true,
        date_naissance: true,
        contact_1: true,
        contact_2: true,
        addresse: true,
        code_createur: true,
        code_modificateur: true,
        date_creation: true,
        date_modification: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    updaterId: number,
    currentUser: User,
  ) {
    const user = await this.userRepository.findOne({
      where: { code: id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if user can update this profile
    const isOwnProfile = currentUser.code === id;
    const isAdmin = currentUser.roles.some((role) =>
      ['ADMIN', 'SUPER_ADMIN'].includes(role.libelle),
    );

    if (!isOwnProfile && !isAdmin) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // If updating username, check if it's already taken
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Update roles (only admins can change roles)
    if (updateUserDto.roleIds) {
      if (!isAdmin) {
        throw new ForbiddenException('Only admins can change user roles');
      }

      const roles = await this.roleRepository.find({
        where: { code: In(updateUserDto.roleIds) },
      });

      if (roles.length !== updateUserDto.roleIds.length) {
        throw new NotFoundException('One or more roles not found');
      }

      user.roles = roles;
    }

    // Update user fields
    Object.assign(user, {
      ...updateUserDto,
      code_modificateur: updaterId,
      roleIds: undefined, // Remove roleIds from direct assignment
    });

    const savedUser = await this.userRepository.save(user);

    // Return without password
    const { password, ...result } = savedUser;
    return result;
  }

  async remove(id: number, currentUser: User) {
    const user = await this.userRepository.findOne({
      where: { code: id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if user is admin
    const isAdmin = currentUser.roles.some((role) =>
      ['ADMIN', 'SUPER_ADMIN'].includes(role.libelle),
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can delete users');
    }

    // Prevent self-deletion
    if (currentUser.code === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }

  async assignRoles(userId: number, roleIds: number[], currentUser: User) {
    // Check if user is admin
    const isAdmin = currentUser.roles.some((role) =>
      ['ADMIN', 'SUPER_ADMIN'].includes(role.libelle),
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can assign roles');
    }

    const user = await this.userRepository.findOne({
      where: { code: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const roles = await this.roleRepository.find({
      where: { code: In(roleIds) },
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    user.roles = roles;
    user.code_modificateur = currentUser.code;

    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async getUserStats() {
    const total = await this.userRepository.count();

    const roleStats = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .select('role.libelle', 'role')
      .addSelect('COUNT(user.code)', 'count')
      .groupBy('role.libelle')
      .getRawMany();

    return {
      total,
      byRole: roleStats,
    };
  }
}
