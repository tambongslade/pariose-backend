import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    // Get default USER role
    const userRole = await this.roleRepository.findOne({
      where: { libelle: 'USER' },
    });

    if (!userRole) {
      throw new NotFoundException('Default USER role not found');
    }

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      roles: [userRole],
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const tokens = await this.generateTokens(savedUser);

    // Return user without password
    const { password, ...userWithoutPassword } = savedUser;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user with roles
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const tokens = await this.generateTokens(user);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { code: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refreshToken(userId: number) {
    const user = await this.validateUser(userId);
    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.code,
      username: user.username,
      roles: user.roles?.map((role) => role.libelle) || [],
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400, // 24 hours in seconds
    };
  }
}
