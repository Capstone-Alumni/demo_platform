import useApi from 'src/modules/share/hooks/useApi';
import { TenantFormValues } from '../components/TenantForm';
import { toast } from 'react-toastify';

const useCreateTenant = () => {
  const { fetchApi, isLoading } = useApi(
    'createTenant',
    (values: TenantFormValues) => ({
      method: 'POST',
      url: '/api/tenants',
      data: values,
    }),
    {
      onError: () => {
        toast.error('Tạo khách hành thất bại');
      },
      onSuccess: () => {
        toast.success('Tạo khách hàng thành công');
      },
    },
  );

  return {
    isLoading,
    createTenant: fetchApi,
  };
};

export default useCreateTenant;
