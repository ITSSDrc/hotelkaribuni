
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import ReservationRequestEmail from '@/components/emails/reservation-request-email';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.RESERVATION_EMAIL_TO;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';


const sendRequestSchema = z.object({
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  guests: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  roomId: z.string().optional(),
});

export async function POST(request: Request) {
  if (!toEmail || !process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY or RESERVATION_EMAIL_TO is not defined in environment variables.');
    return NextResponse.json({ error: 'Erreur de configuration du serveur. Le service de messagerie n\'est pas correctement configuré.' }, { status: 500 });
  }

  const body = await request.json();
  const parsed = sendRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { dateRange, guests, phone, email, roomId } = parsed.data;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Nouvelle demande de réservation - ${new Date(dateRange.from).toLocaleDateString()}`,
      react: ReservationRequestEmail({
        dateFrom: new Date(dateRange.from),
        dateTo: new Date(dateRange.to),
        guests,
        phone,
        email,
        roomId,
      }),
      text: `Nouvelle demande de réservation reçue.
      Arrivée: ${new Date(dateRange.from).toLocaleDateString()}
      Départ: ${new Date(dateRange.to).toLocaleDateString()}
      Hôtes: ${guests}
      Téléphone: ${phone}
      Email: ${email || 'Non fourni'}
      Chambre demandée: ${roomId || 'Non spécifiée'}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Échec de l\'envoi de l\'e-mail via le fournisseur de services.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Une erreur inattendue est survenue lors de l\'envoi de l\'e-mail.' }, { status: 500 });
  }
}
