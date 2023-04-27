import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type DeleteTenantByIdDataParams = {
  id: string;
};

type DeleteTenantByIdDataResponse = unknown;

type DeleteTenantByIdDataError = unknown;

const useDeleteTenantById = () => {
  const { fetchApi, isLoading } = useApi<
    DeleteTenantByIdDataParams,
    DeleteTenantByIdDataResponse,
    DeleteTenantByIdDataError
  >(
    'deleteTenantById',
    ({ id }) => ({
      method: 'DELETE',
      url: `/api/tenants/${id}`,
    }),
    {
      onError: () => {
        toast.error('Xoá khách hành thất bại');
      },
      onSuccess: () => {
        toast.success('Xoá khách hàng thành công');
      },
    },
  );

  return {
    isLoading,
    deleteTenantById: fetchApi,
  };
};

export default useDeleteTenantById;
