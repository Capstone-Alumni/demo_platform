import useApi from 'src/modules/share/hooks/useApi';
import { TenantFormValues } from '../components/TenantForm';

type UpdateTenantByIdDataParams = {
  id: string;
} & TenantFormValues;

type UpdateTenantByIdDataResponse = unknown;

type UpdateTenantByIdDataError = unknown;

const useUpdateTenantById = () => {
  const { fetchApi, isLoading } = useApi<
    UpdateTenantByIdDataParams,
    UpdateTenantByIdDataResponse,
    UpdateTenantByIdDataError
  >('updateTenantById', ({ id, ...values }) => ({
    method: 'PUT',
    url: `/api/tenants/${id}`,
    data: values,
  }));

  return {
    isLoading,
    updateTenantById: fetchApi,
  };
};

export default useUpdateTenantById;
