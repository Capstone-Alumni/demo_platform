import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useApi from 'src/modules/share/hooks/useApi';
import { getTenantListParamsAtom } from '../state';
import { GetTenantListData, GetTenantListParams } from '../types';

type GetTenantListDataParams = GetTenantListParams;

type GetTenantListDataResponse = {
  data: GetTenantListData;
  status: true;
};

type GetTenantListDataError = unknown;

const useGetTenantList = () => {
  const params = useRecoilValue(getTenantListParamsAtom);

  const { fetchApi, data, isLoading } = useApi<
    GetTenantListDataParams,
    GetTenantListDataResponse,
    GetTenantListDataError
  >('getTenantList', ({ page, limit, tenantId, name }) => ({
    method: 'GET',
    url: '/api/tenants',
    params: {
      page,
      limit,
      name,
      tenantId,
    },
  }));

  useEffect(() => {
    fetchApi(params);
  }, [params]);

  const reload = () => {
    fetchApi(params);
  };

  return {
    data,
    isLoading,
    getTenantList: fetchApi,
    reload,
  };
};

export default useGetTenantList;
