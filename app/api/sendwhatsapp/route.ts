import { NextRequest, NextResponse } from 'next/server';
import notifications from "@/lib/bulker";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, message } = body;

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

        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}