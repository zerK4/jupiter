import { type InferSelectModel, relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 } from "uuid";

export const users_table = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => v4()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hashed_password: text("hashed_password").notNull(),
  avatar_url: text("avatar_url"),
  username: text("username"),
  databaseName: text("database_name"),
  databaseToken: text("database_token"),
  token: text("token"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at"),
});

export type UserType = InferSelectModel<typeof users_table>;
