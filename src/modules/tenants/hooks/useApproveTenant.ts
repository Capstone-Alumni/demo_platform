import useApi from 'src/modules/share/hooks/useApi';

type ApproveTenantByIdDataParams = {
  id: string;
};

type ApproveTenantByIdDataResponse = unknown;

type ApproveTenantByIdDataError = unknown;

const useApproveTenantById = () => {
  const { fetchApi, isLoading } = useApi<
    ApproveTenantByIdDataParams,
    ApproveTenantByIdDataResponse,
    ApproveTenantByIdDataError
  >('ApproveTenantById', ({ id }) => ({
    method: 'PUT',
    url: `/api/tenants/${id}/approve`,
  }));

  return {
    isLoading,
    approveTenantById: fetchApi,
  };
};

export default useApproveTenantById;
