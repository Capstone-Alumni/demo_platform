import Body from '@share/components/layout/Body';
import { unstable_getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LoginPage from 'src/modules/sessions/components/LoginPage';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';

const Page = async () => {
  const session = await unstable_getServerSession(nextAuthOptions);
  if (session) {
    redirect('/');
  }

  return (
    <Body>
      <LoginPage />
    </Body>
  );
};

export default Page;
