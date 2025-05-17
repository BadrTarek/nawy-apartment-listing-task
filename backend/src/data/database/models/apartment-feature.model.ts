import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from "typeorm";
import { ApartmentFeatureMapping } from "./apartment-feature-mapping.model";


@Entity('apartment_features')
@Index('IDX_feature_name', ['name'], { unique: true }) // assuming names are unique
export class ApartmentFeature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relationships
    @OneToMany(() => ApartmentFeatureMapping, mapping => mapping.feature)
    apartmentMappings: ApartmentFeatureMapping[];
}
