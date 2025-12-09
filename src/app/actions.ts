'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export type FormState = {
  success: boolean;
  message: string;
};

// Generic action to simulate sending an email.
// In a real-world scenario, you would integrate a service like Resend, SendGrid, or Nodemailer here.
export async function sendEmailAction(
  formType: 'Contact' | 'Reservation' | 'Quote',
  formData: unknown
): Promise<FormState> {
  
  // For demonstration, we'll just log the data to the server console.
  console.log('--- NEW FORM SUBMISSION ---');
  console.log(`Form Type: ${formType}`);
  console.log('Received Data:', formData);
  console.log('---------------------------');
  
  // Here, you would add your email sending logic.
  // Example with a fake email service:
  /*
  try {
    const emailData = {
      from: 'onboarding@resend.dev',
      to: 'contact@karibuni-bunia.com',
      subject: `Nouvelle demande de ${formType}`,
      html: `<pre>${JSON.stringify(formData, null, 2)}</pre>`,
    };
    await resend.emails.send(emailData);
    
    revalidatePath('/'); // Optional: revalidate paths if needed
    return { success: true, message: 'Votre message a été envoyé avec succès.' };

  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: "L'envoi a échoué. Veuillez réessayer." };
  }
  */

  // Simulating a successful submission.
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (formType === 'Reservation') {
      return { success: true, message: 'Demande de réservation envoyée.' };
  }

  return { success: true, message: 'Votre message a été envoyé avec succès.' };
}
