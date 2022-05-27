import mercadopago from "mercadopago";
import { CreatePreferencePayload } from "mercadopago/models/preferences/create-payload.model";
import { Identification } from "mercadopago/shared/payer-identification";
import Evento from "../../models/Evento";
import Inscricao from "../../models/Inscricao";

export const GerarPagamento = async (inscrito:Inscricao, evento:Evento) => {
    mercadopago.configure({
        access_token: 'TEST-8990299850686526-092619-02ec8fcb2801e4c4f302560d829e1ada-201829909'
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
            failure:`https://eventos.adcampolargo.com/${evento.slug}/feedback/`
        }
    }
    const preferenceResponse = await mercadopago.preferences.create(preference);
    return preferenceResponse.body.id;
}
