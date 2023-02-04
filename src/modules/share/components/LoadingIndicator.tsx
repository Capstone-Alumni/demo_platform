import { Box } from '@mui/material';
import Image from 'next/image';

const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image
        height={100}
        width={100}
        src="/dual-ball-loading.gif"
        alt="loading"
      />
    </Box>
  );
};

export default LoadingIndicator;
