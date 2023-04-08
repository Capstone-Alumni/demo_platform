'use client';

import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import Logo from '../Logo';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.neutral,
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
          paddingY: theme.spacing(4),
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            left: -30,
            zIndex: 0,
            width: 300,
            height: 330,
            clipPath: 'polygon(55% 2%, 89% 53%, 48% 100%, 6% 100%, 17% 25%)',
            backgroundColor: theme.palette.primary.lighter,
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: theme.spacing(4),
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2),
            }}
          >
            <Logo sx={{ zIndex: 1 }} />
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FacebookIcon />}
              >
                Facebook
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LinkedInIcon />}
              >
                LinkedIn
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<InstagramIcon />}
              >
                Instagram
              </Button>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right', maxWidth: '20rem' }}>
            <Typography variant="h6" sx={{ mb: theme.spacing(2) }}>
              Liên hệ chúng tôi
            </Typography>
            <Typography color="GrayText" gutterBottom>
              Lô E2a7, đường D1, khu công nghệ cao, Quận 9, Thành phố Thủ Đức
            </Typography>
            <Typography color="GrayText" gutterBottom>
              Tel: 028 7300 5588
            </Typography>
            <Typography color="GrayText" gutterBottom>
              Fax: 224 095 687
            </Typography>
            <Typography color="GrayText" gutterBottom>
              Email: alumni@alumni.com
            </Typography>
          </Box>

          {/* <Box sx={{ textAlign: 'left', maxWidth: '20rem' }}>
            <Typography variant="h6" sx={{ mb: theme.spacing(2) }}>
              Về dịch vụ
            </Typography>
            <Typography color="GrayText" gutterBottom>
              Các cựu học sinh có thể cập nhật thông tin mới nhất về trường học
              và những người bạn cũ của mình, đăng thông tin về các sự kiện sắp
              diễn ra, gây quỹ cho các hoạt động của trường, tìm kiếm việc làm
              hoặc tuyển dụng nhân sự và tìm kiếm các bạn cũ của mình.
            </Typography>
          </Box> */}
        </Box>

        <Typography color="GrayText" textAlign="center">
          @2023 Alumni Connector platform
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
