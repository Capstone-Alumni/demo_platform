import { TextField, TextFieldProps } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: TextFieldProps;
};

const TextInput = ({ control, name, inputProps }: TextInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...inputProps}
          {...field}
          error={Boolean(error?.message)}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default TextInput;
