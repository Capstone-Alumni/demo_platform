import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: TextFieldProps;
  options: Array<{
    value: string;
    name: string;
  }>;
};

const SelectInput = ({
  control,
  name,
  inputProps,
  options,
}: TextInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField {...inputProps} {...field} select type="select">
          {options?.map(op => (
            <MenuItem key={op.value} value={op.value}>
              {op.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default SelectInput;
