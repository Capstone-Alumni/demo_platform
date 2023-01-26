import useApi from 'src/modules/share/hooks/useApi';

type ActivateTenantByIdDataParams = {
  id: string;
};

type ActivateTenantByIdDataResponse = unknown;

type ActivateTenantByIdDataError = unknown;

const useActivateTenantById = () => {
  const { fetchApi, isLoading } = useApi<
    ActivateTenantByIdDataParams,
    ActivateTenantByIdDataResponse,
    ActivateTenantByIdDataError
  >('ActivateTenantById', ({ id }) => ({
    method: 'PUT',
    url: `/api/tenants/${id}/activate`,
  }));

  return {
    isLoading,
    activateTenantById: fetchApi,
  };
};

export default useActivateTenantById;
