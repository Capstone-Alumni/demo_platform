import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type ApproveTenantByIdDataParams = {
  id: string;
};

type ApproveTenantByIdDataResponse = unknown;

type ApproveTenantByIdDataError = AxiosError;

const useApproveTenantById = () => {
  const router = useRouter();

  const { fetchApi, isLoading } = useApi<
    ApproveTenantByIdDataParams,
    ApproveTenantByIdDataResponse,
    ApproveTenantByIdDataError
  >(
    'ApproveTenantById',
    ({ id }) => ({
      method: 'PUT',
      url: `/api/tenants/${id}/approve`,
    }),
    {
      onError: ({ response }: AxiosError) => {
        if (response?.status === 400) {
          toast.error('Subdomain đã tồn tại');
        } else if (response?.status === 403) {
          toast.error('Không được cập nhập subdomain');
        } else {
          toast.error('Xảy ra lỗi, vui lòng thử lại');
        }
      },
      onSuccess: () => {
        router.refresh();
      },
    },
  );

  return {
    isLoading,
    approveTenantById: fetchApi,
  };
};

export default useApproveTenantById;
