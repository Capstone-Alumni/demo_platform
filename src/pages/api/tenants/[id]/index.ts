import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import TenantController from 'src/modules/tenants/controllers/tenant.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return TenantController.getById(req, res);
    case 'PUT':
      return TenantController.updateInfoById(req, res);
    case 'DELETE':
      return TenantController.deleteById(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
