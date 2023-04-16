import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
});

handler.get(async function (req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  try {
    const decoded = await jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.redirect(307, decoded.data.vnpUrl);
  } catch (err) {
    console.log('token err', err);
    return res.redirect(307, '/payment_expired');
  }
});

export default handler;
