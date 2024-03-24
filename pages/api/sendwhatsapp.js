// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import notifications from "@/lib/bulker";

export default async function handler(req, res) {
    try {
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
                                link: "https://www.avsolem.com/images/anuncio1.png",
                            },
                        },
                    ],
                },
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: message,
                        },
                    ],
                },
            ],
        };
        const response = await notifications.sendWhatsappTemplate(waData);

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error });
    }
}
