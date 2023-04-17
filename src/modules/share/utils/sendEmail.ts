import axios from 'axios';

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
) => {
  await axios.post(`${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`, {
    to,
    subject,
    text,
    html,
  });
};

export default sendEmail;
