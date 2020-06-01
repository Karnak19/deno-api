interface User {
  id: string;
  name: string;
  photo: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

const DB = {
  users: new Map<string, User>(),
  posts: new Map<string, Post>(),
};

export default DB;
