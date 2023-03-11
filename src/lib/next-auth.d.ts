import 'next-auth';

// Allows us to alter the types in the next-auth library
declare module 'next-auth' {
  interface Session {
    user: User;
  }

  //  Automatically extends the existing User interface from the next-auth library
  interface User {
    id: string;
    username: string;
    image: string;
  }
}
