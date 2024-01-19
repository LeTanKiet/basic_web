import { db } from '../models/index.js';
import nodemailer from 'nodemailer';

class SendPinEmail {
  static async sendPinEmail(userId) {
    const user = await db.oneOrNone('SELECT email FROM "users" WHERE id = $1', [userId]);
    if (!user) throw new Error('User not found');

    const pin = Math.floor(100000 + Math.random() * 900000);

    await db.none(
      `INSERT INTO pins (user_id, pin)
      VALUES ($1, $2)
      ON CONFLICT (user_id) 
      DO UPDATE SET pin = EXCLUDED.pin`,
      [userId, pin],
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Basic Web" <noreply@yourservice.com>',
      to: user.email,
      subject: 'Your PIN',
      text: `Your PIN is: ${pin}`,
    });
  }

  static async sendPinEmailByEmail(email) {
    const pin = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Basic Web" <noreply@yourservice.com>',
      to: email,
      subject: 'Your PIN',
      text: `Please enter this pin to active your account: ${pin}`,
    });

    return pin;
  }
}

export default SendPinEmail;
