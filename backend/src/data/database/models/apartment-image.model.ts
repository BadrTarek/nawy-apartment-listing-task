import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { Apartment } from "./apartment.model";

@Entity('apartment_images')
@Index('IDX_image_apartmentId', ['apartmentId'])
export class ApartmentImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({ name: 'apartment_id' })
    apartmentId: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt?: Date;

    // Relations
    @ManyToOne(() => Apartment)
    @JoinColumn({ name: 'apartment_id' })
    apartment: Apartment;
}
