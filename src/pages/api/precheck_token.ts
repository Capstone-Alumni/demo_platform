import nc from 'next-connect';

import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';

import SessionController from 'src/modules/sessions/controllers/session.controller';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
}).get(SessionController.precheckAlumniToken);

export default handler;
