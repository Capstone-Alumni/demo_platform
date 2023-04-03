import useApi from '@share/hooks/useApi';

type SendEmailParams = {
  to: string;
  subject?: string | 'no-reply';
  text: string;
};

type SendEmailResponse = unknown;

type SendEmailError = unknown;

const useSendEmail = () => {
  const { fetchApi, isLoading } = useApi<
    SendEmailParams,
    SendEmailResponse,
    SendEmailError
  >('sendEmail', ({ to, subject, text }) => ({
    method: 'POST',
    url: '/mailHost/mail/send-email',
    body: {
      to,
      subject,
      text,
    },
  }));

  return {
    isLoading,
    fetchApi,
  };
};

export default useSendEmail;
