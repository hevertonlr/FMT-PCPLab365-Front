import { Profile } from '../enums/profile';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  image: string;
  profile: Profile;
}
