'use-client';

import ReactQuill from 'react-quill';
// @mui
import { styled, SxProps } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import { formats } from './EditorToolbar';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  '& .ql-toolbar': {
    display: 'none',
  },
  '& .ql-container.ql-snow': {
    borderColor: 'transparent',
    ...theme.typography.body1,
    fontFamily: theme.typography.fontFamily,
  },
  '& .ql-editor': {
    padding: 0,
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

export type EditorPreviewProps = {
  value: string;
  sx?: SxProps;
};

export default function EditorPreview({ value, sx }: EditorPreviewProps) {
  return (
    <RootStyle
      sx={{
        ...sx,
      }}
    >
      <ReactQuill readOnly value={value} formats={formats} />
    </RootStyle>
  );
}
