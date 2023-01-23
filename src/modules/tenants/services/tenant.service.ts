import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { createSubdomain, deleteSubdomain } from '@share/utils/subdomainAPI';
import { hashSync } from 'bcrypt';

import {
  CreateTenantServiceProps,
  GetTenantListServiceProps,
  UpdateTenantInfoByIdServiceProps,
} from '../types';

export default class TenantService {
  static getList = async ({ params }: GetTenantListServiceProps) => {
    const { name, tenantId, page, limit } = params;

    const whereFilter = {
      AND: [
        { tenantId: { contains: tenantId } },
        { name: { contains: name } },
        { archived: false },
      ],
    };

    const [totalTenantItem, TenantItems] = await prisma.$transaction([
      prisma.tenant.count({
        where: whereFilter,
      }),
      prisma.tenant.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: whereFilter,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      totalItems: totalTenantItem,
      items: TenantItems,
      itemPerPage: limit,
    };
  };

  static create = async (values: CreateTenantServiceProps) => {
    /** pre-check */
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (user) {
      throw new Error('existed user');
    }

    const existingTenantId = await prisma.tenant.findUnique({
      where: {
        tenantId: values.tenantId,
      },
    });

    if (existingTenantId) {
      throw new Error('existed tenantId');
    }

    const existingSubdomain = await prisma.tenant.findUnique({
      where: {
        subdomain: values.subdomain,
      },
    });

    if (existingSubdomain) {
      throw new Error('existed subdomain');
    }

    /** Create subdomain */
    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        body: `{\n  "name": "${values.subdomain}${process.env.MAINAPP_DOMAIN}"\n}`,
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    const data = await response.json();

    // Domain is already owned by another team but you can request delegation to access it
    if (data.error?.code === 'forbidden') {
      throw new Error('forbidden');
    }

    // Domain is already being used by a different project
    if (data.error?.code === 'domain_taken') {
      throw new Error('existed subdomain');
    }

    /** Create database  */
    const encryptedPassword = hashSync(values.password, 10);

    const newTenant = await prisma.tenant.create({
      data: {
        name: values.name,
        tenantId: values.tenantId,
        description: values.description,
        logo: values.logo,
        subdomain: values.subdomain,
        members: {
          create: [
            {
              user: {
                create: {
                  email: values.email,
                  password: encryptedPassword,
                  accessLevel: 'SCHOOL_ADMIN',
                  accessStatus: 'APPROVED',
                },
              },
            },
          ],
        },
      },
    });

    /** Create schema in mainApp */
    await mainAppPrisma.$executeRaw`
      SELECT clone_schema('public', ${values.tenantId});
    `;

    return newTenant;
  };

  static getById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: id,
      },
    });

    return tenant;
  };

  static getBySubdomain = async (subdomain: string) => {
    const Tenant = await prisma.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    return Tenant;
  };

  static updateInfoById = async (
    id: string,
    data: UpdateTenantInfoByIdServiceProps,
  ) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });
    if (!tenant) {
      throw new Error('tenant not existed');
    }

    if (data.subdomain && data.subdomain !== tenant.subdomain) {
      const existedSubdomain = await prisma.tenant.findUnique({
        where: { subdomain: data.subdomain },
      });
      if (existedSubdomain) {
        throw new Error('subdomain existed');
      }

      if (tenant.subdomain) {
        await deleteSubdomain(tenant.subdomain);
      }
      await createSubdomain(data.subdomain);
    }

    const newTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: data,
    });

    return newTenant;
  };

  static deleteById = async (id: string) => {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id },
    });

    if (!tenant) {
      throw new Error('tenant is not existed');
    }

    const domain = `${tenant.subdomain}${process.env.MAINAPP_DOMAIN}`;

    const response = await fetch(
      `https://api.vercel.com/v8/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        },
        method: 'DELETE',
      },
    );

    await response.json();

    const deletedTenant = await prisma.tenant.update({
      where: {
        id: id,
      },
      data: {
        archived: true,
      },
    });

    return deletedTenant;
  };
}
