import { setStorage } from '@lib/firebase/methods/setStorage';
import { Control, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import UploadAvatar, { UploadAvatarProps } from '../upload/UploadAvatar';
import uniqid from 'uniqid';
import { Box, FormLabel, Typography } from '@mui/material';
import { SxProps } from '@mui/material';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: Omit<UploadAvatarProps, 'file'> & {
    label?: string;
  };
  containerSx?: SxProps;
};

const UploadAvatarInput = ({
  control,
  name,
  inputProps,
  containerSx,
}: TextInputProps) => {
  const handleDrop = async (acceptedFiles: File[]) => {
    const { uploadAvatar } = setStorage();
    const file = acceptedFiles[0];
    const toastId = new Date().getMilliseconds();

    try {
      toast.loading('Đang xử lý ảnh...', {
        toastId,
      });
      const url = await uploadAvatar(uniqid(), file);

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
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <FormLabel sx={{ ml: 2 }} error={!!error}>
              {inputProps?.label}
            </FormLabel>
            <UploadAvatar
              // {...field}
              {...inputProps}
              file={field.value}
              onDrop={async files => {
                const url = await handleDrop(files);
                field.onChange(url);
              }}
              error={!!error}
            />
            {error ? (
              <Typography color="error" variant="body2">
                {error.message}
              </Typography>
            ) : null}
          </>
        )}
      />
    </Box>
  );
};

export default UploadAvatarInput;
