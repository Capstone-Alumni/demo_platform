import Body from '@share/components/layout/Body';
import Link from 'next/link';

export default async function Page() {
  return (
    <Body>
      <p>Landing page of platform</p>
      <Link href="/register_tenant">register for tenant</Link>
      <br />
      <Link href="/login">Login</Link>
    </Body>
  );
}
