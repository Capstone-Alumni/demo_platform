import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';
import { RegisterTenantFormValues } from '../components/RegisterTenantForm';

const useRegisterTenant = () => {
  const router = useRouter();

  const { fetchApi, isLoading } = useApi(
    'registerTenant',
    (values: RegisterTenantFormValues) => ({
      method: 'POST',
      url: '/api/tenants/register',
      data: values,
    }),
    {
      onError: ({ response }: AxiosError) => {
        if (response?.status === 400) {
          toast.error('Tài khoản đã đăng ký');
        } else {
          toast.error('Đăng ký thất bại');
        }
      },
      onSuccess: () => {
        toast.success('Đăng ký thành công');
        router.push('/login');
      },
    },
  );

  return {
    isLoading,
    registerTenant: fetchApi,
  };
};

export default useRegisterTenant;
