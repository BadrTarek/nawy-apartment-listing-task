import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1747176763921 implements MigrationInterface {
    name = 'InitialMigration1747176763921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countries" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "currency" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_country_isActive" ON "countries" ("is_active") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_country_name" ON "countries" ("name") `);
        await queryRunner.query(`CREATE TABLE "cities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "country_id" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_city_name" ON "cities" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_city_isActive" ON "cities" ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_city_countryId" ON "cities" ("country_id") `);
        await queryRunner.query(`CREATE TABLE "areas" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "city_id" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_5110493f6342f34c978c084d0d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_area_name" ON "areas" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_area_isActive" ON "areas" ("is_active") `);
        await queryRunner.query(`CREATE INDEX "IDX_area_cityId" ON "areas" ("city_id") `);
        await queryRunner.query(`CREATE TABLE "apartment_images" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "apartment_id" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_ce77a6cd7cb8375695d034efddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_image_apartmentId" ON "apartment_images" ("apartment_id") `);
        await queryRunner.query(`CREATE TABLE "apartment_features" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_8927fcbe6dd6e391df60d6552b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_feature_name" ON "apartment_features" ("name") `);
        await queryRunner.query(`CREATE TABLE "apartment_feature_mappings" ("id" SERIAL NOT NULL, "apartment_id" integer NOT NULL, "feature_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10120992760017dfe69cbe6d978" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_featureMapping_apartment_feature" ON "apartment_feature_mappings" ("apartment_id", "feature_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_featureMapping_featureId" ON "apartment_feature_mappings" ("feature_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_featureMapping_apartmentId" ON "apartment_feature_mappings" ("apartment_id") `);
        await queryRunner.query(`CREATE TABLE "apartments" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "area_id" integer NOT NULL, "address" character varying NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_f6058e85d6d715dbe22b72fe722" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_apartment_price" ON "apartments" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_apartment_createdAt" ON "apartments" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_apartment_isAvailable" ON "apartments" ("is_available") `);
        await queryRunner.query(`CREATE INDEX "IDX_apartment_areaId" ON "apartments" ("area_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_email" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "areas" ADD CONSTRAINT "FK_80f0c713a07a49f0b7020dadd70" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apartment_images" ADD CONSTRAINT "FK_255140b8a35c7d5df2171977d99" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" ADD CONSTRAINT "FK_c40845bf84796cdeeb4f26b2d2e" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" ADD CONSTRAINT "FK_0ad4d994d66f656b2797d4216d6" FOREIGN KEY ("feature_id") REFERENCES "apartment_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "apartments" ADD CONSTRAINT "FK_3d877b235058f0972943293e944" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apartments" DROP CONSTRAINT "FK_3d877b235058f0972943293e944"`);
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" DROP CONSTRAINT "FK_0ad4d994d66f656b2797d4216d6"`);
        await queryRunner.query(`ALTER TABLE "apartment_feature_mappings" DROP CONSTRAINT "FK_c40845bf84796cdeeb4f26b2d2e"`);
        await queryRunner.query(`ALTER TABLE "apartment_images" DROP CONSTRAINT "FK_255140b8a35c7d5df2171977d99"`);
        await queryRunner.query(`ALTER TABLE "areas" DROP CONSTRAINT "FK_80f0c713a07a49f0b7020dadd70"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_apartment_areaId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_apartment_isAvailable"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_apartment_createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_apartment_price"`);
        await queryRunner.query(`DROP TABLE "apartments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_featureMapping_apartmentId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_featureMapping_featureId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_featureMapping_apartment_feature"`);
        await queryRunner.query(`DROP TABLE "apartment_feature_mappings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_feature_name"`);
        await queryRunner.query(`DROP TABLE "apartment_features"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_image_apartmentId"`);
        await queryRunner.query(`DROP TABLE "apartment_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_area_cityId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_area_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_area_name"`);
        await queryRunner.query(`DROP TABLE "areas"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_city_countryId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_city_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_city_name"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_country_name"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_country_isActive"`);
        await queryRunner.query(`DROP TABLE "countries"`);
    }

}
