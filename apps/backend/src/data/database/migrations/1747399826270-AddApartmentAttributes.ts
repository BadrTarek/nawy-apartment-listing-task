import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApartmentAttributes1747399826270 implements MigrationInterface {
    name = 'AddApartmentAttributes1747399826270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartments" ADD "size" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ADD "bedrooms" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ADD "bathrooms" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ALTER COLUMN "longitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ALTER COLUMN "latitude" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartments" ALTER COLUMN "latitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ALTER COLUMN "longitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" DROP COLUMN "bathrooms"`);
        await queryRunner.query(`ALTER TABLE "apartments" DROP COLUMN "bedrooms"`);
        await queryRunner.query(`ALTER TABLE "apartments" DROP COLUMN "size"`);
    }

}
