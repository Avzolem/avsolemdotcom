// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import notifications from "@/lib/bulker";

export default async function handler(req, res) {
    const { to, message } = req.body;

    //todo: validate to and message

    const waData = {
        to: to,
        template: "notificacionesdgv",
        locale: "es_MX",
        components: [
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
}
