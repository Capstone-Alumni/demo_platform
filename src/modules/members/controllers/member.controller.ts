import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';

import MemberService from '../services/member.service';

export default class MemberController {
  static create = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { email, password, tenantId } = req.body;
      const newClass = await MemberService.create({
        tenantId: tenantId as string,
        email,
        password,
      });

      return res.status(201).json({
        status: true,
        data: newClass,
      });
    } catch (error) {
      if (error.message?.includes('invalid')) {
        return res.status(400).json({
          status: false,
          message: 'Invalid email/password',
        });
      }

      if (error.message?.includes('tenant')) {
        return res.status(400).json({
          status: false,
          message: 'Tenant is not exist',
        });
      }

      throw error;
    }
  };

  static getList = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { tenant_id: tenantId, page, limit, email } = req.query;
      const memberListData = await MemberService.getList({
        tenantId: tenantId as string,
        params: {
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 20,
          email: email ? (email as string) : '',
        },
      });

      return res.status(200).json({
        status: true,
        data: memberListData,
      });
    } catch (error) {
      if (error.message?.includes('tenant')) {
        return res.status(400).json({
          status: false,
          message: 'tenant is not exist',
        });
      }

      throw error;
    }
  };

  // static getById = async (
  //   req: NextApiRequest,
  //   res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  // ) => {
  //   const { id } = req.query;
  //   const classGotten = await MemberService.getById(id as string);

  //   return res.status(200).json({
  //     status: true,
  //     data: classGotten,
  //   });
  // };

  static updateInfoById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { id } = req.query;
    const classUpdated = await MemberService.updateInfoById(
      id as string,
      req.body,
    );

    return res.status(200).json({
      status: true,
      data: classUpdated,
    });
  };

  static deleteById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { id } = req.query;
    const classDeleted = await MemberService.deleteById(id as string);

    return res.status(200).json({
      status: true,
      data: classDeleted,
    });
  };
}
