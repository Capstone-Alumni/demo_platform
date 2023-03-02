'use-client';

import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
// @mui
import { styled, SxProps } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import EditorToolbar, {
  formats,
  redoChange,
  undoChange,
} from './EditorToolbar';
import { Typography } from '@mui/material';
import { useMemo, useRef } from 'react';
import { setStorage } from '@lib/firebase/methods/setStorage';
import { toast } from 'react-toastify';
import uniqid from 'uniqid';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
  '& .ql-container.ql-snow': {
    borderColor: 'transparent',
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    minHeight: 200,
    '&.ql-blank::before': {
      fontStyle: 'normal',
      color: theme.palette.text.disabled,
    },
    '& pre.ql-syntax': {
      ...theme.typography.body2,
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

// ----------------------------------------------------------------------

Editor.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.node,
  simple: PropTypes.bool,
  sx: PropTypes.object,
};

export type EditorProps = {
  id: string;
  value: string;
  onChange: any;
  error?: boolean;
  helperText?: any;
  simple?: boolean;
  sx?: any;
  placeholder?: string;
  containerSx?: SxProps;
};

export default function Editor({
  id,
  error,
  value,
  onChange,
  simple,
  helperText,
  placeholder,
  sx,
  containerSx,
  ...other
}: EditorProps) {
  const quillRef = useRef<null | ReactQuill>(null);

  const handleDrop = async (acceptedFiles: File[]) => {
    const { uploadAvatar } = setStorage();
    if (!acceptedFiles?.[0]) {
      return null;
    }
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

  const imageChange = async () => {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const files: any = input && input.files ? input.files : [];

      const url = await handleDrop(files);

      const quillObj = quillRef.current?.getEditor();
      const range = quillObj?.getSelection();
      quillObj?.editor.insertEmbed(range?.index, 'image', url);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: `#${id}`,
        handlers: {
          undo: undoChange,
          redo: redoChange,
          image: imageChange,
        },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  return (
    <Box sx={containerSx}>
      <RootStyle
        sx={{
          ...(error && {
            border: theme => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          {...other}
        />
      </RootStyle>
      <Typography color={error ? 'error' : 'none'}>
        {helperText && helperText}
      </Typography>
    </Box>
  );
}
