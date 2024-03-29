import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';
import { getVnpUrl } from '../helper';

import TenantService from '../services/tenant.service';

export default class TenantController {
  static getList = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { page, limit, tenantId, name, planName } = req.query;
    const tenantListData = await TenantService.getList({
      params: {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        tenantId: tenantId ? (tenantId as string) : '',
        name: name ? (name as string) : '',
        planName: planName ? (planName as string) : '3-month',
      },
    });

    return res.status(200).json({
      status: true,
      data: tenantListData,
    });
  };

  static registerTenant = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const values = req.body;
      const newTenant = await TenantService.registerTenant(values);

      return res.status(201).json({
        status: true,
        data: newTenant,
      });
    } catch (error) {
      if (error.message?.includes('existed')) {
        if (error.message?.includes('subdomain')) {
          return res.status(400).json({
            status: false,
            message: 'subdomain is existed',
          });
        }

        return res.status(400).json({
          status: false,
          message: 'you already has a school',
        });
      }

      if (error.message?.includes('forbidden')) {
        return res.status(403).json({
          status: false,
          message: 'subdomain is taken',
        });
      }

      if (error.message?.includes('non-existed')) {
        return res.status(400).json({
          status: false,
          message: 'Tenant not existed',
        });
      }

      throw error;
    }
  };

  static rejectById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const newTenant = await TenantService.rejectById(id as string, req);

      return res.status(201).json({
        status: true,
        data: newTenant,
      });
    } catch (error) {
      if (error.message?.includes('non-existed')) {
        return res.status(400).json({
          status: false,
          message: 'Tenant not existed',
        });
      }

      throw error;
    }
  };

  static approveById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const newTenant = await TenantService.approveById(id as string, req);

      return res.status(201).json({
        status: true,
        data: newTenant,
      });
    } catch (error) {
      console.log(error);
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

      if (error.message?.includes('non-existed')) {
        return res.status(400).json({
          status: false,
          message: 'Tenant not existed',
        });
      }

      throw error;
    }
  };

  static resendPaymentById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    try {
      const { id } = req.query;
      const newTenant = await TenantService.resendPaymentById(
        id as string,
        req,
      );

      return res.status(201).json({
        status: true,
        data: newTenant,
      });
    } catch (error) {
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

      if (error.message?.includes('non-existed')) {
        return res.status(400).json({
          status: false,
          message: 'Tenant not existed',
        });
      }

      throw error;
    }
  };

  // Bỏ
  // static create = async (
  //   req: NextApiRequest,
  //   res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  // ) => {
  //   try {
  //     const values = req.body;
  //     const newTenant = await TenantService.create(values);

  //     return res.status(201).json({
  //       status: true,
  //       data: newTenant,
  //     });
  //   } catch (error) {
  //     if (error.message?.includes('existed')) {
  //       if (error.message?.includes('tenantId')) {
  //         return res.status(400).json({
  //           status: false,
  //           message: 'tenantId is existed',
  //         });
  //       }

  //       if (error.message?.includes('subdomain')) {
  //         return res.status(400).json({
  //           status: false,
  //           message: 'subdomain is existed',
  //         });
  //       }
  //     }

  //     if (error.message?.includes('forbidden')) {
  //       return res.status(403).json({
  //         status: false,
  //         message: 'subdomain is taken',
  //       });
  //     }

  //     throw error;
  //   }
  // };

  static getById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { id } = req.query;
    const tenant = await TenantService.getById(id as string);

    return res.status(200).json({
      status: true,
      data: tenant,
    });
  };

  static getBySubdomain = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { subdomain } = req.query;
    const tenant = await TenantService.getBySubdomain(subdomain as string);

    return res.status(200).json({
      status: true,
      data: tenant,
    });
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
    } catch (error) {
      if (error.message?.includes('existed')) {
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

      throw error;
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
    } catch (error) {
      if (error.message?.includes('existed')) {
        return res.status(403).json({
          status: false,
          message: 'tenant is not existed',
        });
      }

      throw error;
    }
  };

  // static activateById = async (
  //   req: NextApiRequest,
  //   res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  // ) => {
  //   try {
  //     const { id } = req.query;
  //     const newTenant = await TenantService.activateById(id as string);

  //     return res.status(201).json({
  //       status: true,
  //       data: newTenant,
  //     });
  //   } catch (error) {
  //     if (error.message?.includes('existed')) {
  //       if (error.message?.includes('tenantId')) {
  //         return res.status(400).json({
  //           status: false,
  //           message: 'tenantId is existed',
  //         });
  //       }

  //       if (error.message?.includes('subdomain')) {
  //         return res.status(400).json({
  //           status: false,
  //           message: 'subdomain is existed',
  //         });
  //       }
  //     }

  //     if (error.message?.includes('forbidden')) {
  //       return res.status(403).json({
  //         status: false,
  //         message: 'subdomain is taken',
  //       });
  //     }

  //     if (error.message?.includes('non-existed')) {
  //       return res.status(400).json({
  //         status: false,
  //         message: 'Tenant not existed',
  //       });
  //     }

  //     throw error;
  //   }
  // };

  // static deactivateById = async (
  //   req: NextApiRequest,
  //   res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  // ) => {
  //   try {
  //     const { id } = req.query;
  //     const newTenant = await TenantService.deactivateById(id as string);

  //     return res.status(201).json({
  //       status: true,
  //       data: newTenant,
  //     });
  //   } catch (error) {
  //     if (error.message?.includes('non-existed')) {
  //       return res.status(400).json({
  //         status: false,
  //         message: 'Tenant not existed',
  //       });
  //     }

  //     throw error;
  //   }
  // };

  static updateVnpayById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { id } = req.query;
    const Tenant = await TenantService.updateVnpayById(id as string, req.body);

    return res.status(200).json({
      status: true,
      data: Tenant,
    });
  };

  static getVnpayById = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const { id } = req.query;
    const data = await TenantService.getVnpayById(id as string);

    return res.status(200).json({
      status: true,
      data,
    });
  };
}
