import { IApartmentRepository } from "../../domain/interfaces/repositories/apartment-repository.interface";
import { IApartmentFeatureMappingRepository } from "../../domain/interfaces/repositories/apartment-feature-mapping-repository.interface";
import { IApartmentImageRepository } from "../../domain/interfaces/repositories/apartment-image-repository.interface";
import { ICountryRepository } from "../../domain/interfaces/repositories/country-repository.interface";
import { ICityRepository } from "../../domain/interfaces/repositories/city-repository.interface";
import { IAreaRepository } from "../../domain/interfaces/repositories/area-repository.interface";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { DataSource, QueryRunner } from 'typeorm';
import { ApartmentRepository } from "./repositories/apartment.repository";
import { ApartmentFeatureMappingRepository } from "./repositories/apartment-feature-mapping.repository";
import { ApartmentImageRepository } from "./repositories/apartment-image.repository";
import { CountryRepository } from "./repositories/country.repository";
import { CityRepository } from "./repositories/city.repository";
import { AreaRepository } from "./repositories/area.repository";


export class UnitOfWork implements IUnitOfWork {
    private readonly dataSource: DataSource;
    private queryRunner: QueryRunner | null = null;
    private _apartmentRepository: IApartmentRepository | null = null;
    private _apartmentFeatureMappingRepository: IApartmentFeatureMappingRepository | null = null;
    private _apartmentImageRepository: IApartmentImageRepository | null = null;
    private _countryRepository: ICountryRepository | null = null;
    private _cityRepository: ICityRepository | null = null;
    private _areaRepository: IAreaRepository | null = null;

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

    public get apartmentImageRepository(): IApartmentImageRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._apartmentImageRepository ??= new ApartmentImageRepository(this.queryRunner);
        return this._apartmentImageRepository;
    }

    public get countryRepository(): ICountryRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._countryRepository ??= new CountryRepository(this.queryRunner);
        return this._countryRepository;
    }

    public get cityRepository(): ICityRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._cityRepository ??= new CityRepository(this.queryRunner);
        return this._cityRepository;
    }

    public get areaRepository(): IAreaRepository {
        if (!this.queryRunner) {
            throw new Error('Transaction is not started yet');
        }
        this._areaRepository ??= new AreaRepository(this.queryRunner);
        return this._areaRepository;
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
            return;
        }

        try {
            await this.queryRunner.commitTransaction();
        } finally {
            await this.release();
        }
    }

    async rollback(): Promise<void> {
        if (!this.queryRunner) {
            return;
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
            this._apartmentImageRepository = null;
            this._countryRepository = null;
            this._cityRepository = null;
            this._areaRepository = null;
        }
    }
}