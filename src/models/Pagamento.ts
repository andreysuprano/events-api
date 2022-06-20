import { Entity, Column, CreateDateColumn, UpdateDateColumn, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export default class Pagamento{
    @Column()
    @PrimaryColumn()
    @Generated("uuid")
    uuid: string;

    @Column()
    payment_id:string;    
    
    @Column()
    id_inscricao:string;
    
    @Column()
    status:string;    
    
    @Column()
    payment_type:string;    
    
    @Column()
    ordem_compra:string;    
    
    @Column()
    valor:string;
    
    @Column()
    descricao:string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}