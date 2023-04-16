/** ========================== FE ================================= */

export type Plan = {
  id: string;
  name: string;
  duration: string | number;
  price: string | number;
};

export type Tenant = {
  id: string;
  logo: string | null;
  background1: string | null;
  background2: string | null;
  background3: string | null;
  tenantId: string;
  name: string;
  subdomain: string | null;
  description: string | null;
  createdAt: string | Date;
  subcriptionEndTime?: string | Date;
  alumni: Array<{
    account: {
      id: string;
      email: string;
    };
  }>;
  theme?: string;
  approved: boolean;
  provinceCodename: string;
  provinceName: string;
  cityCodename: string;
  cityName: string;
  address: string;
  planId: string;
  plan: Plan | null;
  transactions: Array<{
    paymentStatus: number;
  }>;
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
  planName?: string;
};

/** ========================== BE ================================= */

// Tenants
export type GetTenantListServiceParams = {
  page: number;
  limit: number;
  name: string;
  tenantId: string | undefined;
  planName: string;
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
  background1?: string;
  background2?: string;
  background3?: string;
  subdomain?: string;
  theme?: string;
};

export type RegisterTenantServiceProps = {
  email: string;
  password: string;
  name: string;
  logo: string;
  provinceCodename: string;
  provinceName: string;
  cityCodename: string;
  cityName: string;
  address: string;
  plan: string;
  subdomain: string;
};
