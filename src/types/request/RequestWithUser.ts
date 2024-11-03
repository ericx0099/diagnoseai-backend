import { Request } from "@nestjs/common";
import { User, UserDocument } from "src/modules/users/schema/users.schema";

export default interface RequestWithUser extends Request {
    user: UserDocument;
}