import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { Country } from "./country.model";
import { Area } from "./area.model";

@Entity('cities')
@Index('IDX_city_countryId', ['countryId'])
@Index('IDX_city_isActive', ['isActive'])
@Index('IDX_city_name', ['name'])
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'country_id' })
    countryId: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relations
    @ManyToOne(() => Country)
    @JoinColumn({ name: 'country_id' })
    country: Country;

    @OneToMany(() => Area, area => area.city)
    areas: Area[];
}
