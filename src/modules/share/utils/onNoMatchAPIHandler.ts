import { NextApiRequest, NextApiResponse } from 'next';

export default function onNoMatchAPIHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(404).end('Page is not found');
}
