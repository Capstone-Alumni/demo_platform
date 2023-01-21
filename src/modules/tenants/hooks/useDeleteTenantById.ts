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
  >('deleteTenantById', ({ id }) => ({
    method: 'DELETE',
    url: `/api/tenants/${id}`,
  }));

  return {
    isLoading,
    deleteTenantById: fetchApi,
  };
};

export default useDeleteTenantById;
