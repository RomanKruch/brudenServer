import { User } from '../users/users.schema';

export interface UserRequest extends Request {
  user: User;
}
