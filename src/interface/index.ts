export interface IUsers {
  id: number;
  email: string;
  password: string;
  username: string;
  phone: string;
  role: string;
  avatar: string;
  friends?: Array<{ userId: number; status: boolean; date: string }>;
  notify?: Array<[string, string, string]>; // [userId, message, date]
}
export interface IComment {
  userId: number;
  content: string;
  date: string;
}
export interface IPosts {
  id: number;
  content: string;
  image: string[];
  reactions: string[];
  userId: number;
  date: string;
  privacy: string;
  comments: IComment[];
}
