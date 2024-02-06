const route = require('express').Router();

const { sendTestingMail, sendGmail } = require("../controllers/mailController");

route.post('/send', sendTestingMail);
route.post('/sendgmail', sendGmail);

module.exports = route;