import querystring from 'qs';
import crypto from 'crypto';
import { isNil } from 'lodash/fp';
import { formatDate } from '@share/utils/formatDate';
import { sortObject } from '@share/utils/sortObject';
import { prisma } from '@lib/prisma/prisma';
import { NextApiRequest } from 'next';

export const getVnpUrl = async ({
  ipAddr,
  amount,
  bankCode,
  orderDescription,
  orderType,
  tenantId,
  planId,
  language,
}: {
  ipAddr: string;
  amount: number;
  bankCode?: string;
  orderDescription: string;
  orderType: number;
  tenantId: string;
  planId: string;
  language?: string;
}) => {
  // const tmnCode = process.env.VNPAY_TMNCODE; // config.get('vnp_TmnCode');
  // const secretKey = process.env.VNPAY_HASHSECRET; // config.get('vnp_HashSecret');
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;

  if (isNil(secretKey) || isNil(tmnCode)) {
    throw new Error('something went wrong');
  }

  let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // config.get('vnp_Url');
  // TODO: https://capstone-alumni.atlassian.net/browse/AL-147

  const host = process.env.NEXTAUTH_URL;
  const returnUrl = `${host}/transaction_status`;
  // 'http://localhost:3005/vnpayreturn'; // config.get('vnp_ReturnUrl');

  const date = new Date();

  const createDate = formatDate(date, 'yyyyMMddHHmmss');
  const orderId = createDate; // formatDate(date, 'HHmmss');

  const orderInfo = orderDescription;
  let locale = language;
  if (locale === undefined || locale === null || locale === '') {
    locale = 'vn';
  }
  const currCode = 'VND';
  let vnp_Params: any = {};
  vnp_Params.vnp_Version = '2.1.0';
  vnp_Params.vnp_Command = 'pay';
  vnp_Params.vnp_TmnCode = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params.vnp_Locale = locale;
  vnp_Params.vnp_CurrCode = currCode;
  vnp_Params.vnp_TxnRef = orderId;
  vnp_Params.vnp_OrderInfo = orderInfo;
  vnp_Params.vnp_OrderType = orderType;
  vnp_Params.vnp_Amount = amount * 100;
  vnp_Params.vnp_IpAddr = ipAddr;
  vnp_Params.vnp_CreateDate = createDate;
  if (bankCode !== undefined && bankCode !== null && bankCode !== '') {
    vnp_Params.vnp_BankCode = bankCode;
  }

  const transaction = await prisma.transaction.create({
    data: {
      ...vnp_Params,
      vnp_Amount: parseInt(vnp_Params.vnp_Amount, 10),
      vnp_OrderType: vnp_Params.vnp_OrderType.toString(),

      plan: {
        connect: { id: planId },
      },

      tenant: {
        connect: { id: tenantId },
      },
    },
  });

  await prisma.$disconnect();

  vnp_Params.vnp_ReturnUrl = returnUrl;
  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  vnp_Params.vnp_SecureHash = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};
