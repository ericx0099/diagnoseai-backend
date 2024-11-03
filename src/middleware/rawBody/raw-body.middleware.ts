
import { Response,Request } from 'express';
import { json } from 'body-parser';
//import RequestWithRawBody from '../stripeWebhook/requestWithRawBody.interface';
interface RequestWithRawBody extends Request {
    rawBody: Buffer;
  }
function rawBodyMiddleware() {
  return json({
    verify: (request: RequestWithRawBody, response: Response, buffer: Buffer) => {
      if (request.url === '/payments/succeed' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  })
}
 
export default rawBodyMiddleware