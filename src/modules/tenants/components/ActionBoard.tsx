import { Button, Paper, Stack, useTheme } from '@mui/material';
import { Tenant } from '../types';
import useRejectTenantById from '../hooks/useRejectTenant';
import useApproveTenantById from '../hooks/useApproveTenant';
import useResendPaymentTenantById from '../hooks/useResendPaymentTenant';

const ActionBoard = ({ tenantData }: { tenantData: Tenant }) => {
  const theme = useTheme();

  const { rejectTenantById, isLoading: rejecting } = useRejectTenantById();
  const { approveTenantById, isLoading: approving } = useApproveTenantById();
  const { resendPaymentTenantById, isLoading: resending } =
    useResendPaymentTenantById();

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
        <Button
          color="success"
          variant="contained"
          disabled={rejecting || approving || tenantData.requestStatus !== 0}
          onClick={() => {
            approveTenantById({ id: tenantData.id });
          }}
        >
          Chấp nhận
        </Button>
        {tenantData.requestStatus === 1 ? (
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
