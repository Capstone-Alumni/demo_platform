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
      console.log('internal login controller', req);
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
}
