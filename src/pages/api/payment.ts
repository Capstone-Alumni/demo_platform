import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';
import { getVnpUrl } from 'src/modules/tenants/helper';
import { prisma } from '@lib/prisma/prisma';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
});

handler.get(async function (req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  try {
    const decoded: any = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const { amount, orderDescription, orderType, tenantId, planId } =
      decoded.data;

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
      select: {
        paymentToken: true,
      },
    });

    if (token !== tenant?.paymentToken) {
      return res.redirect(307, '/payment_used');
    }

    const vnpUrl = await getVnpUrl({
      ipAddr: ipAddr as string,
      amount,
      orderDescription,
      orderType,
      tenantId,
      planId,
    });
    return res.redirect(307, vnpUrl);
  } catch (err) {
    console.log('token err', err);
    return res.redirect(307, '/payment_expired');
  }
});

export default handler;
