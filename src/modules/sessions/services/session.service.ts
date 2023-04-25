import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mainAppPrisma, prisma } from '@lib/prisma/prisma';
import { SignInRequestBody, UpdatePasswordRequestBody } from '../types';
import { isTenantExisted } from 'src/modules/members/services/member.service';
import getTenantHost from 'src/modules/tenants/utils/getTenantHost';
import sendEmail from '@share/utils/sendEmail';

export default class SessionService {
  static signIn = async ({
    email,
    password: passwordInputted,
    subdomain,
  }: SignInRequestBody) => {
    if (!subdomain) {
      throw new Error('wrong tenant');
    }

    const tenant = await prisma.tenant.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!tenant) {
      throw new Error('wrong tenant');
    }

    const alumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: email,
          tenantId: tenant.id,
        },
      },
      include: {
        tenant: {
          select: {
            id: true,
            subdomain: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    const { password } = alumni;

    if (password && compareSync(passwordInputted, password)) {
      await prisma.alumni.update({
        where: {
          id: alumni.id,
        },
        data: {
          lastLogin: new Date(),
        },
      });

      const insertAlumniQuery = `
        UPDATE ${alumni.tenantId}.alumni SET last_login = $1 where id = $2;
      `;
      try {
        await mainAppPrisma.$executeRawUnsafe(
          insertAlumniQuery,
          new Date(),
          alumni.id,
        );
      } catch (err) {
        console.log(err);
      }

      return {
        id: alumni.id,
        email: alumni.accountEmail,
        tenant: {
          tenantId: alumni.tenant.id,
          subdomain: alumni.tenant.subdomain,
        },
        isOwner: alumni.isOwner,
      };
    }

    throw new Error('sign-in failed');
  };

  static internalLogin = async ({
    email,
    password: passwordInputted,
  }: SignInRequestBody) => {
    const account = await prisma.account.findUnique({
      where: { email: email },
    });

    if (!account) {
      throw new Error('sign-in failed');
    }

    const { password } = account;

    if (password && compareSync(passwordInputted, password)) {
      return {
        id: account.id,
        email: account.email,
      };
    }

    throw new Error('sign-in failed');
  };

  static updatePassword = async ({
    userId,
    password: currentPassword,
    newPassword,
    subdomain,
  }: UpdatePasswordRequestBody) => {
    if (!subdomain) {
      throw new Error('wrong tenant');
    }

    const alumni = await prisma.alumni.findUnique({
      where: { id: userId },
      include: {
        tenant: {
          select: {
            id: true,
            subdomain: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    const { password } = alumni;

    if (password && compareSync(currentPassword, password)) {
      if (currentPassword === newPassword) {
        throw new Error('same-password');
      }
      const hashedPassword = hashSync(newPassword, 10);
      await prisma.alumni.update({
        where: {
          id: alumni.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        id: alumni.id,
        email: alumni.accountEmail,
        tenant: {
          tenantId: alumni.tenant.id,
          subdomain: alumni.tenant.subdomain,
        },
        isOwner: alumni.isOwner,
      };
    }

    throw new Error('Sai mật khẩu, vui lòng thử lại.');
  };

  static resetInvitation = async ({
    tenantId,
    alumniId,
  }: {
    tenantId: string;
    alumniId: string;
  }) => {
    const tenant = await isTenantExisted(tenantId);

    const existingAlumni = await prisma.alumni.findUnique({
      where: {
        id: alumniId,
      },
    });

    if (!existingAlumni) {
      throw new Error('email non exist');
    }

    if (existingAlumni.password) {
      throw new Error('activated');
    }

    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
        data: {
          alumniEmail: existingAlumni.accountEmail,
          tenantId: tenant.id,
        },
      },
      tokenSecret,
    );
    const newAlumni = await prisma.alumni.update({
      where: {
        id: alumniId,
      },
      data: {
        token: token,
      },
    });

    const host = getTenantHost(tenant.subdomain || '');
    const setupLink = `${host}/setup_account?token=${token}&email=${existingAlumni.accountEmail}`;

    sendEmail(
      existingAlumni.accountEmail as string,
      'Mời gia nhập cộng đồng cựu học sinh',
      `
<pre>
Chào bạn,
  
<a href="${host}">${tenant.name}</a> mời bạn sử dụng hệ thống kết nối cựu học sinh <a href="${setupLink}">theo link sau</a>. 

</pre>
            `,
    );

    return newAlumni;
  };

  static precheckAlumniToken = async ({ token }: { token: string }) => {
    const decoded: any = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    const { alumniEmail, tenantId } = decoded.data;

    const alumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: alumniEmail,
          tenantId: tenantId,
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    if (alumni?.token !== token) {
      throw new Error('404');
    }

    return 'verified';
  };

  static forgotPasswordRequest = async ({
    accountEmail,
    tenantId
  }: {
    accountEmail: string;
    tenantId: string;
  }) => {
    const tenant = await isTenantExisted(tenantId);

    const existingAlumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: accountEmail,
          tenantId: tenant.id,
        },
      },
      select: {
        id: true,
        accountEmail: true,
        isOwner: true,
        token: true,
        tenant: {
          select: {
            id: true,
            subdomain: true,
          },
        },
      },
    });

    if (!existingAlumni) {
      throw new Error('email non exist');
    }

    const tokenSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 48,
        data: {
          alumniEmail: existingAlumni.accountEmail,
          tenantId: tenant.id,
        },
      },
      tokenSecret,
    );
    const newAlumni = await prisma.alumni.update({
      where: {
        id: existingAlumni.id,
      },
      data: {
        token: token,
      },
    });

    const host = getTenantHost(tenant.subdomain || '');
    const setupLink = `${host}/reset_password?token=${token}&email=${existingAlumni.accountEmail}`;

    sendEmail(
      existingAlumni.accountEmail as string,
      'Đổi mật khẩu',
      `
        <pre>
        Chào bạn,
          
        <a href="${host}">${tenant.name}</a> xin gửi bạn link để thay đổi mật khẩu <a href="${setupLink}">theo link sau</a>. 

        Nếu bạn không yêu cầu đổi mật khẩu, xin vui lòng bỏ qua email này.
        </pre>
      `,
    );

    return newAlumni;
  };

  static precheckAlumniTokenForgotPassword = async ({ token }: { token: string }) => {
    const decoded: any = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    const { alumniEmail, tenantId } = decoded.data;

    const alumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: alumniEmail,
          tenantId: tenantId,
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    if (alumni?.token !== token) {
      throw new Error('404');
    }

    return 'verified';
  };

  static updatePasswordByToken = async ({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) => {
    const decoded: any = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    const { alumniEmail, tenantId } = decoded.data;

    const alumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: alumniEmail,
          tenantId: tenantId,
        },
      },
      select: {
        id: true,
        accountEmail: true,
        isOwner: true,
        token: true,
        tenant: {
          select: {
            id: true,
            subdomain: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    if (alumni?.token !== token) {
      throw new Error('404');
    }

    const hashedPassword = hashSync(newPassword, 10);
    await prisma.alumni.update({
      where: {
        id: alumni.id,
      },
      data: {
        password: hashedPassword,
        token: null,
      },
    });

    return {
      id: alumni.id,
      email: alumni.accountEmail,
      tenant: {
        tenantId: alumni.tenant.id,
        subdomain: alumni.tenant.subdomain,
      },
      isOwner: alumni.isOwner,
    };
  };

  static updatePasswordByTokenThroughForgotPassword = async ({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) => {
    const decoded: any = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    const { alumniEmail, tenantId } = decoded.data;

    const alumni = await prisma.alumni.findUnique({
      where: {
        accountEmail_tenantId: {
          accountEmail: alumniEmail,
          tenantId: tenantId,
        },
      },
      select: {
        id: true,
        accountEmail: true,
        isOwner: true,
        token: true,
        tenant: {
          select: {
            id: true,
            subdomain: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error('wrong subdomain');
    }

    if (alumni?.token !== token) {
      throw new Error('404');
    }

    const hashedPassword = hashSync(newPassword, 10);
    await prisma.alumni.update({
      where: {
        id: alumni.id,
      },
      data: {
        password: hashedPassword,
        token: null,
      },
    });

    return {
      id: alumni.id,
      email: alumni.accountEmail,
      tenant: {
        tenantId: alumni.tenant.id,
        subdomain: alumni.tenant.subdomain,
      },
      isOwner: alumni.isOwner,
    };
  };
}
