import { Entity, Column, CreateDateColumn,UpdateDateColumn, Generated, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';
import Evento from './Evento';
import Pagamento from './Pagamento';
import Resposta from './Resposta';

@Entity()
export default class Inscricao{
    @Column()
    @Generated("uuid")
    @PrimaryColumn()
    uuid: string;

    @Column()
    nome:string;
    
    @Column()
    telefone:string;    
    
    @Column()
    cpf:string;    
    
    @Column()
    email:string;    
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({select:false})
    updated_at: Date;

    @ManyToOne(()=> Evento, (evento)=> evento.inscricoes)
    evento:Evento;

    @OneToMany(() => Resposta, (resposta)=>{resposta.inscricao})
    respostas: Resposta[];

    @OneToOne(()=>Pagamento)
    @JoinColumn()
    pagamento:Pagamento;
}