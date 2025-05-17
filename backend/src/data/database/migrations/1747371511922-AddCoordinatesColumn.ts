import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoordinatesColumn1747371511922 implements MigrationInterface {
    name = 'AddCoordinatesColumn1747371511922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartments" ADD "longitude" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "apartments" ADD "latitude" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartments" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "apartments" DROP COLUMN "latitude"`);
    }

}
