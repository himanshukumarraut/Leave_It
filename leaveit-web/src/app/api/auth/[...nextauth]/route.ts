import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        employeeId: { label: "Employee ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.employeeId || !credentials?.password) {
          return null;
        }

        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: credentials.employeeId,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          return null;
        }

        const user = await res.json();

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.employeeId = (user as any).employeeId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.employeeId = token.employeeId;
      (session as any).user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };
