import nodemailer from 'nodemailer';
import { validateEmail } from '../helpers/validateEmail';
import { MyError } from '../models/my-error.model';

export function mailer(to: string, subject: string, html: any) {
    return new Promise((resolve, reject) => {

        if (validateEmail(to) === false) return reject(new MyError('WRONG_EMAIL_FORMAT', 404));
        if (!subject) return reject(new MyError('SUBJECT_MUST_BE_PROVIDED', 404));
        if (!html) return reject(new MyError('HTML_MUST_BE_PROVIDED', 404));

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'huuthong.mgd@gmail.com', // generated ethereal user
                pass: 'nkdzbqagxcqznacq' // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Gogi" <huuthong.mgd@gmail.com>', // sender address
            to: to, // list of receivers
            subject, // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return reject(new MyError(error.message, 404));
            resolve(info);
        });

    });
}