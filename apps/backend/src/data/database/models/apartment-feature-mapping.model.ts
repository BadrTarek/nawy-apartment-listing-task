import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Apartment } from "./apartment.model";
import { ApartmentFeature } from "./apartment-feature.model";

@Entity('apartment_feature_mappings')
@Index('IDX_featureMapping_apartmentId', ['apartmentId'])
@Index('IDX_featureMapping_featureId', ['featureId'])
@Index('IDX_featureMapping_apartment_feature', ['apartmentId', 'featureId'], { unique: true }) // Enforce uniqueness
export class ApartmentFeatureMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'apartment_id' })
    apartmentId: number;

    @Column({ name: 'feature_id' })
    featureId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relations
    @ManyToOne(() => Apartment, apartment => apartment.featureMappings)
    @JoinColumn({ name: 'apartment_id' })
    apartment: Apartment;

    @ManyToOne(() => ApartmentFeature, feature => feature.apartmentMappings)
    @JoinColumn({ name: 'feature_id' })
    feature: ApartmentFeature;
}
