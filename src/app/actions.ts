'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export type FormState = {
  success: boolean;
  message: string;
};

// Initialisez Resend avec votre clé API depuis les variables d'environnement
const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse email où vous recevrez les soumissions.
// Remplacez-la par votre véritable adresse email.
const TO_EMAIL = 'votre-email@example.com';

// Adresse email d'envoi. Doit appartenir à un domaine vérifié sur Resend.
// Par exemple, si votre site est karibuni-bunia.com, vous pourriez utiliser "noreply@karibuni-bunia.com"
const FROM_EMAIL = 'onboarding@resend.dev';

/**
 * Génère un corps de texte simple à partir des données du formulaire.
 */
function formatFormData(formData: unknown): string {
    if (typeof formData !== 'object' || formData === null) {
        return 'Données invalides.';
    }
    return Object.entries(formData)
        .map(([key, value]) => {
            let formattedValue = value;
            if (value instanceof Date) {
                formattedValue = value.toLocaleDateString('fr-FR');
            } else if (typeof value === 'object' && value !== null) {
                formattedValue = JSON.stringify(value, null, 2);
            }
            return `${key}: ${formattedValue}`;
        })
        .join('\n');
}

/**
 * Envoie un email en utilisant Resend.
 */
export async function sendEmailAction(
  formType: 'Contact' | 'Reservation' | 'Quote',
  formData: unknown
): Promise<FormState> {

  console.log('Nouvelle soumission de formulaire reçue :', { formType, formData });

  // Vérifiez si la clé API Resend est configurée
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'REMPLACEZ_PAR_VOTRE_CLE_API_RESEND') {
    console.warn("--- Clé API Resend non configurée. L'envoi d'e-mail est simulé. ---");
    console.warn("Pour activer l'envoi, configurez RESEND_API_KEY dans le fichier .env");
    
    // Simuler un succès pour que l'interface utilisateur fonctionne.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      success: true, 
      message: "Votre demande a été reçue et sera traitée prochainement (simulation)." 
    };
  }

  try {
    const subject = `Nouvelle demande de ${formType} - Hôtel Karibuni`;
    const textBody = `
Une nouvelle demande de formulaire a été soumise sur votre site web.

Type de formulaire: ${formType}

Détails de la demande:
----------------------
${formatFormData(formData)}
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: subject,
      text: textBody, // Envoyez le corps du message en texte brut
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return { success: false, message: "L'envoi a échoué. Veuillez réessayer." };
    }

    console.log('Email envoyé avec succès:', data);
    revalidatePath('/');
    return { success: true, message: 'Votre message a été envoyé avec succès.' };

  } catch (error) {
    console.error("Erreur inattendue lors de l'envoi de l'email:", error);
    return { success: false, message: "Une erreur inattendue est survenue." };
  }
}