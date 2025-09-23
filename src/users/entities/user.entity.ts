import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn
}
  from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}


@Entity('users')
export class User {

  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    maxLength: 100
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    uniqueItems: true
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.CUSTOMER
  })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column()
  password: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-01-01T00:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

}