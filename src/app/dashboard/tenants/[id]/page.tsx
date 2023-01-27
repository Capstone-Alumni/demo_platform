import { prisma } from '@lib/prisma/prisma';
import { redirect } from 'next/navigation';
import EditTenantPage from 'src/modules/tenants/components/EditTenantPage';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
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
      <EditTenantPage
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
          theme: data.theme,
        }}
      />
    );
  } catch {
    return redirect('404_error');
  }
}
