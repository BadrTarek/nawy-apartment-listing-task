import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";
import { Area } from "./area.model";
import { ApartmentImage } from "./apartment-image.model";
import { ApartmentFeatureMapping } from "./apartment-feature-mapping.model";

@Entity('apartments')
@Index('IDX_apartment_areaId', ['areaId'])
@Index('IDX_apartment_isAvailable', ['isAvailable'])
@Index('IDX_apartment_createdAt', ['createdAt'])
@Index('IDX_apartment_price', ['price'])
export class Apartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'area_id' })
    areaId: number;

    @Column()
    address: string;

    @Column("decimal", { name: 'longitude' })
    longitude: number;

    @Column("decimal", { name: 'latitude' })
    latitude: number;

    @Column({ name: 'is_available', default: true })
    isAvailable: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relations
    @ManyToOne(() => Area)
    @JoinColumn({ name: 'area_id' })
    area: Area;

    @OneToMany(() => ApartmentImage, image => image.apartment)
    images: ApartmentImage[];

    @OneToMany(() => ApartmentFeatureMapping, mapping => mapping.apartment)
    featureMappings: ApartmentFeatureMapping[];
}
