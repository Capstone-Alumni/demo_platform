import { atom } from 'recoil';
import { GetMemberListParams } from './types';

export const getMemberListParamsAtom = atom<GetMemberListParams>({
  key: 'getMemberListParams',
  default: {
    page: 1,
    limit: 10,
    email: '',
  },
});
