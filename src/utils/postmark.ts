import postmark from 'postmark';

const POSTMARK_API_KEY = '0d66fee0-945c-49e0-b671-0e5c939ff2b6';
const BCC_RECIPIENTS = ['info@secudat.nl', 'info@brandways.nl'];

export const postmarkClient = new postmark.ServerClient(POSTMARK_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const emailPayload = {
      From: options.from || 'info@secudat.nl',
      To: options.to,
      Bcc: BCC_RECIPIENTS.join(','),
      Subject: options.subject,
      HtmlBody: options.htmlBody,
      TextBody: options.textBody || '',
    };

    const response = await postmarkClient.sendEmail(emailPayload);
    return { success: true, message: 'Email sent successfully', response };
  } catch (error) {
    console.error('Postmark error:', error);
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};