import Body from '@share/components/layout/Body';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (session) {
    redirect('/dashboard/tenants');
  }

  return (
    <Body>
      <p>Landing page of platform</p>
      <Link href="/register_tenant">register for tenant</Link>
      <br />
      <Link href="/login">Login</Link>
    </Body>
  );
}
