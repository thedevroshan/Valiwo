import nodemailer from 'nodemailer';

export const Transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_EMAIL as string,
    pass: process.env.MAILER_PASSWORD as string,
  },
});