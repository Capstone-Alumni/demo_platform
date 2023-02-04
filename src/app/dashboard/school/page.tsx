import { prisma } from '@lib/prisma/prisma';
import { unstable_getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import EditSchoolPage from 'src/modules/tenants/components/EditSchoolPage';
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
      include: {
        members: {
          where: {
            accessLevel: 'SCHOOL_ADMIN',
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!data || data.archived) {
      throw new Error('cannot fetch tenant data');
    }
    if (!data.activated) {
      throw new Error('tenant is not activated');
    }

    return (
      <EditSchoolPage
        initialData={{
          id: data.id,
          name: data.name,
          subdomain: data.subdomain,
          tenantId: data.tenantId,
          description: data.description,
          logo: data.logo,
          createdAt: data.createdAt.toString(),
          activated: data.activated,
          members: data.members,
          theme: data.theme || undefined,
        }}
      />
    );
  } catch {
    return redirect('404_error');
  }
}
