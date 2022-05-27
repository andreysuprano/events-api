import { Request, Response } from 'express';
import Evento from '../models/Evento';
import {v4 as uuidv4} from 'uuid';
import { getRepository } from 'typeorm';
import Usuario from '../models/Usuario';

export const novoEvento = async (request: Request, response: Response) =>{
    const {
        nome,
        descricao,
        vagas,
        valor
    } = request.body;

    if(!nome || !descricao || !vagas || !valor)
        return response.status(400).send({message:'Todos os campos são obrigatórios'});

    const usuario = await getRepository<Usuario>(Usuario).findOne({where:{uuid:request.params.uuid}});

    const evento = new Evento();

    evento.nome = nome;
    evento.descricao = descricao;
    evento.vagas = vagas;
    evento.valor = valor;
    evento.slug = uuidv4();
    evento.status = 'ativo';
    if(usuario)
        evento.usuario = usuario;

    const eventoPersistido = await getRepository(Evento).save(evento);

    if(eventoPersistido)
        return response.status(201).send();
    
}   


export const pegarEventos = async (request: Request, response: Response) =>{
    const usuario = await getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.eventos", "evento")
        .where({uuid:request.params.uuid})
        .getOne();
    
    if(usuario)
        return response.status(200).send(usuario.eventos);
    response.status(400).send({message:'Nenhum evento encontrado!'});
}  