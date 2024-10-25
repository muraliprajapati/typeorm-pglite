import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'character varying',
    length: 100,
  })
  name!: string;

  @Column({ type: "int", default: 0 })
  views!: number;
}
