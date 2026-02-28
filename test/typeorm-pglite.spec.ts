import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PGliteDriver } from "../lib";
import { DataSource } from "typeorm";
import { Photo } from "./photo.entity";
// @ts-expect-error
import { CreateUserTableMigration } from "./create-user-table.migration.js";

describe("typeorm-pglite", () => {
  let pgliteDb: DataSource;

  beforeAll(async () => {
    const dataSource = new DataSource({
      type: "postgres",
      driver: new PGliteDriver().driver,
      entities: [Photo],
      migrationsRun: true,
      migrations: [CreateUserTableMigration],
      synchronize: true,
    });

    pgliteDb = await dataSource.initialize();
  });

  afterAll(async () => {
    await pgliteDb.driver.disconnect();
  });

  it("should initialize pglite database", async () => {
    expect(pgliteDb.isInitialized).toBe(true);
  });

  it("should run migrations", async () => {
    const results = await pgliteDb.query('select count(*) from "migrations"');
    expect(results[0].count).toBe(1);
  });

  it("should execute multi-statement queries without parameters", async () => {
    // the second SELECT's result is returned by our wrapper (see
    // pglite-pool.ts).  prior to the fix, this would error out in pglite
    // because the prepared statement would contain two commands.
    const results = await pgliteDb.query("select 1 as a; select 2 as a");
    expect(results[0].a).toBe(2);
  });

  it("should sync entities", async () => {
    const results = await pgliteDb.query('select count(*) from "photo"');
    expect(results[0].count).toBe(0);
  });

  it("should save entity", async () => {
    const photo = new Photo();
    photo.name = "Test Photo";
    await pgliteDb.manager.save(photo);

    const results = await pgliteDb.manager.find(Photo);

    expect(results.length).toBe(1);
  });
});
