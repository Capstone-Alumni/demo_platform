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
  fullName: string;
  gradeClass: Array<{
    grade: Array<{ id: string; value: string; label: string }>;
    alumClass: Array<{ id: string; value: string; label: string }>;
  }>;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  facebook?: string;
  tenantId: string;
  password?: string;
};

export type ExternalCreateMemberServiceProps = {
  fullName: string;
  gradeClass: Array<{
    grade: Array<{ id: string; value: string; label: string }>;
    alumClass: Array<{ id: string; value: string; label: string }>;
  }>;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  facebook?: string;
  tenantId: string;
};

export type CreateManyMemberServiceProps = {
  memberListData: Array<{
    email: string;
    password: string;
  }>;
  tenantId: string;
};

export type UpdateMemberInfoByIdServiceProps = {
  password?: string;
};
