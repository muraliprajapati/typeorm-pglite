# typeorm-pglite

[PGlite](https://pglite.dev/) support for TypeORM.

## Installation

PGlite is a `peerDependency` of `typeorm-pglite` so ensure you have it installed in your project.

```sh
npm install @electric-sql/pglite
npm install typeorm-pglite
```

## Usage

`typeorm-pglite` works with TypeORM's existing `postgres` dialect. Just provide the `PGliteDriver` to the `driver` datasource options and it works!

```javascript
import { PGliteDriver, getPGliteInstance } from "typeorm-pglite";
import { DataSource } from "typeorm";

const PGliteDataSource = new DataSource({
  type: "postgres",
  driver: new PGliteDriver().driver,
});

// You can access the internal PGlite instance using getPGliteInstance function
const pgliteDb = await getPGliteInstance();
```

## Example

```javascript
import { PGliteDriver } from "typeorm-pglite";
import { Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;
}

const AppDataSource = new DataSource({
  type: "postgres",
  driver: new PGliteDriver().driver, // provide PGlite options in PGliteDriver constructor
  synchronize: true,
  logging: true,
  entities: [Photo],
  // remaining typeorm datasource options
});

async function run() {
  try {
    const db = await AppDataSource.initialize();

    const photo = new Photo();
    photo.name = "Example Photo";
    await db.manager.save(photo);

    const allPhotos = await db.manager.find(Photo);
    console.log({ allPhotos });
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
```
