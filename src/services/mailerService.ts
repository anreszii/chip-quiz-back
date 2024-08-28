import nodemailer, { Transporter } from "nodemailer";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

class MailerService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public async sendMail(mailOptions: MailOptions): Promise<unknown> {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      return e;
    }
  }
}

export const mailerService = new MailerService();
