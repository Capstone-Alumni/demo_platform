/** ========================== FE ================================= */
export type Tenant = {
  id: string;
  logo: string | null;
  tenantId: string;
  name: string;
  subdomain: string | null;
  description: string | null;
  createdAt: string | Date;
  activated: boolean;
  members: Array<{
    user: {
      id: string;
      email: string;
    };
  }>;
  theme?: string;
};

export type GetTenantListData = {
  items: Tenant[];
  totalItems: number;
  itemPerPage: number;
};

export type GetTenantListParams = {
  page?: number;
  limit?: number;
  tenantId?: string;
  name?: string;
};

/** ========================== BE ================================= */

// Tenants
export type GetTenantListServiceParams = {
  page: number;
  limit: number;
  name: string;
  tenantId: string | undefined;
};

export type GetTenantListServiceProps = {
  params: GetTenantListServiceParams;
};

export type CreateTenantServiceProps = {
  email: string;
  password: string;
  name: string;
  tenantId: string;
  description: string;
  logo: string;
  subdomain: string;
};

export type UpdateTenantInfoByIdServiceProps = {
  name?: string;
  tenantId?: string;
  description?: string;
  logo?: string;
  subdomain?: string;
  theme?: string;
};

export type RegisterTenantServiceProps = {
  email: string;
  password: string;
  name: string;
};
