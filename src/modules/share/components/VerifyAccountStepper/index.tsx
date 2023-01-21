// material
import { Paper, Stack } from '@mui/material';

import VerticalLinearStepper from './VerticalLinearStepper';
import { steps } from './constants';

// ----------------------------------------------------------------------

export default function StepperComponent() {
  return (
    <Stack spacing={1}>
      <Paper
        sx={{
          width: '100%',
          boxShadow: theme => theme.customShadows.z8,
        }}
      >
        <VerticalLinearStepper steps={steps} />
      </Paper>
    </Stack>
  );
}
