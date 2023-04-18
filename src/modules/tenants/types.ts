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
  name: string;
  subdomain: string | null;
  description: string | null;
  createdAt: string | Date;
  subscriptionEndTime?: string | Date;
  alumni: Array<{
    id: string;
    accountEmail: string | null;
  }>;
  theme?: string;
  requestStatus: number;
  provinceCodename: string;
  provinceName: string;
  cityCodename: string;
  cityName: string;
  address: string;
  planId: string;
  plan: Plan | null;
  transactions?: Array<{
    paymentStatus: number;
  }>;
  evidenceUrl: string;
  paymentToken?: string;
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
  description?: string;
  logo?: string;
  background1?: string;
  background2?: string;
  background3?: string;
  subdomain?: string;
  theme?: string;
};

export type RegisterTenantServiceProps = {
  fullName: string;
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
  evidenceUrl: string;
};
