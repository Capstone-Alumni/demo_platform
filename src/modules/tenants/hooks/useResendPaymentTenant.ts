import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type ResendPaymentTenantByIdDataParams = {
  id: string;
};

type ResendPaymentTenantByIdDataResponse = unknown;

type ResendPaymentTenantByIdDataError = AxiosError;

const useResendPaymentTenantById = () => {
  const router = useRouter();

  const { fetchApi, isLoading } = useApi<
    ResendPaymentTenantByIdDataParams,
    ResendPaymentTenantByIdDataResponse,
    ResendPaymentTenantByIdDataError
  >(
    'ResendPaymentTenantById',
    ({ id }) => ({
      method: 'PUT',
      url: `/api/tenants/${id}/resend_payment`,
    }),
    {
      onError: ({ response }: AxiosError) => {
        toast.error('Xảy ra lỗi, vui lòng thử lại');
      },
      onSuccess: () => {
        router.refresh();
      },
    },
  );

  return {
    isLoading,
    resendPaymentTenantById: fetchApi,
  };
};

export default useResendPaymentTenantById;
