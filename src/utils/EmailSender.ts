import {createTransport, Transporter} from 'nodemailer'

class EmailSender {
    
    transporter: Transporter

    constructor(){
        const config = {
            host : 'mail.adcampolargo.com', 
            port : 587,
            auth:{
                user : 'eventos@adcampolargo.com',
                pass : 'evt123!@#', 
            },
            tls: { 
                rejectUnauthorized: false 
            } 
        }
        this.transporter = createTransport(config)
    }

    sendMail(emailRecebedor:string, assunto:string, conteudo:string){
        this.transporter.sendMail({
            from:'"ADCL Eventos" eventos@adcampolargo.com',
            to:emailRecebedor,
            subject:assunto,
            text:conteudo
        }, (error)=>{
            console.log(error);
        });
    }

}

export const emailSender = new EmailSender();