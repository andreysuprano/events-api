import mercadopago from "mercadopago";
import { CreatePreferencePayload } from "mercadopago/models/preferences/create-payload.model";
import { Identification } from "mercadopago/shared/payer-identification";
import { getRepository } from "typeorm";
import Evento from "../../models/Evento";
import Inscricao from "../../models/Inscricao";
import Usuario from "../../models/Usuario";

export const GerarPagamento = async (inscrito:Inscricao, evento:Evento) => {

    const event = await getRepository(Evento)
        .createQueryBuilder("evento")
        .leftJoinAndSelect("evento.usuario", "usuario")
        .where("evento.uuid = :uuid", {uuid:evento.uuid})
        .getOne();

    const user = await getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.configuracao", "configuracao")
        .where("usuario.uuid = :uuid", {uuid:event?.usuario.uuid})
        .getOne();

    if(user)
    mercadopago.configure({
        access_token: user?.configuracao?.access_token
    });

    const identificacao:Identification ={
        type:'CPF',
        number:inscrito.cpf
    } 

    const preference:CreatePreferencePayload = {
        items:[{
            id:inscrito.uuid,
            title:evento.nome,
            quantity:1,
            unit_price:evento.valor,
            description:evento.descricao
        }],
        payer:{
            name:inscrito.nome,
            email:inscrito.email,
            identification:identificacao
        },
        back_urls:{
            failure:`http://https://events.adcampolargo.com/payment/${inscrito.uuid}/feedback/`,
            success:`http://https://events.adcampolargo.com/payment/${inscrito.uuid}/feedback/`,
            pending:`http://https://events.adcampolargo.com/payment/${inscrito.uuid}/feedback/`            
        }
    }
    const preferenceResponse = await mercadopago.preferences.create(preference);
    return preferenceResponse.body.id;
}
