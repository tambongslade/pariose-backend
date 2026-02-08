import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto, creatorCode: number): Promise<Role> {
    // Check if role already exists
    const existingRole = await this.roleRepository.findOne({
      where: { libelle: createRoleDto.libelle },
    });

    if (existingRole) {
      throw new ConflictException(`Role with name '${createRoleDto.libelle}' already exists`);
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      code_createur: creatorCode,
    });

    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
      order: { libelle: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { code: id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
    modifierCode: number,
  ): Promise<Role> {
    const role = await this.findOne(id);

    // Check for duplicate role name if libelle is being updated
    if (updateRoleDto.libelle && updateRoleDto.libelle !== role.libelle) {
      const existingRole = await this.roleRepository.findOne({
        where: { libelle: updateRoleDto.libelle },
      });

      if (existingRole) {
        throw new ConflictException(`Role with name '${updateRoleDto.libelle}' already exists`);
      }
    }

    Object.assign(role, {
      ...updateRoleDto,
      code_modificateur: modifierCode,
    });

    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.findOne(id);

    // Prevent deletion of system roles
    const systemRoles = ['SUPER_ADMIN', 'ADMIN', 'PRIEST', 'DEACON', 'VOLUNTEER', 'USER'];
    if (systemRoles.includes(role.libelle)) {
      throw new ConflictException(`Cannot delete system role '${role.libelle}'`);
    }

    await this.roleRepository.remove(role);
    return { message: `Role '${role.libelle}' deleted successfully` };
  }

  async getRoleStats(): Promise<any> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    return {
      totalRoles: roles.length,
      roles: roles.map((role) => ({
        code: role.code,
        libelle: role.libelle,
        permissionsCount: role.permissions?.length || 0,
      })),
    };
  }
}
