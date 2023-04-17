import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useApi from 'src/modules/share/hooks/useApi';

type ResendPaymentTenantByIdDataParams = {
  id: string;
};

type ResendPaymentTenantByIdDataResponse = unknown;

type ResendPaymentTenantByIdDataError = AxiosError;

const useResendPaymentTenantById = () => {
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
    },
  );

  return {
    isLoading,
    resendPaymentTenantById: fetchApi,
  };
};

export default useResendPaymentTenantById;
