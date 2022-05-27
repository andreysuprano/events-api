import { Entity, Column, CreateDateColumn, UpdateDateColumn, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import Evento from './Evento';

@Entity()
export default class Usuario{
    @Column()
    @Generated("uuid")
    @PrimaryColumn()
    uuid: string;

    @Column()
    nome:string;
    
    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column()
    status:string;

    @CreateDateColumn({select:false})
    created_at: Date;

    @UpdateDateColumn({select:false})
    updated_at: Date;

    @OneToMany(()=> Evento, (evento)=> evento.usuario)
    eventos:Evento[]
}