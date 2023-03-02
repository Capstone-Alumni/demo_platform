import { isString } from 'lodash';
import { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import roundAddAPhoto from '@iconify/icons-ic/round-add-a-photo';
// material
import { alpha, styled, SxProps, Theme } from '@mui/material';
import { Box, Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  borderRadius: '0.5rem',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  height: 144,
  minWidth: 144,
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '0.5rem',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

interface CustomFile extends File {
  path?: string;
  preview?: string;
}

export interface UploadBackgroundProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile | string | null;
  caption?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function UploadBackground({
  error,
  file,
  caption,
  sx,
  ...other
}: UploadBackgroundProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    accept: {
      'image/jpeg': ['.jpeg', '.png'],
    },
    ...other,
  });

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        my: 2,
        borderColor: 'error.light',
        bgcolor: theme => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size }: CustomFile = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size}
            </Typography>
            {errors.map(e => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <>
      <RootStyle sx={sx}>
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: 'error.main',
              borderColor: 'error.light',
              bgcolor: 'error.lighter',
            }),
          }}
        >
          <input {...getInputProps()} />

          {file && (
            <Box
              component="img"
              alt="BackUploadBackground"
              src={isString(file) ? file : file.preview}
              sx={{ zIndex: 8, objectFit: 'cover' }}
            />
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: 'common.white',
                bgcolor: 'grey.900',
                '&:hover': { opacity: 0.72 },
              }),
            }}
          >
            <Box
              component={Icon}
              icon={roundAddAPhoto}
              sx={{ width: 24, height: 24, mb: 1 }}
            />
            <Typography variant="caption">
              {file ? 'Cập nhập' : 'Tải ảnh lên'}
            </Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {caption}

      {fileRejections.length > 0 && <ShowRejectionItems />}
    </>
  );
}
