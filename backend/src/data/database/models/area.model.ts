import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { City } from "./city.model";
import { Apartment } from "./apartment.model";

@Entity('areas')
@Index('IDX_area_cityId', ['cityId'])
@Index('IDX_area_isActive', ['isActive'])
@Index('IDX_area_name', ['name'])
export class Area {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'city_id' })
    cityId: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relations
    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @OneToMany(() => Apartment, apartment => apartment.area)
    apartments: Apartment[];
}
