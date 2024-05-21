import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { users_table } from "./users";

export const session_table = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const sessionRelations = relations(session_table, ({ one }) => ({
  user: one(users_table, {
    fields: [session_table.userId],
    references: [users_table.id],
    relationName: "user_relation",
  }),
}));

export type SessionType = InferSelectModel<typeof session_table>;
