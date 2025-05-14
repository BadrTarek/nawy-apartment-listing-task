import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureValueColumn1747218949676 implements MigrationInterface {
    name = 'AddFeatureValueColumn1747218949676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartment_features" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" ADD "feature_value" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" DROP COLUMN "feature_value"`);
        await queryRunner.query(`ALTER TABLE "apartment_features" ADD "description" text NOT NULL`);
    }

}
