    import type { NextAuthOptions } from "next-auth";
    import GoogleProvider from "next-auth/providers/google";
    import { dbconnect } from "@/lib/db";
    import User from "@/models/User";

    export const authOptions: NextAuthOptions = {
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            }),
        ],
        session: { strategy: "jwt" },

        callbacks: {
            async signIn({ user }) {
                await dbconnect();

                // check if user exists
                const existing = await User.findOne({ email: user.email });

                if (!existing) {
                    // create new user
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                    });
                }

                return true;
            },

            async jwt({ token, user }) {
                if (user) {
                    // ensure we load user.id from DB
                    await dbconnect();
                    const dbUser = await User.findOne({ email: user.email });
                    token.id = dbUser?._id.toString();
                }
                return token;
            },

            async session({ session, token }) {
                if (session.user) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (session.user as any).id = token.id;
                }
                return session;
            },
        },

        secret: process.env.NEXTAUTH_SECRET,
    };
