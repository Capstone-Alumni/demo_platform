import { sortObject } from '@share/utils/sortObject';
import TransactionSuccess from './TransactionSuccess';
import querystring from 'qs';
import crypto from 'crypto';
import TransactionFailed from './TransactionFailed';
import { redirect } from 'next/navigation';
import Header from '@share/components/layout/Header';
import Footer from '@share/components/layout/Footer';
import Body from '@share/components/layout/Body';

const Page = async ({ searchParams }: any) => {
  let vnp_Params = { ...searchParams };

  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);

  // const tmnCode = process.env.VNPAY_TMNCODE;
  // const secretKey = process.env.VNPAY_HASHSECRET as string;
  const secretKey = process.env.VNP_HASHSECRET as string;

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  console.log(secureHash, signed);

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    if (vnp_Params.vnp_ResponseCode === '24') {
      return redirect('/');
    }

    return (
      <div>
        <Header />
        <Body>
          <TransactionSuccess />
        </Body>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Body>
        <TransactionFailed />
      </Body>
      <Footer />
    </div>
  );
};

export default Page;

//  test local:
// success: http://thptnd.localhost:3005/transaction_status?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP13954901&vnp_CardType=ATM&vnp_OrderInfo=Nap+tien+cho+thue+bao+0123456789.+So+tien+100%2C000+VND&vnp_PayDate=20230311141335&vnp_ResponseCode=00&vnp_TmnCode=LWLL60KS&vnp_TransactionNo=13954901&vnp_TransactionStatus=00&vnp_TxnRef=20230311141316&vnp_SecureHash=30122af37d8c129ace3d6cac2b5f2c89767eab06082d44b6defe42b49354117a4ad8434f4b120caaad92bafe485001141a25fb1cce3e942f6e134b335211f556
// failed: http://thptnd.localhost:3005/transaction_status?vnp_Amount=10000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP13954901&vnp_CardType=ATM&vnp_OrderInfo=Nap+tien+cho+thue+bao+0123456789.+So+tien+100%2C000+VND&vnp_PayDate=20230311141335&vnp_ResponseCode=00&vnp_TmnCode=LWLL60KS&vnp_TransactionNo=13954901&vnp_TransactionStatus=00&vnp_TxnRef=20230311141316&vnp_SecureHash=30122af37d8c129ace3d6cac2b5f2c89767eab06082d44b6defe42b49354117a4ad8434f4b120caaad92bafe485001141a25fb1cce3e942f6e134b335211f55
