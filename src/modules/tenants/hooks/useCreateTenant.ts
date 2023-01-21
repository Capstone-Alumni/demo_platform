import useApi from 'src/modules/share/hooks/useApi';
import { TenantFormValues } from '../components/TenantForm';

const useCreateTenant = () => {
  const { fetchApi, isLoading } = useApi(
    'createTenant',
    (values: TenantFormValues) => ({
      method: 'POST',
      url: '/api/tenants',
      data: values,
    }),
  );

  return {
    isLoading,
    createTenant: fetchApi,
  };
};

export default useCreateTenant;
