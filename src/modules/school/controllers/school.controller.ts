import { NextApiRequest, NextApiResponse } from 'next';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/types';
import SchoolService from '../services/school.service';

export default class SchoolController {
  static getSchool = async (
    req: NextApiRequest,
    res: NextApiResponse<ApiSuccessResponse | ApiErrorResponse>,
  ) => {
    const userId = req.headers['tenant-userid'] as string;

    try {
      const school = await SchoolService.getSchool(userId);

      return res.status(200).json({
        status: true,
        data: school,
      });
    } catch (error) {
      if (error.message.includes('school not existed')) {
        return res.status(400).json({
          status: false,
          message:
            'School is not exist or you do not have permission to access the school',
        });
      }

      throw error;
    }
  };
}
