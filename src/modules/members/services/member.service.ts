import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import cuid from 'cuid';

import {
  CreateManyMemberServiceProps,
  CreateMemberServiceProps,
} from '../types';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';
import sendEmail from '@share/utils/sendEmail';
import { Alumni } from '@prisma/client';

export const isTenantExisted = async (id: string) => {
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
      INSERT INTO ${tenantId}.alumni (id, tenant_id) values ($1, $2)
    `;
    try {
      await mainAppPrisma.$executeRawUnsafe(
        insertAlumniQuery,
        alumni.id,
        alumni.tenantId,
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
  // invite / approve after register
  static create = async ({
    tenantId,
    ...memberData
  }: CreateMemberServiceProps) => {
    console.log('create member');

    if (
      !memberData.fullName ||
      memberData?.gradeClass?.length === 0 ||
      memberData?.gradeClass?.[0].alumClass?.length === 0 ||
      !memberData.email
    ) {
      throw new Error('invalid data');
    }

    const existingAlumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: memberData.email,
          tenantId: tenantId,
        },
      },
    });

    console.log('existingAlumni: ', existingAlumni);

    if (existingAlumni) {
      throw new Error('email existed');
    }

    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
        data: {
          alumniEmail: memberData.email,
          tenantId: tenantId,
        },
      },
      tokenSecret,
    );
    const newAlumni = await prisma.alumni.create({
      data: {
        accountEmail: memberData.email,
        token: token,
        tenant: {
          connect: {
            id: tenantId,
          },
        },
      },
      include: {
        tenant: {
          select: {
            name: true,
            subdomain: true,
          },
        },
      },
    });

    console.log('alumni: ', newAlumni);

    const host = getTenantHost(newAlumni.tenant.subdomain || '');
    const setupLink = `${host}/setup_account?token=${token}&email=${memberData.email}`;

    console.log(setupLink);

    try {
      await sendEmail(
        memberData.email,
        'Gia nhập cộng đồng cựu học sinh',
        `
<pre>
Xin chào ${memberData.fullName},
  
Chào mừng bạn đến với cộng đồng cựu học sinh trường <a href="${host}">${newAlumni.tenant.name}</a>.

Hãy sử dụng đường dẫn sau để thiết lập mật khẩu và tham gia các hoạt động của cộng đồng <a href="${setupLink}">link truy cập</a>.

</pre>
            `,
      );
    } catch (err) {
      console.log(err);
    }

    return {
      newAlumni: newAlumni,
      inputtedData: memberData,
    };
  };

  static createMany = async ({
    memberListData,
    tenantId,
  }: CreateManyMemberServiceProps) => {
    const tenant = await isTenantExisted(tenantId);

    const formattedDataList = memberListData.map(member => {
      const tokenSecret = process.env.JWT_SECRET as string;
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
          data: {
            alumniEmail: member.email,
            tenantId: tenantId,
          },
        },
        tokenSecret,
      );

      return {
        accountEmail: member.email,
        token: token,
        tenantId: tenantId,
      };
    });

    const existingAlumni = await prisma.alumni.findMany({
      where: {
        tenantId: tenantId,
        accountEmail: {
          in: formattedDataList.map(d => d.accountEmail),
        },
      },
      select: {
        id: true,
        accountEmail: true,
      },
    });

    await prisma.alumni.createMany({
      data: formattedDataList,
      skipDuplicates: true,
    });

    const alumni = await prisma.alumni.findMany({
      where: {
        tenantId: tenantId,
        accountEmail: {
          in: formattedDataList.map(d => d.accountEmail),
        },
      },
      select: {
        id: true,
        accountEmail: true,
        token: true,
      },
    });

    const newAlumni = alumni.filter(
      al => !existingAlumni.find(ex => ex.id === al.id),
    );

    // map newAlumni to data
    const newAlumniData = newAlumni.map(al => {
      const data = memberListData.find(it => it.email === al.accountEmail);
      return {
        ...data,
        tenantId: tenantId,
        alumniId: al.id,
        token: al.token,
      };
    });

    // map existingAlumni to data
    const existingAlumniData = existingAlumni.map(al => {
      const data = memberListData.find(it => it.email === al.accountEmail);
      return {
        ...data,
        tenantId: tenantId,
        alumniId: al.id,
      };
    });

    const host = getTenantHost(tenant.subdomain || '');

    try {
      await Promise.all(
        newAlumniData.map(al => {
          const setupLink = `${host}/setup_account?token=${al.token}&email=${al.email}`;

          return sendEmail(
            al.email || '',
            'Gia nhập cộng đồng cựu học sinh',
            `
<pre>
Xin chào ${al.fullName},
  
Chào mừng bạn đến với cộng đồng cựu học sinh trường <a href="${host}">${tenant.name}</a>.

Hãy sử dụng đường dẫn sau để thiết lập mật khẩu và tham gia các hoạt động của cộng đồng <a href="${setupLink}">link truy cập</a>. 

</pre>
              `,
          );
        }),
      );
    } catch (err) {
      console.log(err);
    }

    return {
      newAlumni: newAlumniData.map(({ token, ...other }) => other),
      existingAlumni: existingAlumniData,
    };
  };

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
