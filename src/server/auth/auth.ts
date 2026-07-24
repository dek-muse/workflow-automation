import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/server/database/client";
import { env } from "@/config/env";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [Credentials({ credentials: { email: {}, password: {} }, async authorize(raw) {
    const parsed = credentialsSchema.safeParse(raw);
    if (!parsed.success) return null;

    try {
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (!user?.passwordHash) return null;
      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      return valid ? { id: user.id, email: user.email, name: user.name, image: user.image } : null;
    } catch (error) {
      console.error("Credentials authorization failed", error);
      return null;
    }
  }})],
  pages: { signIn: "/login" }
});