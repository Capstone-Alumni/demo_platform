import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';

import TransactionService from '../services/transaction.service';

export default class TransactionController {
  static getList = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { page, limit, tenantName } = req.query;
    const tenantListData = await TransactionService.getList({
      params: {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        tenantName: tenantName ? (tenantName as string) : '',
      },
    });

    return res.status(200).json({
      status: true,
      data: tenantListData,
    });
  };
}
