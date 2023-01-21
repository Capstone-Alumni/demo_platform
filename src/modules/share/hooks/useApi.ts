import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import axios from 'axios';
import { useEffect } from 'react';
import formatSearchParams from '../utils/formatParams';
import { noop } from 'lodash/fp';

export type ApiConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params?: object;
  data?: unknown;
  headers?: object;
};

export type AxiosConfig = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: object;
  data?: unknown;
};

export type ApiOptions<Data, Err, Params> = {
  retainOnUnmount?: boolean;
} & SWRMutationConfiguration<Data, Err, Params, string>;

const transformAxiosConfig = ({
  method,
  url,
  params,
  data,
  headers,
}: ApiConfig): AxiosConfig => {
  const config: AxiosConfig = {
    method,
    url: params ? url + formatSearchParams(params) : url,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    data,
  };

  return config;
};

const useApi = <Params, Data, Err>(
  apiName: string, // should be unique accross the provider
  generateDescription: (params: Params) => ApiConfig,
  apiOptions: ApiOptions<Data, Err, Params> = {
    optimisticData: undefined,
    revalidate: true,
    populateCache: true,
    rollbackOnError: true,
    throwOnError: false,
    onSuccess: noop,
    onError: noop,
    retainOnUnmount: false,
  },
) => {
  const {
    optimisticData,
    revalidate,
    populateCache,
    rollbackOnError,
    throwOnError,
    onSuccess,
    onError,
    retainOnUnmount,
  } = apiOptions;

  const fetcher = async (key: string, { arg: params }: { arg: Params }) => {
    const apiConfig = generateDescription(params);
    const axiosConfig = transformAxiosConfig(apiConfig);

    const response = await axios(axiosConfig);
    const { data } = response;

    return data;
  };

  const { data, error, trigger, reset, isMutating } = useSWRMutation(
    apiName,
    fetcher,
    {
      optimisticData,
      revalidate,
      populateCache,
      rollbackOnError,
      throwOnError,
      onSuccess,
      onError,
    },
  );

  // cache
  useEffect(
    () => () => {
      if (retainOnUnmount) {
        reset();
      }
    },
    [],
  );

  return {
    data,
    error,
    fetchApi: trigger,
    reset,
    isLoading: isMutating,
  };
};

export default useApi;
