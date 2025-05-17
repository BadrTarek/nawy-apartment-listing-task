import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { City } from "./city.model";

@Entity('countries')
@Index('IDX_country_name', ['name'], { unique: true })
@Index('IDX_country_isActive', ['isActive'])
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    currency: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relations
    @OneToMany(() => City, city => city.country)
    cities: City[];
}
