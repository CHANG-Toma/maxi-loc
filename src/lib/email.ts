import nodemailer from 'nodemailer';

// Configuration de l'envoi d'emails avec nodemailer

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

// Fonction pour envoyer un email
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Envoyer l'email avec les informations fournies
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log('Email envoyé:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l&apos;envoi de l&apos;email:', error);
    throw new Error('Erreur lors de l&apos;envoi de l&apos;email');
  }
} 