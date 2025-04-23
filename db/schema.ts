const { pgTable, serial, text, timestamp } = require("drizzle-orm/pg-core");

exports.letters = pgTable("letters", {
  id: serial("id").primaryKey(),
  postcode: text("postcode").notNull(),
  issue: text("issue").notNull(),
  customIssue: text("custom_issue"),
  problemShort: text("problem_short").notNull(),
  solutionShort: text("solution_short"),
  constituency: text("constituency").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});