// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import notifications from "@/lib/bulker";

export default async function handler(req, res) {
    const { to, message } = req.body;

    //todo: validate to and message

    const waData = {
        to: to,
        template: "mensajesmasivospan",
        locale: "es_MX",
        components: [
            {
                type: "header",
                parameters: [
                    {

                        type: "image",
                        image: {
                            link: "https://www.avsolem.com/images/maracashark.png", 
                          }
                    },
                    
                ],


                
            },
            {type: "body",
                parameters: [
                    {

                        type: "text",
                        text: message,
                    },
                    
                ],}
        ],
    };
    const response = await notifications.sendWhatsappTemplate(waData);

    res.status(200).json({ response });
}
