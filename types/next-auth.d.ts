import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    id: string; // Add id here
  }
  
  interface Session {
    user: {
      id: string; // <--- THIS is what fixes the error
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}