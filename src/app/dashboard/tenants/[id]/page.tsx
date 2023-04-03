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
        plan: true,
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
    // if (!data.activated) {
    //   throw new Error('tenant is not activated');
    // }

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
          subcriptionEndTime: data.subcriptionEndTime?.toString(),
          alumni: data.alumni,
          theme: data.theme || undefined,
          provinceCodename: data.provinceCodename || '',
          provinceName: data.provinceName || '',
          cityCodename: data.cityCodename || '',
          cityName: data.cityName || '',
          plan: data?.plan,
          planId: data.planId || '',
          address: data.address || '',
          approved: data.approved,
        }}
      />
    );
  } catch {
    return redirect('404_error');
  }
}
