import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { File } from "src/filemanager/filemanager.entity";

@Entity()
@Unique(['username']) //Arrays of columns that must be unique
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayname: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;
 
    @OneToMany(type => File, file => file.user, {eager: true})
    files: File[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updateAt: Date;

    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

}