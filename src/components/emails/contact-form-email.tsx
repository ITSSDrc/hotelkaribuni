
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

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

const ContactFormEmail: React.FC<ContactFormEmailProps> = ({
  name,
  email,
  message,
}) => (
  <Html>
    <Head />
    <Preview>Nouveau message de {name} via le site Karibuni</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nouveau Message de Contact</Heading>
        <Text style={paragraph}>Vous avez reçu un nouveau message depuis le formulaire de contact du site de l'Hôtel Karibuni.</Text>
        <Hr style={hr} />
        <Section style={section}>
          <Text style={label}>De :</Text>
          <Text style={value}>{name}</Text>
        </Section>
        <Section style={section}>
          <Text style={label}>Email de réponse :</Text>
          <Text style={value}>{email}</Text>
        </Section>
        <Hr style={hr} />
        <Heading style={{...heading, fontSize: '20px', marginTop: '20px' }}>Message</Heading>
        <Text style={messageText}>
          {message}
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Cet e-mail a été envoyé automatiquement depuis le site de l'Hôtel Karibuni.</Text>
      </Container>
    </Body>
  </Html>
);

export default ContactFormEmail;

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

const messageText = {
  ...paragraph,
  padding: '0 40px',
  whiteSpace: 'pre-wrap' as const,
}

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
