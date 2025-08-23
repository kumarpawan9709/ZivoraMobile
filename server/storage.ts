import { users, migraines, triggers, symptoms, medications, insights, predictions, educationalContent, userProgress, dailyLogs, userProfiles, userActivityLog, userRiskScores, symptomLogs, foods, foodLogs, userFoodFavorites, notifications, supportTickets, faqs, helpResources, securitySettings, type User, type InsertUser, type Migraine, type InsertMigraine, type Trigger, type InsertTrigger, type Symptom, type InsertSymptom, type Medication, type InsertMedication, type Insight, type Prediction, type EducationalContent, type UserProgress, type DailyLog, type UserProfile, type InsertUserProfile, type UserActivityLog, type UserRiskScore, type Food, type InsertFood, type FoodLog, type InsertFoodLog, type UserFoodFavorite, type InsertUserFoodFavorite, type SupportTicket, type InsertSupportTicket, type Faq, type InsertFaq, type HelpResource, type InsertHelpResource, type SecuritySettings, type InsertSecuritySettings } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Migraine methods
  getMigraines(userId: number): Promise<Migraine[]>;
  getMigraine(id: number): Promise<Migraine | undefined>;
  createMigraine(migraine: InsertMigraine): Promise<Migraine>;
  updateMigraine(id: number, migraine: Partial<InsertMigraine>): Promise<Migraine | undefined>;
  deleteMigraine(id: number): Promise<boolean>;
  
  // Trigger methods
  getTriggers(userId: number): Promise<Trigger[]>;
  createTrigger(trigger: InsertTrigger): Promise<Trigger>;
  updateTrigger(id: number, trigger: Partial<InsertTrigger>): Promise<Trigger | undefined>;
  deleteTrigger(id: number): Promise<boolean>;
  
  // Symptom methods
  getSymptoms(userId: number): Promise<Symptom[]>;
  createSymptom(symptom: InsertSymptom): Promise<Symptom>;
  updateSymptom(id: number, symptom: Partial<InsertSymptom>): Promise<Symptom | undefined>;
  deleteSymptom(id: number): Promise<boolean>;
  
  // Medication methods
  getMedications(userId: number): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;
  
  // Insight methods
  getInsights(userId: number): Promise<Insight[]>;
  createInsight(insight: Omit<Insight, 'id' | 'createdAt'>): Promise<Insight>;
  
  // Prediction methods
  getPredictions(userId: number): Promise<Prediction[]>;
  createPrediction(prediction: Omit<Prediction, 'id' | 'createdAt'>): Promise<Prediction>;
  markPredictionAsRead(id: number): Promise<boolean>;
  
  // Educational content methods
  getEducationalContent(category?: string): Promise<EducationalContent[]>;
  getEducationalCategories(): Promise<string[]>;
  getUserProgress(userId: number): Promise<UserProgress[]>;
  updateUserProgress(userId: number, contentId: number, progress: number): Promise<UserProgress>;
  getRecentlyViewedContent(userId: number): Promise<EducationalContent[]>;
  markContentAsViewed(userId: number, contentId: number): Promise<void>;
  
  // Daily log methods
  getDailyLogs(userId: number, dateRange?: { start: string; end: string }): Promise<DailyLog[]>;
  getDailyLogByDate(userId: number, date: string): Promise<DailyLog | undefined>;
  createDailyLog(dailyLog: Omit<DailyLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyLog>;
  updateDailyLog(id: number, dailyLog: Partial<DailyLog>): Promise<DailyLog | undefined>;
  createOrUpdateDailyLog(userId: number, date: string, logData: Partial<DailyLog>): Promise<DailyLog>;
  
  // User profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Activity log methods
  getUserActivityLog(userId: number, limit?: number): Promise<UserActivityLog[]>;
  createActivityLog(userId: number, type: string, description: string, icon: string): Promise<UserActivityLog>;
  
  // Risk score methods
  getUserRiskScore(userId: number): Promise<UserRiskScore | undefined>;
  createOrUpdateRiskScore(userId: number, score: number, level: string, message: string): Promise<UserRiskScore>;
  
  // Notification methods
  getUserNotifications(userId: number): Promise<any[]>;
  createNotification(userId: number, title: string, message: string): Promise<any>;
  markNotificationsAsRead(userId: number): Promise<boolean>;
  
  // Symptom logs
  createSymptomLog(symptomLog: Omit<any, 'id' | 'createdAt'>): Promise<any>;
  getSymptomLogs(userId: number): Promise<any[]>;
  
  // Food methods
  searchFoods(query: string): Promise<Food[]>;
  getFoodByBarcode(barcode: string): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  getFoodById(id: number): Promise<Food | undefined>;
  
  // Food log methods
  createFoodLog(foodLog: InsertFoodLog): Promise<FoodLog>;
  getUserFoodLogs(userId: number, limit?: number): Promise<(FoodLog & { food: Food })[]>;
  getFoodLogsByDate(userId: number, date: string): Promise<(FoodLog & { food: Food })[]>;
  
  // User food favorites
  getUserFoodFavorites(userId: number): Promise<(UserFoodFavorite & { food: Food })[]>;
  addFoodToFavorites(userId: number, foodId: number): Promise<UserFoodFavorite>;
  removeFoodFromFavorites(userId: number, foodId: number): Promise<boolean>;
  
  // Security settings methods
  getSecuritySettings(userId: number): Promise<SecuritySettings | null>;
  updateSecuritySettings(userId: number, updates: Partial<InsertSecuritySettings>): Promise<SecuritySettings>;
  createSecuritySettings(settings: InsertSecuritySettings): Promise<SecuritySettings>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Migraine methods
  async getMigraines(userId: number): Promise<Migraine[]> {
    return await db.select().from(migraines).where(eq(migraines.userId, userId));
  }

  async getMigraine(id: number): Promise<Migraine | undefined> {
    const [migraine] = await db.select().from(migraines).where(eq(migraines.id, id));
    return migraine || undefined;
  }

  async createMigraine(migraine: InsertMigraine): Promise<Migraine> {
    const [newMigraine] = await db
      .insert(migraines)
      .values(migraine)
      .returning();
    return newMigraine;
  }

  async updateMigraine(id: number, migraine: Partial<InsertMigraine>): Promise<Migraine | undefined> {
    const [updatedMigraine] = await db
      .update(migraines)
      .set(migraine)
      .where(eq(migraines.id, id))
      .returning();
    return updatedMigraine || undefined;
  }

  async deleteMigraine(id: number): Promise<boolean> {
    const result = await db.delete(migraines).where(eq(migraines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Trigger methods
  async getTriggers(userId: number): Promise<Trigger[]> {
    return await db.select().from(triggers).where(eq(triggers.userId, userId));
  }

  async createTrigger(trigger: InsertTrigger): Promise<Trigger> {
    const [newTrigger] = await db
      .insert(triggers)
      .values(trigger)
      .returning();
    return newTrigger;
  }

  async updateTrigger(id: number, trigger: Partial<InsertTrigger>): Promise<Trigger | undefined> {
    const [updatedTrigger] = await db
      .update(triggers)
      .set(trigger)
      .where(eq(triggers.id, id))
      .returning();
    return updatedTrigger || undefined;
  }

  async deleteTrigger(id: number): Promise<boolean> {
    const result = await db.delete(triggers).where(eq(triggers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Symptom methods
  async getSymptoms(userId: number): Promise<Symptom[]> {
    return await db.select().from(symptoms).where(eq(symptoms.userId, userId));
  }

  async createSymptom(symptom: InsertSymptom): Promise<Symptom> {
    const [newSymptom] = await db
      .insert(symptoms)
      .values(symptom)
      .returning();
    return newSymptom;
  }

  async updateSymptom(id: number, symptom: Partial<InsertSymptom>): Promise<Symptom | undefined> {
    const [updatedSymptom] = await db
      .update(symptoms)
      .set(symptom)
      .where(eq(symptoms.id, id))
      .returning();
    return updatedSymptom || undefined;
  }

  async deleteSymptom(id: number): Promise<boolean> {
    const result = await db.delete(symptoms).where(eq(symptoms.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return await db.select().from(medications).where(eq(medications.userId, userId));
  }

  async createMedication(medication: InsertMedication): Promise<Medication> {
    const [newMedication] = await db
      .insert(medications)
      .values(medication)
      .returning();
    return newMedication;
  }

  async updateMedication(id: number, medication: Partial<InsertMedication>): Promise<Medication | undefined> {
    const [updatedMedication] = await db
      .update(medications)
      .set(medication)
      .where(eq(medications.id, id))
      .returning();
    return updatedMedication || undefined;
  }

  async deleteMedication(id: number): Promise<boolean> {
    const result = await db.delete(medications).where(eq(medications.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Insight methods
  async getInsights(userId: number): Promise<Insight[]> {
    return await db.select().from(insights).where(eq(insights.userId, userId));
  }

  async createInsight(insight: Omit<Insight, 'id' | 'createdAt'>): Promise<Insight> {
    const [newInsight] = await db
      .insert(insights)
      .values(insight)
      .returning();
    return newInsight;
  }

  // Prediction methods
  async getPredictions(userId: number): Promise<Prediction[]> {
    return await db.select().from(predictions).where(eq(predictions.userId, userId));
  }

  async createPrediction(prediction: Omit<Prediction, 'id' | 'createdAt'>): Promise<Prediction> {
    const [newPrediction] = await db
      .insert(predictions)
      .values(prediction)
      .returning();
    return newPrediction;
  }

  async markPredictionAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(predictions)
      .set({ isRead: true })
      .where(eq(predictions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Educational content methods
  async getEducationalContent(category?: string): Promise<EducationalContent[]> {
    if (category && category !== 'All Topics') {
      return await db.select().from(educationalContent).where(eq(educationalContent.category, category));
    }
    return await db.select().from(educationalContent).where(eq(educationalContent.isPublished, true));
  }

  async getEducationalCategories(): Promise<string[]> {
    const result = await db.select({ category: educationalContent.category })
      .from(educationalContent)
      .where(eq(educationalContent.isPublished, true))
      .groupBy(educationalContent.category);
    return result.map(r => r.category);
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getRecentlyViewedContent(userId: number): Promise<EducationalContent[]> {
    const recentProgress = await db
      .select({
        content: educationalContent
      })
      .from(userProgress)
      .innerJoin(educationalContent, eq(userProgress.contentId, educationalContent.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(userProgress.lastAccessed)
      .limit(5);
    
    return recentProgress.map(rp => rp.content);
  }

  async markContentAsViewed(userId: number, contentId: number): Promise<void> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.contentId, contentId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userProgress)
        .set({ lastAccessed: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.contentId, contentId)));
    } else {
      await db
        .insert(userProgress)
        .values({
          userId,
          contentId,
          progress: 0,
          completed: false,
          lastAccessed: new Date()
        });
    }
  }

  async updateUserProgress(userId: number, contentId: number, progress: number): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.contentId, contentId)));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({ 
          progress, 
          completed: progress >= 100,
          lastAccessed: new Date()
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          contentId,
          progress,
          completed: progress >= 100
        })
        .returning();
      return newProgress;
    }
  }

  // Daily log methods
  async getDailyLogs(userId: number, dateRange?: { start: string; end: string }): Promise<DailyLog[]> {
    let query = db.select().from(dailyLogs).where(eq(dailyLogs.userId, userId));
    
    if (dateRange) {
      query = query.where(
        and(
          gte(dailyLogs.date, dateRange.start),
          lte(dailyLogs.date, dateRange.end)
        )
      );
    }
    
    return await query;
  }

  async createDailyLog(dailyLog: Omit<DailyLog, 'id' | 'createdAt'>): Promise<DailyLog> {
    const [newLog] = await db
      .insert(dailyLogs)
      .values(dailyLog)
      .returning();
    return newLog;
  }

  async updateDailyLog(id: number, dailyLog: Partial<DailyLog>): Promise<DailyLog | undefined> {
    const [updatedLog] = await db
      .update(dailyLogs)
      .set(dailyLog)
      .where(eq(dailyLogs.id, id))
      .returning();
    return updatedLog || undefined;
  }

  async getDailyLogByDate(userId: number, date: string): Promise<DailyLog | undefined> {
    const [log] = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, date)));
    return log || undefined;
  }

  async createOrUpdateDailyLog(userId: number, date: string, logData: any): Promise<DailyLog> {
    const existingLog = await this.getDailyLogByDate(userId, date);
    
    if (existingLog) {
      // Update existing log
      const [updatedLog] = await db
        .update(dailyLogs)
        .set(logData)
        .where(eq(dailyLogs.id, existingLog.id))
        .returning();
      return updatedLog;
    } else {
      // Create new log
      const [newLog] = await db
        .insert(dailyLogs)
        .values({
          userId,
          date,
          ...logData,
        })
        .returning();
      return newLog;
    }
  }

  // User profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile || undefined;
  }

  // Activity log methods
  async getUserActivityLog(userId: number, limit: number = 3): Promise<UserActivityLog[]> {
    const activities = await db
      .select()
      .from(userActivityLog)
      .where(eq(userActivityLog.userId, userId))
      .orderBy(userActivityLog.timestamp)
      .limit(limit);
    return activities;
  }

  async createActivityLog(userId: number, type: string, description: string, icon: string): Promise<UserActivityLog> {
    const [activity] = await db
      .insert(userActivityLog)
      .values({
        userId,
        type,
        description,
        icon
      })
      .returning();
    return activity;
  }

  // Risk score methods
  async getUserRiskScore(userId: number): Promise<UserRiskScore | undefined> {
    const [riskScore] = await db
      .select()
      .from(userRiskScores)
      .where(eq(userRiskScores.userId, userId))
      .orderBy(userRiskScores.updatedAt)
      .limit(1);
    return riskScore || undefined;
  }

  async createOrUpdateRiskScore(userId: number, score: number, level: string, message: string): Promise<UserRiskScore> {
    const existing = await this.getUserRiskScore(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userRiskScores)
        .set({
          score,
          level,
          message,
          updatedAt: new Date()
        })
        .where(eq(userRiskScores.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userRiskScores)
        .values({
          userId,
          score,
          level,
          message
        })
        .returning();
      return created;
    }
  }

  // Notification methods
  async getUserNotifications(userId: number): Promise<any[]> {
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);
    return userNotifications;
  }

  async createNotification(userId: number, title: string, message: string): Promise<any> {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        isRead: false
      })
      .returning();
    return notification;
  }

  async markNotificationsAsRead(userId: number): Promise<boolean> {
    try {
      const result = await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      return false;
    }
  }

  // Symptom log methods
  async createSymptomLog(symptomLogData: any): Promise<any> {
    const [created] = await db.insert(symptomLogs).values(symptomLogData).returning();
    return created;
  }

  async getSymptomLogs(userId: number): Promise<any[]> {
    return await db.select().from(symptomLogs)
      .where(eq(symptomLogs.userId, userId))
      .orderBy(desc(symptomLogs.occurredAt));
  }

  async getSymptomLogById(id: number): Promise<any | null> {
    const [log] = await db.select().from(symptomLogs).where(eq(symptomLogs.id, id));
    return log || null;
  }

  async updateSymptomLog(id: number, updates: any): Promise<any> {
    const [updated] = await db.update(symptomLogs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(symptomLogs.id, id))
      .returning();
    return updated;
  }

  async deleteSymptomLog(id: number): Promise<void> {
    await db.delete(symptomLogs).where(eq(symptomLogs.id, id));
  }

  // Food methods
  async searchFoods(query: string): Promise<Food[]> {
    const searchResults = await db.select().from(foods)
      .where(sql`lower(${foods.name}) LIKE lower(${'%' + query + '%'})`)
      .limit(20);
    return searchResults;
  }

  async getFoodByBarcode(barcode: string): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.barcode, barcode));
    return food;
  }

  async createFood(food: InsertFood): Promise<Food> {
    const [newFood] = await db.insert(foods).values(food).returning();
    return newFood;
  }

  async getFoodById(id: number): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.id, id));
    return food;
  }

  // Food log methods
  async createFoodLog(foodLog: InsertFoodLog): Promise<FoodLog> {
    const [newFoodLog] = await db.insert(foodLogs).values(foodLog).returning();
    return newFoodLog;
  }

  async getUserFoodLogs(userId: number, limit: number = 10): Promise<(FoodLog & { food: Food })[]> {
    const logs = await db.select({
      id: foodLogs.id,
      userId: foodLogs.userId,
      foodId: foodLogs.foodId,
      quantity: foodLogs.quantity,
      unit: foodLogs.unit,
      mealType: foodLogs.mealType,
      notes: foodLogs.notes,
      loggedAt: foodLogs.loggedAt,
      createdAt: foodLogs.createdAt,
      food: foods
    })
    .from(foodLogs)
    .leftJoin(foods, eq(foodLogs.foodId, foods.id))
    .where(eq(foodLogs.userId, userId))
    .orderBy(desc(foodLogs.loggedAt))
    .limit(limit);
    
    return logs.map(log => ({
      ...log,
      food: log.food!
    }));
  }

  async getFoodLogsByDate(userId: number, date: string): Promise<(FoodLog & { food: Food })[]> {
    const logs = await db.select({
      id: foodLogs.id,
      userId: foodLogs.userId,
      foodId: foodLogs.foodId,
      quantity: foodLogs.quantity,
      unit: foodLogs.unit,
      mealType: foodLogs.mealType,
      notes: foodLogs.notes,
      loggedAt: foodLogs.loggedAt,
      createdAt: foodLogs.createdAt,
      food: foods
    })
    .from(foodLogs)
    .leftJoin(foods, eq(foodLogs.foodId, foods.id))
    .where(and(
      eq(foodLogs.userId, userId),
      sql`DATE(${foodLogs.loggedAt}) = ${date}`
    ))
    .orderBy(desc(foodLogs.loggedAt));
    
    return logs.map(log => ({
      ...log,
      food: log.food!
    }));
  }

  // User food favorites
  async getUserFoodFavorites(userId: number): Promise<(UserFoodFavorite & { food: Food })[]> {
    const favorites = await db.select({
      id: userFoodFavorites.id,
      userId: userFoodFavorites.userId,
      foodId: userFoodFavorites.foodId,
      createdAt: userFoodFavorites.createdAt,
      food: foods
    })
    .from(userFoodFavorites)
    .leftJoin(foods, eq(userFoodFavorites.foodId, foods.id))
    .where(eq(userFoodFavorites.userId, userId))
    .orderBy(desc(userFoodFavorites.createdAt));
    
    return favorites.map(fav => ({
      ...fav,
      food: fav.food!
    }));
  }

  async addFoodToFavorites(userId: number, foodId: number): Promise<UserFoodFavorite> {
    const [favorite] = await db.insert(userFoodFavorites).values({
      userId,
      foodId
    }).returning();
    return favorite;
  }

  async removeFoodFromFavorites(userId: number, foodId: number): Promise<boolean> {
    const result = await db.delete(userFoodFavorites)
      .where(and(
        eq(userFoodFavorites.userId, userId),
        eq(userFoodFavorites.foodId, foodId)
      ));
    return (result.rowCount ?? 0) > 0;
  }

  // Support ticket methods
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [result] = await db.insert(supportTickets).values(ticket).returning();
    return result;
  }

  async getSupportTicketsByUser(userId: number): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  // Security Settings methods
  async getSecuritySettings(userId: number): Promise<SecuritySettings | null> {
    const [result] = await db.select().from(securitySettings)
      .where(eq(securitySettings.userId, userId));
    return result || null;
  }

  async createSecuritySettings(settings: InsertSecuritySettings): Promise<SecuritySettings> {
    const [result] = await db.insert(securitySettings).values(settings).returning();
    return result;
  }

  async updateSecuritySettings(userId: number, updates: Partial<InsertSecuritySettings>): Promise<SecuritySettings> {
    const [result] = await db.update(securitySettings)
      .set(updates)
      .where(eq(securitySettings.userId, userId))
      .returning();
    return result;
  }

  async changePassword(userId: number, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }



  async deleteUserAccount(userId: number): Promise<void> {
    // Delete all user-related data in proper order (foreign key constraints)
    await db.delete(securitySettings).where(eq(securitySettings.userId, userId));
    await db.delete(supportTickets).where(eq(supportTickets.userId, userId));
    await db.delete(userFoodFavorites).where(eq(userFoodFavorites.userId, userId));
    await db.delete(foodLogs).where(eq(foodLogs.userId, userId));
    await db.delete(notifications).where(eq(notifications.userId, userId));
    await db.delete(symptoms).where(eq(symptoms.userId, userId));
    await db.delete(medications).where(eq(medications.userId, userId));
    await db.delete(triggers).where(eq(triggers.userId, userId));
    await db.delete(migraines).where(eq(migraines.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  }

  async updateSupportTicketStatus(id: number, status: string): Promise<boolean> {
    const result = await db.update(supportTickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(supportTickets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // FAQ methods
  async getFaqs(): Promise<Faq[]> {
    return await db.select().from(faqs)
      .where(eq(faqs.isActive, true))
      .orderBy(asc(faqs.order), asc(faqs.id));
  }

  async getFaqsByCategory(category: string): Promise<Faq[]> {
    return await db.select().from(faqs)
      .where(and(eq(faqs.isActive, true), eq(faqs.category, category)))
      .orderBy(asc(faqs.order), asc(faqs.id));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const [result] = await db.insert(faqs).values(faq).returning();
    return result;
  }

  // Help resources methods
  async getHelpResources(): Promise<HelpResource[]> {
    return await db.select().from(helpResources)
      .where(eq(helpResources.isActive, true))
      .orderBy(asc(helpResources.order), asc(helpResources.id));
  }

  async getHelpResourcesByType(type: string): Promise<HelpResource[]> {
    return await db.select().from(helpResources)
      .where(and(eq(helpResources.isActive, true), eq(helpResources.type, type)))
      .orderBy(asc(helpResources.order), asc(helpResources.id));
  }

  async createHelpResource(resource: InsertHelpResource): Promise<HelpResource> {
    const [result] = await db.insert(helpResources).values(resource).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
