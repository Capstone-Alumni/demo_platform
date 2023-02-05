import nc from 'next-connect';

import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';

import SchoolController from 'src/modules/school/controllers/school.controller';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
}).get(SchoolController.getSchool);

export default handler;
