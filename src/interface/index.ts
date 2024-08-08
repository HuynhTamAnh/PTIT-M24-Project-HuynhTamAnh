export interface IUsers {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  phone: string;
  role: string;
  follower: string;
  following: string;
}
export interface IPosts {
  id: number;
  content: string;
  image: string[];
  reactions: string[];
  userId: number;
  date: string;
  privacy: string;
}
