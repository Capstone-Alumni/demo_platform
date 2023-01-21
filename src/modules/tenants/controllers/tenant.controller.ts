import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';

import TenantService from '../services/tenant.service';

export default class TenantController {
  static getList = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { page, limit, tenantId, name } = req.query;
      const tenantListData = await TenantService.getList({
        params: {
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 20,
          tenantId: tenantId ? (tenantId as string) : '',
          name: name ? (name as string) : '',
        },
      });

      return res.status(200).json({
        status: true,
        data: tenantListData,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };

  static create = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const values = req.body;
      const newTenant = await TenantService.create(values);

      return res.status(201).json({
        status: true,
        data: newTenant,
      });
    } catch (error: any) {
      if (error.message?.includes('existed')) {
        if (error.message?.includes('tenantId')) {
          return res.status(400).json({
            status: false,
            message: 'tenantId is existed',
          });
        }

        if (error.message?.includes('subdomain')) {
          return res.status(400).json({
            status: false,
            message: 'subdomain is existed',
          });
        }
      }

      if (error.message?.includes('forbidden')) {
        return res.status(403).json({
          status: false,
          message: 'subdomain is taken',
        });
      }

      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };

  static getById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const tenant = await TenantService.getById(id as string);

      return res.status(200).json({
        status: true,
        data: tenant,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };

  static getBySubdomain = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { subdomain } = req.query;
      console.log('get subdomain', subdomain);
      const tenant = await TenantService.getBySubdomain(subdomain as string);

      return res.status(200).json({
        status: true,
        data: tenant,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };

  static updateInfoById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const Tenant = await TenantService.updateInfoById(id as string, req.body);

      return res.status(200).json({
        status: true,
        data: Tenant,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };

  static deleteById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const tenant = await TenantService.deleteById(id as string);

      return res.status(200).json({
        status: true,
        data: tenant,
      });
    } catch (error: any) {
      if (error.message?.includes('existed')) {
        return res.status(403).json({
          status: false,
          message: 'tenant is not existed',
        });
      }

      return res.status(500).json({
        status: false,
        message: error as string,
      });
    }
  };
}
