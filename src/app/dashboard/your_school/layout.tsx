import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (!session || session.user.isTenantAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
