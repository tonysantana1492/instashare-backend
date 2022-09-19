import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column()
  ext: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column('boolean', {default: false})
  status: boolean;

  @ManyToOne((type) => User, (user) => user.files, { eager: false })
  user: User;

  @Column()
  userId: number; //Esta columna la creo para quiarme pq realmente quien me la crea es la relacion de arriba

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
