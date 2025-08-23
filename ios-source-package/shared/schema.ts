import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, real, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const migraines = pgTable("migraines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  severity: integer("severity").notNull(), // 1-10 scale
  triggers: text("triggers").array(),
  symptoms: text("symptoms").array(),
  medications: text("medications").array(),
  notes: text("notes"),
  location: text("location"), // head location
  weather: text("weather"),
  mood: text("mood"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const triggers = pgTable("triggers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // food, stress, environmental, etc.
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // pain, nausea, visual, etc.
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage"),
  type: text("type").notNull(), // preventive, abortive, rescue
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'trigger_analysis', 'pattern_prediction', 'risk_assessment'
  title: text("title").notNull(),
  description: text("description").notNull(),
  data: text("data"), // Additional insight data (JSON string)
  confidence: integer("confidence").default(0), // 0-100
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  predictionType: text("prediction_type").notNull(), // 'risk_spike', 'weather_trigger', 'pattern_alert'
  riskLevel: text("risk_level").notNull(), // 'low', 'medium', 'high'
  description: text("description").notNull(),
  recommendation: text("recommendation"),
  predictedDate: timestamp("predicted_date"),
  accuracy: integer("accuracy").default(0), // Historical accuracy 0-100
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'understanding', 'management', 'prevention', 'treatment'
  contentType: text("content_type").notNull(), // 'article', 'video', 'tip', 'course'
  description: text("description").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  readTime: integer("read_time"), // in minutes
  difficulty: text("difficulty").default('beginner'), // 'beginner', 'intermediate', 'advanced'
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  contentId: integer("content_id").notNull().references(() => educationalContent.id),
  progress: integer("progress").default(0), // 0-100
  completed: boolean("completed").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  name: text("name").notNull(),
  age: integer("age"),
  gender: text("gender"), // 'Male', 'Female', 'Non-binary', 'Prefer not to say'
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"), // YYYY-MM-DD format
  address: text("address"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  avatar: text("avatar"), // Base64 or URL
  migrineFrequency: text("migraine_frequency"), // 'Daily', 'Several times per week', etc.
  appleHealth: boolean("apple_health").default(false),
  googleFit: boolean("google_fit").default(false),
  sleepTracking: boolean("sleep_tracking").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // Date string
  foodData: text("food_data"), // JSON string {photo, barcode, manual}
  headacheData: text("headache_data"), // JSON string {severity, duration}
  triggerData: text("trigger_data"), // JSON string {emotions, activities, medications}
  weatherData: text("weather_data"), // JSON string - External weather data
  moodScore: integer("mood_score"), // 1-10
  sleepHours: integer("sleep_hours"), // in minutes
  stressLevel: integer("stress_level"), // 1-10
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userActivityLog = pgTable("user_activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), 
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const userRiskScores = pgTable("user_risk_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(),
  level: text("level").notNull(),
  message: text("message").notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  source: text("source").notNull(), // 'apple_health', 'fitbit', 'manual'
  dataType: text("data_type").notNull(), // 'heart_rate', 'steps', 'sleep', 'activity'
  value: real("value").notNull(),
  unit: text("unit").notNull(), // 'bpm', 'steps', 'hours', 'minutes'
  recordedAt: timestamp("recorded_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  migraines: many(migraines),
  triggers: many(triggers),
  symptoms: many(symptoms),
  medications: many(medications),
  insights: many(insights),
  predictions: many(predictions),
  userProgress: many(userProgress),
  dailyLogs: many(dailyLogs),
  profile: one(userProfiles),
  activityLogs: many(userActivityLog),
  riskScores: many(userRiskScores),
  notifications: many(notifications),
}));

export const migrainesRelations = relations(migraines, ({ one }) => ({
  user: one(users, {
    fields: [migraines.userId],
    references: [users.id],
  }),
}));

export const triggersRelations = relations(triggers, ({ one }) => ({
  user: one(users, {
    fields: [triggers.userId],
    references: [users.id],
  }),
}));

export const symptomsRelations = relations(symptoms, ({ one }) => ({
  user: one(users, {
    fields: [symptoms.userId],
    references: [users.id],
  }),
}));

export const medicationsRelations = relations(medications, ({ one }) => ({
  user: one(users, {
    fields: [medications.userId],
    references: [users.id],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const insertMigrainSchema = createInsertSchema(migraines).omit({
  id: true,
  createdAt: true,
});

export const insertTriggerSchema = createInsertSchema(triggers).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomSchema = createInsertSchema(symptoms).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Migraine = typeof migraines.$inferSelect;
export type InsertMigraine = z.infer<typeof insertMigrainSchema>;
export type Trigger = typeof triggers.$inferSelect;
export type InsertTrigger = z.infer<typeof insertTriggerSchema>;
export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Insight = typeof insights.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserActivityLog = typeof userActivityLog.$inferSelect;
export type UserRiskScore = typeof userRiskScores.$inferSelect;

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const symptomLogs = pgTable("symptom_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  symptoms: text("symptoms").array().notNull(),
  intensity: integer("intensity").notNull(),
  occurredAt: timestamp("occurred_at").notNull(),
  triggers: text("triggers").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertSymptomLogSchema = createInsertSchema(symptomLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type InsertSymptomLog = z.infer<typeof insertSymptomLogSchema>;
export type SelectSymptomLog = typeof symptomLogs.$inferSelect;

// Food-related tables
export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  barcode: text("barcode").unique(),
  category: text("category").notNull(),
  servingSize: real("serving_size").notNull(),
  servingUnit: text("serving_unit").notNull(),
  caloriesPerServing: real("calories_per_serving").notNull(),
  proteinPerServing: real("protein_per_serving").notNull(),
  carbsPerServing: real("carbs_per_serving").notNull(),
  fatPerServing: real("fat_per_serving").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const foodLogs = pgTable("food_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  foodId: integer("food_id").references(() => foods.id).notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  mealType: text("meal_type").notNull(),
  notes: text("notes"),
  loggedAt: timestamp("logged_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userFoodFavorites = pgTable("user_food_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  foodId: integer("food_id").references(() => foods.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userFoodUnique: uniqueIndex("user_food_unique").on(table.userId, table.foodId),
}));

// Food schema validation
export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true,
  createdAt: true,
});
export const insertFoodLogSchema = createInsertSchema(foodLogs).omit({
  id: true,
  createdAt: true,
});
export const insertUserFoodFavoriteSchema = createInsertSchema(userFoodFavorites).omit({
  id: true,
  createdAt: true,
});

// Food types
export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type FoodLog = typeof foodLogs.$inferSelect;
export type InsertFoodLog = z.infer<typeof insertFoodLogSchema>;
export type UserFoodFavorite = typeof userFoodFavorites.$inferSelect;
export type InsertUserFoodFavorite = z.infer<typeof insertUserFoodFavoriteSchema>;

// Support and Help tables
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  category: text("category").notNull().default("general"), // general, technical, billing, feedback
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const helpResources = pgTable("help_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // user_guide, video_tutorial, community_forum, article
  url: text("url"),
  content: text("content"),
  iconName: text("icon_name"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Support schema validation
export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHelpResourceSchema = createInsertSchema(helpResources).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Support types
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type HelpResource = typeof helpResources.$inferSelect;
export type InsertHelpResource = z.infer<typeof insertHelpResourceSchema>;

// Security Settings table
export const securitySettings = pgTable("security_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  biometricLogin: boolean("biometric_login").default(false).notNull(),
  twoFactorAuth: boolean("two_factor_auth").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Security Settings schema validation
export const insertSecuritySettingsSchema = createInsertSchema(securitySettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Security Settings types
export type SecuritySettings = typeof securitySettings.$inferSelect;
export type InsertSecuritySettings = z.infer<typeof insertSecuritySettingsSchema>;
