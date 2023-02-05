import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';
import { EditTenantFormValues } from '../components/EditTenantForm';

type UpdateTenantByIdDataParams = {
  id: string;
} & EditTenantFormValues;

type UpdateTenantByIdDataResponse = unknown;

type UpdateTenantByIdDataError = AxiosError;

const useUpdateTenantById = () => {
  const router = useRouter();

  const { fetchApi, isLoading } = useApi<
    UpdateTenantByIdDataParams,
    UpdateTenantByIdDataResponse,
    UpdateTenantByIdDataError
  >(
    'updateTenantById',
    ({ id, ...values }) => ({
      method: 'PUT',
      url: `/api/tenants/${id}`,
      data: values,
    }),
    {
      onError: ({ response }: AxiosError) => {
        if (response?.status === 400) {
          toast.error('Subdomain đã tồn tại');
        } else if (response?.status === 403) {
          toast.error('Không được cập nhập subdomain');
        } else {
          toast.error('Cập nhập thất bại');
        }
      },
      onSuccess: () => {
        toast.success('Cập nhập thành công');
        // router.push('/dashboard/tenants');
      },
    },
  );

  return {
    isLoading,
    updateTenantById: fetchApi,
  };
};

export default useUpdateTenantById;
