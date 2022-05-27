import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Evento from '../models/Evento';
import Questao from '../models/Questao';

type QuestaoRequest = {
    pergunta:string,
    tipoResposta:string
}

export const novaQuestao = async (request: Request, response: Response) => {
    const perguntas = request.body;
    const eventUuid = request.params.event;
    const evento = await getRepository(Evento).findOne({ where: { uuid : eventUuid } });
    if(evento){
        perguntas.map((item:QuestaoRequest)=>{
            const questao = new Questao();
            questao.evento = evento
            questao.pergunta = item.pergunta,
            questao.tipo_resposta = item.tipoResposta
            getRepository(Questao).save(questao)
        });
        response.sendStatus(201);
    }else{
        response.status(400).send({message:'Evento não encontrado'});
    }
}