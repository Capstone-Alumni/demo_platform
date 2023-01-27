import { prisma } from '@lib/prisma/prisma';
import { unstable_getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import MemberListPage from 'src/modules/members/components/MemberListPage';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';

export default async function Page() {
  const session = await unstable_getServerSession(nextAuthOptions);

  if (!session || session.user.isTenantAdmin) {
    redirect('/');
  }

  const id = session.user.tenant.id;
  try {
    const data = await prisma.tenant.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        archived: true,
        activated: true,
      },
    });
    if (!data || data.archived) {
      throw new Error('cannot fetch tenant data');
    }
    if (!data.activated) {
      throw new Error('tenant is not activated');
    }

    return <MemberListPage tenantId={data.id} />;
  } catch {
    return redirect('404_error');
  }
}