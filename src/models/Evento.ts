import { Entity, Column, CreateDateColumn,UpdateDateColumn, Generated, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Inscricao from './Inscricao';
import Questao from './Questao';
import Usuario from './Usuario';

@Entity()
export default class Evento{
    @Column()
    @Generated("uuid")
    @PrimaryColumn()
    uuid: string;
    
    @Column()
    nome:string;    
    
    @Column()
    descricao:string;    
    
    @Column()
    vagas:number;    
    
    @Column()
    valor:number;
    
    @Column()
    slug:string;

    @Column()
    status:string;

    @CreateDateColumn({select:false})
    created_at: Date;

    @UpdateDateColumn({select:false})
    updated_at: Date;

    @ManyToOne(() => Usuario, (usuario)=> usuario.eventos)
    usuario: Usuario

    @OneToMany(() => Inscricao, (inscricao)=>inscricao.evento)
    inscricoes:Inscricao[]

    @OneToMany(() => Questao, (questao) => questao.evento)
    questoes:Questao[]
}