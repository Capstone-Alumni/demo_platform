import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';

type TextInputProps = {
  control: Control;
  name: string;
  inputProps?: CheckboxProps & {
    label: string;
  };
};

const Checkbox = ({ control, name, inputProps }: TextInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControlLabel
          control={<MuiCheckbox {...field} {...inputProps} />}
          label={inputProps?.label}
        />
      )}
    />
  );
};

export default Checkbox;
