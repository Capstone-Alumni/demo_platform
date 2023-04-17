import nc from 'next-connect';
import querystring from 'qs';
import crypto from 'crypto';
// import { extractTenantId } from '@lib/next-connect';
import { sortObject } from '@share/utils/sortObject';
import { prisma } from '@lib/prisma/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';
import axios from 'axios';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
});

handler.get(async function (req: NextApiRequest, res: NextApiResponse) {
  let vnp_Params = req.query;

  console.log('Update Transaction', vnp_Params);

  if (vnp_Params.vnp_OrderInfo === 'Test_call_ipn') {
    return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }

  const secureHash = vnp_Params.vnp_SecureHash;

  const orderId = vnp_Params.vnp_TxnRef as string;
  const rspCode = vnp_Params.vnp_ResponseCode;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNP_HASHSECRET as string;

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  const transaction = await prisma.transaction.findUnique({
    where: {
      vnp_TxnRef: orderId,
    },
    include: {
      tenant: {
        include: {
          alumni: {
            where: {
              isOwner: true,
            },
            include: {
              account: true,
            },
          },
        },
      },
      plan: true,
    },
  });

  const checkOrderId = !!transaction; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount =
    transaction?.vnp_Amount.toString() === (vnp_Params.vnp_Amount as string); // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn

  const paymentStatus = transaction?.paymentStatus; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  // paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  // paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === 0) {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == '00') {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            const currentEndTime = new Date(
              transaction.tenant.subscriptionEndTime || '',
            );
            const currentDate = new Date();
            const endTime =
              currentDate > currentEndTime ? currentDate : currentEndTime;
            endTime.setDate(endTime.getDate() + transaction.plan.duration);

            await prisma.transaction.update({
              where: {
                vnp_TxnRef: orderId,
              },
              data: {
                paymentStatus: 1,
                tenant: {
                  update: {
                    subscriptionEndTime: endTime,
                  },
                },
              },
            });

            await axios.post(
              `${process.env.NEXT_PUBLIC_MAIL_HOST}/mail/send-email`,
              {
                to: transaction.tenant.alumni[0].account.email,
                subject: 'Thông tin tài khoản',
                text: `
<pre>
Kính gửi,

Thanh toán, dưới đây là thông tin trang web của bạn:

- Địa chỉ web: https://${transaction.tenant.subdomain}.vercel.app
- Tên đăng nhập/mật khẩu: là email và mât khẩu bạn dùng để đăng ký ban đầu
</pre>
                `,
              },
            );

            // TODO: increase message for user

            res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            await prisma.transaction.update({
              where: {
                vnp_TxnRef: orderId,
              },
              data: {
                paymentStatus: 2,
              },
            });
            res.status(200).json({ RspCode: '00', Message: 'Success' });
          }
        } else {
          res.status(200).json({
            RspCode: '02',
            Message: 'This order has been updated to the payment status',
          });
        }
      } else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }

  await prisma.$disconnect();
});

export default handler;
