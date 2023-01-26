import nc from 'next-connect';

import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';

import TenantController from 'src/modules/tenants/controllers/tenant.controller';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
}).post(TenantController.registerTenant);

export default handler;
