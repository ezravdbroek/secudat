import type { APIRoute } from 'astro';
import { sendEmail } from '../../utils/postmark';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const privacy = formData.get('privacy') as string;

    // Validation
    if (!firstName || !lastName || !email || !subject || !message || !privacy) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Alle verplichte velden moeten ingevuld zijn.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Voer een geldig e-mailadres in.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Map subject to readable text
    const subjectMap: { [key: string]: string } = {
      'advies': 'Vrijblijvend advies',
      'offerte': 'Offerte aanvragen',
      'installatie': 'Installatie',
      'onderhoud': 'Onderhoud',
      'support': 'Technische support',
      'anders': 'Anders'
    };

    const subjectText = subjectMap[subject] || subject;

    // Create email content
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #25c1ce; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Secudat Contactformulier</h1>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #25c1ce; padding-bottom: 10px;">Contactgegevens</h2>
          <p><strong>Naam:</strong> ${firstName} ${lastName}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Telefoon:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
          <p><strong>Onderwerp:</strong> ${subjectText}</p>

          <h2 style="color: #2c3e50; margin-top: 30px; border-bottom: 2px solid #25c1ce; padding-bottom: 10px;">Bericht</h2>
          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #25c1ce;">
            <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>Dit bericht is verstuurd via het contactformulier op secudat.nl</p>
            <p>Datum: ${new Date().toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </div>
    `;

    const textBody = `
      Secudat Contactformulier

      Contactgegevens:
      - Naam: ${firstName} ${lastName}
      - E-mail: ${email}
      ${phone ? `- Telefoon: ${phone}` : ''}
      - Onderwerp: ${subjectText}

      Bericht:
      ${message}

      ---
      Dit bericht is verstuurd via het contactformulier op secudat.nl
      Datum: ${new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    `;

    // Send email
    const result = await sendEmail({
      to: 'info@secudat.nl',
      subject: `Contactformulier: ${subjectText} - ${firstName} ${lastName}`,
      htmlBody,
      textBody,
      from: email
    });

    if (result.success) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Uw bericht is succesvol verzonden! Wij nemen binnen 24 uur contact met u op.'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Er is een fout opgetreden bij het versturen van het bericht. Probeer het opnieuw.'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Er is een onverwachte fout opgetreden. Probeer het opnieuw of neem telefonisch contact op.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};