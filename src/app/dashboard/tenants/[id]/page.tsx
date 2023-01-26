import { prisma } from '@lib/prisma/prisma';
import EditTenantPage from 'src/modules/tenants/components/EditTenantPage';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });
    if (!data || data.archived) {
      throw new Error('cannot fetch tenant data');
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
        }}
      />
    );
  } catch {
    return null;
  }
}
