"use server";

import type { Session, User } from "lucia";
import { ActionResult } from "next/dist/server/app-render/types";
import { db } from "@base/src/db";
import { users_table } from "@base/src/db/schema";
import { eq } from "drizzle-orm";
import { lucia } from "@terra/app/auth/lucia";
import { cookies } from "next/headers";
import { cache } from "react";
import { generateStrongToken } from "@terra/lib/utils";

export async function register({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  const exists = await db
    .select()
    .from(users_table)
    .where(eq(users_table.email, email));
  if (exists.length > 0) {
    return {
      status: 400,
      message: "User already exists",
    };
  }

  Bun.password.hash(password).then(async (hashedPassword) => {
    await db.insert(users_table).values({
      email: email,
      hashed_password: hashedPassword,
      name: name,
      token: generateStrongToken(12),
    });
  });

  return {
    status: 200,
    message: "Account successfully created!",
  };
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
    const user = await db
      .select()
      .from(users_table)
      .where(eq(users_table.email, email));

    if (user.length === 0) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const match = await Bun.password.verify(password, user[0].hashed_password);

    if (!match) {
      return {
        status: 401,
        message: "Invalid password",
      };
    } else {
      const session = await lucia.createSession(user[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return {
        status: 200,
        message: "Authenticated successfully!",
      };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
}

export const getSession = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

export async function logout(): Promise<ActionResult> {
  const { session } = await getSession();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
