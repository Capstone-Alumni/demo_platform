import { prisma } from '@lib/prisma/prisma';
import { redirect } from 'next/navigation';
import TenantDetailPage from 'src/modules/tenants/components/TenantDetailPage';

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
            isOwner: true,
          },
          select: {
            id: true,
            accountEmail: true,
          },
        },
      },
    });
    console.log(data);
    if (!data || data.archived) {
      throw new Error('cannot fetch tenant data');
    }
    // if (!data.activated) {
    //   throw new Error('tenant is not activated');
    // }

    return (
      <TenantDetailPage
        initialData={{
          id: data.id,
          name: data.name,
          subdomain: data.subdomain,
          description: data.description,
          logo: data.logo,
          background1: data.background1,
          background2: data.background2,
          background3: data.background3,
          createdAt: data.createdAt.toString(),
          subscriptionEndTime: data.subscriptionEndTime?.toString(),
          alumni: data.alumni,
          theme: data.theme || undefined,
          provinceCodename: data.provinceCodename || '',
          provinceName: data.provinceName || '',
          cityCodename: data.cityCodename || '',
          cityName: data.cityName || '',
          plan: data?.plan,
          planId: data.planId || '',
          address: data.address || '',
          requestStatus: data.requestStatus,
          evidenceUrl: data.evidenceUrl || '',
        }}
      />
    );
  } catch {
    return redirect('404_error');
  }
}
