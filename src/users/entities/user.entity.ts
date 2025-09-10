import { from } from "rxjs";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";


export enum UserRole {
    SUPER_ADMIN = 'SUPER-ADMIN',
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  
  @Column({ length: 100 })
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;


  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


