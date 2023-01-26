// landing page
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';
import Header from '@share/components/layout/Header';
import Body from '@share/components/layout/BodyWidthSidebar';
import Footer from '@share/components/layout/Footer';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <p>Landing page of platform</p>
      <Link href="/register_tenant">register for tenant</Link>
      <br />
      <Link href="/login">Login</Link>
    </>
  );
}
