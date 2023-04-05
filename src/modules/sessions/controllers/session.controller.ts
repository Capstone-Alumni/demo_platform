import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';
import SessionService from '../services/session.service';

export default class SessionController {
  static signIn = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const user = await SessionService.signIn(req.body);
      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'sign-in failed') {
        return res.status(400).json({
          status: false,
          message: 'Wrong username or password',
        });
      }

      if (error.message === 'wrong subdomain') {
        return res.status(403).json({
          status: false,
          message: 'You are not allowed to access this page',
        });
      }
      throw error;
    }
  };

  static internalLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const user = await SessionService.internalLogin(req.body);
      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'sign-in failed') {
        return res.status(400).json({
          status: false,
          message: 'Wrong username or password',
        });
      }

      if (error.message === 'denied') {
        return res.status(403).json({
          status: false,
          message: 'You are not allowed to access this page',
        });
      }
      throw error;
    }
  };

  static updatePassword = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      // update
      const user = await SessionService.updatePassword({
        ...req.body,
      });
      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'update-password failed') {
        return res.status(400).json({
          status: false,
          message: 'Người dùng không tồn tại.',
        });
      }

      if (error.message === 'same-password') {
        return res.status(403).json({
          status: false,
          message: 'Không thể đổi mật khẩu mới giống mật khẩu cũ.',
        });
      }

      if (error.message === 'wrong subdomain') {
        return res.status(403).json({
          status: false,
          message: 'You are not allowed to do this action.',
        });
      }

      if (error.message === 'Sai mật khẩu, vui lòng thử lại.') {
        return res.status(403).json({
          status: false,
          message: 'Sai mật khẩu, vui lòng thử lại.',
        });
      }
      throw error;
    }
  };
}
