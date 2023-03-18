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
        alumni: {
          where: {
            accessLevel: 'SCHOOL_ADMIN',
          },
          include: {
            account: {
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
          background1: data.background1,
          background2: data.background2,
          background3: data.background3,
          createdAt: data.createdAt.toString(),
          activated: data.activated,
          alumni: data.alumni,
          theme: data.theme || undefined,
        }}
      />
    );
  } catch {
    return redirect('404_error');
  }
}
