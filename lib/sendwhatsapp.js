import notifications from "@/lib/bulker";

export default async function sendwhatsapp(to, message) {
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
    return await notifications.sendWhatsappTemplate(waData);
}
