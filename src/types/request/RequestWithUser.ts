import { Request } from "@nestjs/common";
import { User } from "src/modules/users/schema/users.schema";

export default interface RequestWithUser extends Request {
    user: User
}