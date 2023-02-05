import { atom } from 'recoil';
import { GetTenantListParams } from './types';

export const getTenantListParamsAtom = atom<GetTenantListParams>({
  key: 'getTenantListParams',
  default: {
    page: 1,
    limit: 10,
    tenantId: undefined,
    name: '',
  },
});
