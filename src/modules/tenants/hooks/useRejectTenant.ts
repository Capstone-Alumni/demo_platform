import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type RejectTenantByIdDataParams = {
  id: string;
};

type RejectTenantByIdDataResponse = unknown;

type RejectTenantByIdDataError = AxiosError;

const useRejectTenantById = () => {
  const router = useRouter();
  const { fetchApi, isLoading } = useApi<
    RejectTenantByIdDataParams,
    RejectTenantByIdDataResponse,
    RejectTenantByIdDataError
  >(
    'RejectTenantById',
    ({ id }) => ({
      method: 'PUT',
      url: `/api/tenants/${id}/reject`,
    }),
    {
      onError: ({ response }: AxiosError) => {
        toast.error('Xảy ra lỗi, vui lòng thử lại');
      },
      onSuccess: () => {
        toast.success('Đã từ chối yêu cầu');
        router.refresh();
      },
    },
  );

  return {
    isLoading,
    rejectTenantById: fetchApi,
  };
};

export default useRejectTenantById;
