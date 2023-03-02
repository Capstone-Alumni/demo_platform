import { Control, Controller } from 'react-hook-form';
import Editor, { EditorProps } from '../editor';

type RichTextInputProps = {
  control: Control;
  name: string;
  inputProps?: Omit<EditorProps, 'id' | 'value' | 'onChange'>;
};

const RichTextInput = ({ control, name, inputProps }: RichTextInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <Editor
            id={`richteaxt-${name}`}
            value={value}
            onChange={onChange}
            {...inputProps}
            error={Boolean(error?.message)}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};

export default RichTextInput;
