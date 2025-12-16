import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @Index()
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'uuid_generate_v7()',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;
}
