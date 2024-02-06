require('dotenv').config();
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const {EMAIL, PASSWORD} = require('../env.js');

const sendTestingMail = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    let message = {
        from: '"Fred Foo 👻" <foo@example.com>',
        to: "someone@example.com",
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    };

    transporter.sendMail(message).then((info) => {
        res.status(200).json({
            message: "Mail sent",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Mail not sent"
        });
    });    
}

const sendGmail = async (req, res) => {

    const { userEmail } = req.body;

    if (!userEmail) {
        return res.status(400).json({
            message: "Email not provided"
        });
    }

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Test App',
            link: 'http://localhost:3000/',
        }
    });

    let response = {
        body: {
            name: 'John Doe',
            intro: 'Welcome to Test App! We\'re very excited to have you on board.',
            table: {
                data: [
                    {
                        item: 'Node.js',
                        description: 'Event-driven I/O server-side JavaScript environment based on V8.',
                        price: '$10.99'
                    },
                    {
                        item: 'Nodemailer',
                        description: 'Easy as cake e-mail sending from your Node.js applications',
                        price: '$15.99'
                    }
                ],
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        item: '20%',
                        price: '15%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        price: 'right'
                    }
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "something",
        html: mail
    }

    transporter.sendMail(message).then((info) => {
        res.status(200).json({
            message: "Mail Sent"
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            message: "Mail not sent"
        });
    });
}

module.exports = {
    sendTestingMail,
    sendGmail
}
