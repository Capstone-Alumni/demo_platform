import { unstable_getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import RegisterTenantPage from 'src/modules/sessions/components/RegisterTenantPage';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';

const Page = async () => {
  const session = await unstable_getServerSession(nextAuthOptions);
  if (session) {
    redirect('/');
  }

  return <RegisterTenantPage />;
};

export default Page;
