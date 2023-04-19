import { Button, Paper, Stack, useTheme } from '@mui/material';
import { Tenant } from '../types';
import useRejectTenantById from '../hooks/useRejectTenant';
import useApproveTenantById from '../hooks/useApproveTenant';
import useResendPaymentTenantById from '../hooks/useResendPaymentTenant';
import { isEmpty } from 'lodash';

const ActionBoard = ({ tenantData }: { tenantData: Tenant }) => {
  const theme = useTheme();

  const { rejectTenantById, isLoading: rejecting } = useRejectTenantById();
  const { approveTenantById, isLoading: approving } = useApproveTenantById();
  const { resendPaymentTenantById, isLoading: resending } =
    useResendPaymentTenantById();

  const shouldShowResendRequest = () => {
    if (isEmpty(tenantData.transactions) && tenantData.requestStatus === 0) {
      return false;
    }
    if (tenantData.transactions && tenantData.subscriptionEndTime) {
      const diffDate = // show resend button when expire time less than 10
        (new Date(tenantData.subscriptionEndTime).getTime() -
          new Date().getTime()) /
        (1000 * 3600 * 24);

      return diffDate < 10;
    }
  };

  return (
    <Paper
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        border: 1,
        borderColor: theme.palette.divider,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Stack direction="row" gap={2}>
        {tenantData.requestStatus !== 0 ? null : (
          <Button
            color="error"
            variant="contained"
            disabled={rejecting || approving || tenantData.requestStatus !== 0}
            onClick={() => {
              rejectTenantById({ id: tenantData.id });
            }}
          >
            Từ chối
          </Button>
        )}
        {tenantData.requestStatus !== 0 ? null : (
          <Button
            color="success"
            variant="contained"
            disabled={rejecting || approving}
            onClick={() => {
              approveTenantById({ id: tenantData.id });
            }}
          >
            Chấp nhận
          </Button>
        )}
        {shouldShowResendRequest() ? (
          <Button
            variant="outlined"
            color="warning"
            disabled={resending}
            onClick={() => resendPaymentTenantById({ id: tenantData.id })}
          >
            Gửi yêu cầu thanh toán
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default ActionBoard;
