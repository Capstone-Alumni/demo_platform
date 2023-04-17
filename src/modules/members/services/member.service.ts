import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { hashSync } from 'bcrypt';
import cuid from 'cuid';

import {
  CreateManyMemberServiceProps,
  CreateMemberServiceProps,
} from '../types';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';
import sendEmail from '@share/utils/sendEmail';
import { Alumni } from '@prisma/client';

const isTenantExisted = async (id: string) => {
  if (!id) {
    throw new Error('tenant not exist');
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: id },
  });

  if (!tenant) {
    throw new Error('tenant not exist');
  }

  return tenant;
};

const dualWriteAlumniProfile = async (
  {
    tenantId,
    fullName,
    gradeClass,
    email,
    phone,
    dateOfBirth,
    facebook,
  }: CreateMemberServiceProps,
  alumni: Alumni,
  option: {
    createAlumni?: boolean;
    createClassRef?: boolean;
    createProfile?: boolean;
  } = {
    createAlumni: true,
    createClassRef: true,
    createProfile: true,
  },
) => {
  console.log('dual write');
  // Tạo account
  if (option.createAlumni) {
    const insertAlumniQuery = `
      INSERT INTO ${tenantId}.alumni (id, tenant_id, account_id) values ($1, $2, $3)
    `;
    try {
      await mainAppPrisma.$executeRawUnsafe(
        insertAlumniQuery,
        alumni.id,
        alumni.tenantId,
        alumni.accountId,
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Tạo liên kết alumni - class
  if (option.createClassRef) {
    const insertAlumniClassRelationshipQuery = `
    INSERT INTO ${tenantId}.alumni_to_class (id, alum_class_id, alumni_id) values ($1, $2, $3)
  `;
    const flattenClass = gradeClass.reduce((red: any[], { alumClass }) => {
      return red.concat(alumClass.map(cl => cl.value));
    }, []);
    console.log(flattenClass);
    try {
      await Promise.all(
        flattenClass.map(item =>
          mainAppPrisma.$executeRawUnsafe(
            insertAlumniClassRelationshipQuery,
            cuid(),
            item,
            alumni.id,
          ),
        ),
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Tạo profile
  if (option.createProfile) {
    const insertAlumniInformationQuery = `
    INSERT INTO ${tenantId}.informations (id, alumni_id, full_name, email, phone, facebook_url, date_of_birth) values ($1, $2, $3, $4, $5, $6, $7)
  `;
    try {
      await mainAppPrisma.$executeRawUnsafe(
        insertAlumniInformationQuery,
        cuid(),
        alumni.id,
        fullName,
        email,
        phone,
        facebook,
        dateOfBirth ? new Date(dateOfBirth) : undefined,
      );
    } catch (err) {
      console.log(err);
    }
  }
};

export default class MemberService {
  static create = async ({
    tenantId,
    ...memberData
  }: CreateMemberServiceProps) => {
    console.log('create member');
    const tenant = await isTenantExisted(tenantId);

    if (
      !memberData.fullName ||
      memberData?.gradeClass?.length === 0 ||
      !memberData.email
    ) {
      throw new Error('invalid data');
    }

    let account: any = {};

    account = await prisma.account.findUnique({
      where: { email: memberData.email },
    });

    console.log('account: ', account);

    if (!account) {
      const randomPassword = memberData.password
        ? memberData.password
        : Math.random().toString(36).slice(-8);
      const encryptedRandomPassword = hashSync(randomPassword, 10);
      account = await prisma.account.create({
        data: {
          email: memberData.email,
          password: encryptedRandomPassword,
        },
      });

      const newMember = await prisma.alumni.create({
        data: {
          account: {
            connect: {
              id: account.id,
            },
          },
          tenant: {
            connect: {
              id: tenant.id,
            },
          },
        },
      });

      console.log('alumni: ', newMember);

      dualWriteAlumniProfile({ tenantId, ...memberData }, newMember);

      const host = getTenantHost(tenant.subdomain || '');

      if (!memberData.password) {
        sendEmail(
          account.email,
          'Mời thành viên',
          `<pre>
            Chào ${memberData.fullName},
                
            <a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu sinh viên.
            Địa chỉ website: ${host}
            Tài khoản đăng nhập:
            - email: ${account.email}
            - password: ${randomPassword}
    
            *Lưu ý: đổi password sau khi đăng nhập
            </pre>
                
              `,
        );
      } else {
        sendEmail(
          account.email,
          'Tham gia cộng đồng cựu học sinh',
          `<pre>
            Chào ${memberData.fullName},
            
            Cảm ơn bạn đã nộp đơn tham gia vào hội alumni của trường. <a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu sinh viên.
            Địa chỉ website: ${host}
            </pre>
                
              `,
        );
      }

      return newMember;
    }

    const newMember = await prisma.alumni.upsert({
      where: {
        accountId_tenantId: {
          tenantId: tenant.id,
          accountId: account.id,
        },
      },
      create: {
        account: {
          connect: {
            id: account.id,
          },
        },
        tenant: {
          connect: {
            id: tenant.id,
          },
        },
      },
      update: {},
    });

    dualWriteAlumniProfile({ tenantId, ...memberData }, newMember, {
      createAlumni: true,
      createClassRef: true,
      createProfile: true,
    });

    const host = getTenantHost(tenant.subdomain || '');

    if (!memberData.password) {
      sendEmail(
        account.email,
        'Mời thành viên',
        `<pre>
          Chào ${memberData.fullName},
              
          <a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu sinh viên.
          Địa chỉ website: ${host}
  
          *Lưu ý: đổi password sau khi đăng nhập
          </pre>
              
            `,
      );
    } else {
      sendEmail(
        account.email,
        'Tham gia cộng đồng cựu học sinh',
        `<pre>
          Chào ${memberData.fullName},
          
          Cảm ơn bạn đã nộp đơn tham gia vào hội alumni của trường. <a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu sinh viên.
          Địa chỉ website: ${host}
          </pre>
              
            `,
      );
    }

    return newMember;
  };

  static createMany = async ({
    memberListData,
    tenantId,
  }: CreateManyMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    memberListData.forEach(({ email, password }) => {
      if (!email || !password) {
        throw new Error('invalid data');
      }
    });

    const formattedData = await Promise.all(
      memberListData.map(async ({ email, password }) => {
        const encryptedPassword = hashSync(password, 10);

        const user = await prisma.account.findUnique({
          where: { email: email },
        });

        return {
          accountId: user?.id,
          email: email,
          password: encryptedPassword,
        };
      }),
    );

    const res = await prisma.$transaction(
      formattedData.map(({ accountId, email, password }) => {
        return prisma.alumni.upsert({
          where: {
            accountId_tenantId: {
              tenantId: tenant.id,
              accountId: accountId || '',
            },
          },
          update: {},
          create: {
            account: {
              connectOrCreate: {
                where: { email: email },
                create: { email: email, password: password },
              },
            },
            tenant: {
              connect: {
                id: tenant.id,
              },
            },
          },
          include: {
            account: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });
      }),
    );

    res.forEach(async ({ id, account: user }) => {
      const insertAlumniQuery = `
        INSERT INTO ${tenant.id}.alumni (id, tenant_id, account_id, account_email, access_level, access_status) values ($1, $2, $3, $4, 'APPROVED')
      `;
      await mainAppPrisma.$executeRawUnsafe(
        insertAlumniQuery,
        id,
        tenant.id,
        user.id,
        user.email,
      );
    });

    return res;
  };

  // static getById = async (id: string) => {
  //   const grade = await prisma.Member.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   return grade;
  // };

  static deleteById = async (tenantId: string, id: string) => {
    const member = await prisma.alumni.findUnique({
      where: { id: id },
      include: {
        tenant: true,
      },
    });

    if (member) {
      if (member?.isOwner) {
        throw new Error('cannot delete');
      }

      await prisma.alumni.delete({
        where: {
          id: id,
        },
      });
    }

    const alumniQuery = `
      DELETE FROM ${tenantId}.alumni WHERE id = $1;
    `;
    await mainAppPrisma.$executeRawUnsafe(alumniQuery, id);

    return member;
  };
}
