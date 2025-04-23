
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Define the letters table schema
export const letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  postcode: text("postcode").notNull(),
  issue: text("issue").notNull(),
  customIssue: text("custom_issue"),
  problemShort: text("problem_short").notNull(),
  solutionShort: text("solution_short"),
  constituency: text("constituency").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});