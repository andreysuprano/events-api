import { Entity, Column, CreateDateColumn, UpdateDateColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export default class Configuracao{
    @Column()
    @PrimaryColumn()
    @Generated("uuid")
    uuid: string;

    @Column()
    public_key:string;    
    
    @Column()
    access_token:string;
        
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}