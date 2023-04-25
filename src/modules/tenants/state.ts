import { atom } from 'recoil';
import { GetTenantListParams, GetTransactionListParams } from './types';

export const getTenantListParamsAtom = atom<GetTenantListParams>({
  key: 'getTenantListParams',
  default: {
    page: 1,
    limit: 10,
    tenantId: undefined,
    name: '',
    planName: '',
  },
});

export const getTransactionListParamsAtom = atom<GetTransactionListParams>({
  key: 'getTransactionListParamsAtom',
  default: {
    page: 1,
    limit: 10,
    tenantName: '',
  },
});
