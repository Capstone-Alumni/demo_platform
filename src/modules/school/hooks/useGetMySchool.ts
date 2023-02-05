import { useEffect } from 'react';
import useApi from 'src/modules/share/hooks/useApi';
import { Tenant } from '../types';

type GetTenantListDataParams = null;

type GetTenantListDataResponse = {
  data: Tenant;
  status: true;
};

type GetTenantListDataError = unknown;

const useGetMySchool = () => {
  const { fetchApi, data, isLoading } = useApi<
    GetTenantListDataParams,
    GetTenantListDataResponse,
    GetTenantListDataError
  >('getMySchool', () => ({
    method: 'GET',
    url: '/api/school',
  }));

  useEffect(() => {
    fetchApi();
  }, []);

  const reload = () => {
    fetchApi();
  };

  return {
    data,
    isLoading,
    getMySchool: fetchApi,
    reload,
  };
};

export default useGetMySchool;
