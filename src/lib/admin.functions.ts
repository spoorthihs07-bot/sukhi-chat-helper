import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ email: z.string().email(), password: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { anonClient, ADMIN_EMAIL } = await import("./supabase-ext.server");
    if (data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("This account is not authorised for the admin dashboard.");
    }
    const { data: session, error } = await anonClient().auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error || !session.session) throw new Error(error?.message ?? "Login failed");
    return {
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      expires_at: session.session.expires_at ?? null,
      email: session.user?.email ?? data.email,
    };
  });

export const adminMe = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { verifyAdminToken } = await import("./supabase-ext.server");
    const user = await verifyAdminToken(data.token);
    return { email: user.email, id: user.id };
  });
