
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import ContactFormEmail from '@/components/emails/contact-form-email';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.CONTACT_EMAIL_TO;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';


const sendRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  subject: z.string().optional(),
});

export async function POST(request: Request) {
  if (!toEmail || !process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY or CONTACT_EMAIL_TO is not defined in environment variables.');
    return NextResponse.json({ error: 'Erreur de configuration du serveur. Le service de messagerie n\'est pas correctement configuré.' }, { status: 500 });
  }

  const body = await request.json();
  const parsed = sendRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { name, email, message, subject } = parsed.data;
  const emailSubject = subject || `Nouveau message de contact de ${name}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: emailSubject,
      react: ContactFormEmail({
        name,
        email,
        message,
        subject: emailSubject,
      }),
      text: `${emailSubject}\n\nNouveau message de ${name} (${email}):\n\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: { message: 'Échec de l\'envoi de l\'e-mail via le fournisseur de services.' } }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: { message: 'Une erreur inattendue est survenue lors de l\'envoi de l\'e-mail.' } }, { status: 500 });
  }
}
