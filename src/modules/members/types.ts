import { AccessLevel } from '@prisma/client';

/** ========================== FE ================================= */
export type Member = {
  id: string;
  userId: string;
  tenantId: string;

  isOwner: boolean;

  user: {
    id: string;
    email: string;
  };
};

export type GetMemberListParams = {
  page?: number;
  limit?: number;
  email?: string;
};

export type GetMemberListData = {
  items: Member[];
  totalItems: number;
  itemPerPage: number;
};

/** ========================== BE ================================= */

export type GetMemberListServiceParams = {
  page: number;
  limit: number;
  email: string;
};

export type GetMemberListServiceProps = {
  tenantId: string;
  params: GetMemberListServiceParams;
};

export type CreateMemberServiceProps = {
  email: string;
  password: string;
  tenantId: string;
  accessLevel: AccessLevel;
};

export type CreateManyMemberServiceProps = {
  memberListData: Array<{
    email: string;
    password: string;
    accessLevel: AccessLevel;
  }>;
  tenantId: string;
};

export type UpdateMemberInfoByIdServiceProps = {
  password?: string;
  accessLevel: AccessLevel;
};
