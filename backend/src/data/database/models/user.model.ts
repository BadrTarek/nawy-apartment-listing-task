import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Role } from "../../../domain/enums/role.enum";

@Entity('users')
@Index('IDX_user_email', ['email'], { unique: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.USER
    })
    role: Role;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;
}
