export class CreateUserTableMigration {
  name = "CreateUserTableMigration1729838591551";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now())`
    );
    return Promise.resolve();
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "users"`);
    return Promise.resolve();
  }
}
