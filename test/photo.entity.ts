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

  // added boolean column to reproduce issue #4
  @Column({ type: 'boolean', default: false })
  isPublic!: boolean;
}
