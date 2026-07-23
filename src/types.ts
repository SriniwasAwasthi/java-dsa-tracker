/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  preferredLanguageTrack: 'Java';
  selectedDurationWeeks: number; // For backward compatibility / week calculations
  selectedDurationDays: number; // Days representation (30, 60, 90, custom)
  startDate: string;
  endDate: string;
  dailyStudyHoursGoal: number;
  currentLevel: 'Complete Beginner' | 'Beginner' | 'Intermediate';
  targetGoal: 'Placements' | 'Interview Prep' | 'DSA Mastery';
  learningPace: 'Light' | 'Balanced' | 'Intensive';
  themePreference: 'dark' | 'light';
  onboarded: boolean;
  lastActiveDay?: number;
  progressPercentage?: number;
}

export type TopicCategory =
  | 'Java Basics'
  | 'OOP'
  | 'Collections'
  | 'Basic DSA'
  | 'Linear DSA'
  | 'Non-Linear DSA'
  | 'Algorithms'
  | 'Advanced DSA';

export interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prerequisites: string[]; // Names of prerequisite topics
  estimatedHours: number;
  completionStatus: 'Not Started' | 'In Progress' | 'Completed';
  isRevisionDue: boolean;
  description: string;
  
  // Phase 3 Extended fields
  masteryState?: 'Not Started' | 'Reading' | 'Understood' | 'Practiced' | 'Revision Needed' | 'Mastered';
  lastStudiedDate?: string;
  nextRevisionDate?: string;
  revisionPriority?: 'Low' | 'Medium' | 'High';
  isWeakTopic?: boolean;
  isMastered?: boolean;
  reviewCount?: number;
  notes?: string;
  formulas?: string;
  reminders?: string;
  interviewTips?: string;
}

export interface Problem {
  id: string;
  title: string;
  topicId: string;
  topicName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Unsolved' | 'Solved' | 'Revision';
  notes?: string;
  attemptCount: number;
  solvedDate?: string;
  url?: string;
  
  // Phase 3 Extended fields
  bookmarked?: boolean;
  hints?: string[];
  javaSolution?: string;
  solutionSummary?: string;
  timeTakenMinutes?: number;
  platformSource?: string; // LeetCode, GFG, Syllabus etc.
}

export interface RoadmapDay {
  dayNumber: number;
  date: string;
  assignedTopicIds: string[];
  assignedProblemIds: string[];
  estimatedHours: number;
  status: 'Pending' | 'Completed' | 'Skipped' | 'Partial';
  carryForwardTopicIds?: string[];
}

export interface ProgressRecord {
  completedTopicIds: string[];
  pendingTopicIds: string[];
  skippedTopicIds: string[];
  revisionDueTopicIds: string[];
  dailyCompletionHistory: { [date: string]: 'Completed' | 'Skipped' | 'Partial' | 'None' };
}

// --- Phase 7 Interfaces ---

export interface AccountObject {
  id: string;
  displayName: string;
  email: string;
  localModeStatus: boolean;
  syncModeStatus: boolean;
  accountCreationDate: string;
  lastLoginDate: string;
  recoveryKey?: string;
}

export interface SyncRecordObject {
  dataType: string;
  lastSyncedTime: string;
  sourceDevice: string;
  syncStatus: 'Synced' | 'Pending' | 'Failed';
  conflictState?: 'No Conflict' | 'Conflict Detected';
  resolutionResult?: string;
}

export interface BackupObject {
  id: string;
  creationDate: string;
  includedDataTypes: string[];
  sizeEstimate: string;
  integrityStatus: 'Valid' | 'Corrupted';
  restoreCompatibility: string;
}

export interface MigrationObject {
  sourceVersion: string;
  targetVersion: string;
  migrationStatus: 'Completed' | 'Failed' | 'In Progress';
  dataConverted: number;
  warnings: string[];
  completionTime: string;
}

export interface DeviceObject {
  deviceId: string;
  deviceName: string;
  trustedStatus: 'Trusted' | 'Untrusted';
  lastActiveTime: string;
  syncState: 'Synced' | 'Pending';
  logoutStatus: boolean;
}

export interface SubjectTrackObject {
  trackName: string; // e.g., "Java DSA", "Python DSA", "C++ DSA"
  syllabusTree: { totalTopicsCount: number; categories: string[] };
  roadmapRules: { hoursPerDay: number; durationDays: number };
  topicGroups: string[];
  progressSummary: { completionPercentage: number; completedCount: number };
  analyticsSummary: { weeklyHoursStudied: number; currentStreak: number };
}

