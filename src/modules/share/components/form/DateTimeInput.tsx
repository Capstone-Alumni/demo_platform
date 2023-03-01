import { TextField, TextFieldProps } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Control, Controller } from 'react-hook-form';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: TextFieldProps;
};

const DateTimeInput = ({ control, name, inputProps }: TextInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DateTimePicker
          {...field}
          label={inputProps?.label}
          renderInput={params => <TextField {...params} {...inputProps} />}
        />
      )}
    />
  );
};

export default DateTimeInput;
