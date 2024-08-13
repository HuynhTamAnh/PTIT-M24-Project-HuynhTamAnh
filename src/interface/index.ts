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
export interface GroupMember {
  userId: number;
  role: boolean;
  dateJoin: string;
}

export interface GroupPost {
  idPostGroup: number;
  userId: number;
  content: string;
  img: string[];
  dateat: string;
}

export interface Group {
  id: number;
  groupName: string;
  dateAt: string;
  avatar: string;
  // coverimg: string;
  status: boolean;
  members: GroupMember[];
  postGroup: GroupPost[];
}
