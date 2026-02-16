const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const BCC_RECIPIENTS = ['info@secudat.nl', 'info@brandways.nl'];

export interface EmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'info@secudat.nl',
        to: options.to,
        bcc: BCC_RECIPIENTS.join(','),
        subject: options.subject,
        html: options.htmlBody,
        text: options.textBody || '',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error };
    }

    const data = await response.json();
    return { success: true, message: 'Email sent successfully', response: data };
  } catch (error) {
    console.error('Resend error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};