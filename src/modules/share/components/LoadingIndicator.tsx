import { Backdrop } from '@mui/material';
import Image from 'next/image';

const LoadingIndicator = () => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
      open
    >
      <Image
        height={100}
        width={100}
        src="/dual-ball-loading.gif"
        alt="loading"
      />
    </Backdrop>
  );
};

export default LoadingIndicator;
