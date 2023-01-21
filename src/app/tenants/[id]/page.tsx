import EditTenantPage from 'src/modules/tenants/components/EditTenantPage';
import TenantService from 'src/modules/tenants/services/tenant.service';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const data = await TenantService.getById(id);
    if (!data) {
      throw new Error('cannot fetch tenant data');
    }

    return <EditTenantPage initialData={data} />;
  } catch {
    return null;
  }
}
