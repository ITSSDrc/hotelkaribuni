import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationRequestEmailProps {
  dateFrom: Date;
  dateTo: Date;
  guests: string;
  phone: string;
  email?: string;
}

const ReservationRequestEmail: React.FC<ReservationRequestEmailProps> = ({
  dateFrom,
  dateTo,
  guests,
  phone,
  email,
}) => (
  <Html>
    <Head />
    <Preview>Nouvelle demande de réservation pour l'Hôtel Karibuni</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nouvelle Demande de Réservation</Heading>
        <Text style={paragraph}>Une nouvelle demande de réservation a été soumise sur le site web.</Text>
        <Hr style={hr} />
        <Section style={section}>
          <Text style={label}>Période du séjour :</Text>
          <Text style={value}>
            Du{' '}
            <strong>{format(dateFrom, 'eeee dd MMMM yyyy', { locale: fr })}</strong>
            {' '}au{' '}
            <strong>{format(dateTo, 'eeee dd MMMM yyyy', { locale: fr })}</strong>
          </Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Nombre de personnes :</Text>
          <Text style={value}>
            <strong>{guests}</strong>
          </Text>
        </Section>
        <Hr style={hr} />
        <Heading style={{...heading, fontSize: '20px', marginTop: '30px' }}>Coordonnées du client</Heading>
         <Section style={section}>
          <Text style={label}>Numéro de téléphone :</Text>
          <Text style={value}>
            <strong>{phone}</strong>
          </Text>
        </Section>
         <Section style={section}>
          <Text style={label}>Adresse e-mail :</Text>
          <Text style={value}>
            <strong>{email || 'Non fournie'}</strong>
          </Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>Cet e-mail a été envoyé automatiquement depuis le site de l'Hôtel Karibuni.</Text>
      </Container>
    </Body>
  </Html>
);

export default ReservationRequestEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#484848',
  padding: '0 40px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#525f7f',
  padding: '0 40px',
};

const section = {
    padding: '0 40px',
};

const label = {
    fontSize: '14px',
    color: '#525f7f',
    marginBottom: '4px',
};

const value = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#484848',
    marginTop: '0px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
