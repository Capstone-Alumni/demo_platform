import onErrorAPIHandler from '@share/utils/onErrorAPIHandler';
import onNoMatchAPIHandler from '@share/utils/onNoMatchAPIHandler';
import nc from 'next-connect';
import MemberController from 'src/modules/members/controllers/member.controller';

const handler = nc({
  onError: onErrorAPIHandler,
  onNoMatch: onNoMatchAPIHandler,
})
  // .get(MemberController.getById)
  .put(MemberController.updateInfoById)
  .delete(MemberController.deleteById);

export default handler;
