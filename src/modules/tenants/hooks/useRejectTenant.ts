import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type RejectTenantByIdDataParams = {
  id: string;
};

type RejectTenantByIdDataResponse = unknown;

type RejectTenantByIdDataError = AxiosError;

const useRejectTenantById = () => {
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
    },
  );

  return {
    isLoading,
    rejectTenantById: fetchApi,
  };
};

export default useRejectTenantById;
