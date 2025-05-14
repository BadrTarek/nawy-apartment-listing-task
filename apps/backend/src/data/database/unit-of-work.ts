import { IApartmentRepository } from "../../domain/interfaces/repositories/apartment-repository.interface";
import { IApartmentFeatureMappingRepository } from "../../domain/interfaces/repositories/apartment-feature-mapping-repository.interface";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { DataSource, QueryRunner } from 'typeorm';
import { ApartmentRepository } from "./repositories/apartment.repository";
import { ApartmentFeatureMappingRepository } from "./repositories/apartment-feature-mapping.repository";


export class UnitOfWork implements IUnitOfWork {
    private readonly dataSource: DataSource;
    private queryRunner: QueryRunner | null = null;
    private _apartmentRepository: IApartmentRepository | null = null;
    private _apartmentFeatureMappingRepository: IApartmentFeatureMappingRepository | null = null;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    public get apartmentRepository(): IApartmentRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._apartmentRepository ??= new ApartmentRepository(this.queryRunner);
        return this._apartmentRepository;
    }

    public get apartmentFeatureMappingRepository(): IApartmentFeatureMappingRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._apartmentFeatureMappingRepository ??= new ApartmentFeatureMappingRepository(this.queryRunner);
        return this._apartmentFeatureMappingRepository;
    }

    async beginTransaction(): Promise<void> {
        if (this.queryRunner) {
            throw new Error('Transaction already in progress');
        }

        this.queryRunner = this.dataSource.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
    }

    async commit(): Promise<void> {
        if (!this.queryRunner) {
            throw new Error('No active transaction to commit');
        }

        try {
            await this.queryRunner.commitTransaction();
        } finally {
            await this.release();
        }
    }

    async rollback(): Promise<void> {
        if (!this.queryRunner) {
            throw new Error('No active transaction to rollback');
        }

        try {
            await this.queryRunner.rollbackTransaction();
        } finally {
            await this.release();
        }
    }

    private async release(): Promise<void> {
        if (this.queryRunner) {
            await this.queryRunner.release();
            this.queryRunner = null;
            this._apartmentRepository = null;
            this._apartmentFeatureMappingRepository = null;
        }
    }
}