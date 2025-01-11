import { initEmailSender } from "./core/index.js";
const emailProvider = {
    type: "smtp",
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
};
// PUBLIC API
export const emailSender = initEmailSender(emailProvider);
//# sourceMappingURL=index.js.map