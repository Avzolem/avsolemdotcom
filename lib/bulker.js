import { createBot } from "whatsapp-cloud-api";
const TOKEN = process.env.WHATSAPP_TOKEN;
const FROM = process.env.WHATSAPP_FROM;

const sendWhatsappTemplate = async ({ to, template, locale, components }) => {
    //check that the user is a valid user
    try {
        if (!to || !template || !locale || !components) {
            throw new Error(
                "Missing params, need to specify an object with to, template, locale and components"
            );
        }

        const bot = createBot(FROM, TOKEN);
        const response = await bot.sendTemplate(
            to,
            template,
            locale,
            components
        );
        console.log("WA Message Sent =>", response);
        return response;
    } catch (error) {
        console.log("Error sending WA message =>", error);
        return error;
    }
};

// TODO, move api route for sendingmails to here
const notifications = {
    sendWhatsappTemplate,
};

export default notifications;
