import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

/**
 *
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
 */
export const sendEmail = async (options) => {
    // Initialize mailgen instance with default theme and brand configuration
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "UK Sponsor License Checker",
            link: "https://www.google.com/",
        },
    });

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

    // Generate an HTML email with the provided contents
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    // Create a nodemailer transporter instance which is responsible to send a mail
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORT,
        // service: "Gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });

    const mail = {
        from: "notification@breezeconsult.org",
        // from: "notifications@compliance-360.org",
        to: "nichebusiness111@gmail.com",   
        subject: options.subject,
        text: emailTextual,
        html: emailHtml,
    };

    try {
        const res = await transporter.sendMail(mail);
        console.log(res);
    } catch (error) {
        console.log(
            "Email service failed silently. Make sure you have provided your credentials in the .env file"
        );
        console.log("Error: ", error);
    }
};


export const contactFormMailgenContent = (userDetails) => {
    return {
        body: {
            name: 'Admin',
            intro: `You have received a new contact request details from ${userDetails.name}.`,
            table: {
                data: [
                    {
                        key: 'Name:',
                        value: userDetails.name,
                    },
                    {
                        key: 'Email:',
                        value: userDetails.email,
                    },
                    {
                        key: 'Contact Information:',
                        value: userDetails.contactInfo,
                    },
                    {
                        key: 'Short Info:',
                        value: userDetails.shortInfo,
                    },
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        key: '20%',
                        value: '80%',
                    },
                    // Optionally, change column alignment
                    customAlignment: {
                        key: 'left',
                        value: 'left',
                    },
                },
            },
        },
    };
};