import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import TenantController from 'src/modules/tenants/controllers/tenant.controller';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return TenantController.getBySubdomain(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
