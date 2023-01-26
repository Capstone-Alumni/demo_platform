import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type DeactivateTenantByIdDataParams = {
  id: string;
};

type DeactivateTenantByIdDataResponse = unknown;

type DeactivateTenantByIdDataError = AxiosError;

const useDeactivateTenantById = () => {
  const { fetchApi, isLoading } = useApi<
    DeactivateTenantByIdDataParams,
    DeactivateTenantByIdDataResponse,
    DeactivateTenantByIdDataError
  >(
    'deactivateTenantById',
    ({ id }) => ({
      method: 'PUT',
      url: `/api/tenants/${id}/deactivate`,
    }),
    {
      onError: () => {
        toast.error('Huỷ kích hoạt thất bại');
      },
    },
  );

  return {
    isLoading,
    deactivateTenantById: fetchApi,
  };
};

export default useDeactivateTenantById;
