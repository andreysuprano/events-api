import { Entity, Column, CreateDateColumn,UpdateDateColumn, Generated, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import Inscricao from './Inscricao';

@Entity()
export default class Resposta{
    @Column()
    @Generated("uuid")
    
    @PrimaryColumn()
    uuid: string;
    
    @Column()
    pergunta:string;   
    
    @Column()
    resposta:string;    
    
    @CreateDateColumn({select:false})
    created_at: Date;
    
    @UpdateDateColumn({select:false})
    updated_at: Date;

    @ManyToOne(() => Inscricao, (inscricao)=>{inscricao.respostas})
    inscricao:Inscricao;
}