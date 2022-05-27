import { Entity, Column, CreateDateColumn,UpdateDateColumn, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import Evento from './Evento';

@Entity()
export default class Questao{
    @Column()
    @Generated("uuid")
    @PrimaryColumn()
    uuid: string;
    
    @Column()
    pergunta:string;    
    
    @Column()
    tipo_resposta:string;    
        
    @CreateDateColumn({select:false})
    created_at: Date;

    @UpdateDateColumn({select:false})
    updated_at: Date;

    @ManyToOne(()=> Evento, (evento)=>evento.questoes)
    evento:Evento;
}