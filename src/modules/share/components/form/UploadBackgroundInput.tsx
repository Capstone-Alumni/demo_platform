import { setStorage } from '@lib/firebase/methods/setStorage';
import { Control, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import UploadBackground, {
  UploadBackgroundProps,
} from '../upload/UploadBackground';
import uniqid from 'uniqid';
import { Box, FormLabel, SxProps } from '@mui/material';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: Omit<UploadBackgroundProps, 'file'> & {
    label?: string;
  };
  containerSx?: SxProps;
};

const UploadBackgroundInput = ({
  control,
  name,
  inputProps,
  containerSx,
}: TextInputProps) => {
  const handleDrop = async (acceptedFiles: File[]) => {
    const { uploadBackground } = setStorage();
    const file = acceptedFiles[0];
    const toastId = new Date().getMilliseconds();

    try {
      toast.loading('Đang xử lý ảnh...', {
        toastId,
      });
      const url = await uploadBackground(uniqid(), file);

      toast.dismiss(toastId);
      toast.success('Đã xử lý xong');

      return url;
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }

    return null;
  };

  return (
    <Box sx={containerSx}>
      <FormLabel sx={{ ml: 2 }}>{inputProps?.label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <UploadBackground
            // {...field}
            {...inputProps}
            file={field.value}
            onDrop={async files => {
              const url = await handleDrop(files);
              field.onChange(url);
            }}
          />
        )}
      />
    </Box>
  );
};

export default UploadBackgroundInput;
