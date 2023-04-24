import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useApi from 'src/modules/share/hooks/useApi';
import { getTransactionListParamsAtom } from '../state';
import { GetTransactionListParams, Transaction } from '../types';

type GetTransactionListDataParams = GetTransactionListParams;

type GetTransactionListDataResponse = {
  data: {
    items: Transaction[];
    totalItems: number;
    itemPerPage: number;
  };
  status: true;
};

type GetTransactionListDataError = unknown;

const useGetTransactionList = () => {
  const params = useRecoilValue(getTransactionListParamsAtom);

  const { fetchApi, data, isLoading } = useApi<
    GetTransactionListDataParams,
    GetTransactionListDataResponse,
    GetTransactionListDataError
  >('getTransactionList', ({ page, limit, tenantName }) => ({
    method: 'GET',
    url: '/api/transactions',
    params: {
      page,
      limit,
      tenantName,
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
    getTransactionList: fetchApi,
    reload,
  };
};

export default useGetTransactionList;
