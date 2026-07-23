/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccountObject, DeviceObject, BackupObject, MigrationObject, SubjectTrackObject } from '../types';
import { getApiUrl } from './api';

export const SUPPORTED_TRACKS: SubjectTrackObject[] = [
  {
    trackName: 'Java DSA',
    syllabusTree: { totalTopicsCount: 24, categories: ['Java Basics', 'OOP', 'Collections', 'Linear DSA', 'Non-Linear DSA', 'Algorithms'] },
    roadmapRules: { hoursPerDay: 2, durationDays: 60 },
    topicGroups: ['Syntax & Compilation', 'Control Flow', 'Classes & Inheritence', 'Lists & Queues', 'BST & Heaps', 'Recursion & Sorting'],
    progressSummary: { completionPercentage: 0, completedCount: 0 },
    analyticsSummary: { weeklyHoursStudied: 14, currentStreak: 3 }
  },
  {
    trackName: 'Python DSA',
    syllabusTree: { totalTopicsCount: 20, categories: ['Python Syntax', 'Dynamic Typing', 'Built-in Structs', 'Linear DSA', 'Non-Linear DSA', 'Algorithms'] },
    roadmapRules: { hoursPerDay: 1.5, durationDays: 45 },
    topicGroups: ['Variables & Loops', 'Decorators', 'Lists & Dictionaries', 'Stacks & Trees', 'Graphs & DP', 'Big O Analysis'],
    progressSummary: { completionPercentage: 0, completedCount: 0 },
    analyticsSummary: { weeklyHoursStudied: 10.5, currentStreak: 0 }
  },
  {
    trackName: 'C++ DSA',
    syllabusTree: { totalTopicsCount: 26, categories: ['Pointers & Memory', 'OOP & STL', 'Linear DSA', 'Trees', 'Graphs', 'Advanced Algos'] },
    roadmapRules: { hoursPerDay: 3, durationDays: 75 },
    topicGroups: ['Pointers & References', 'Memory Allocation', 'Vectors & Lists', 'Trees & BST', 'Graph Traversals', 'Dynamic Programming'],
    progressSummary: { completionPercentage: 0, completedCount: 0 },
    analyticsSummary: { weeklyHoursStudied: 21, currentStreak: 0 }
  },
  {
    trackName: 'System Design',
    syllabusTree: { totalTopicsCount: 15, categories: ['Fundamentals', 'High Level Design', 'Databases', 'Caching', 'Messaging Systems'] },
    roadmapRules: { hoursPerDay: 2, durationDays: 30 },
    topicGroups: ['Load Balancing', 'Sharding & Replication', 'SQL vs NoSQL', 'CDN & Redis', 'Kafka & Queues'],
    progressSummary: { completionPercentage: 0, completedCount: 0 },
    analyticsSummary: { weeklyHoursStudied: 14, currentStreak: 0 }
  }
];

export async function registerUser(email: string, password: string, displayName: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Registration failed');
  }
  return res.json();
}

export async function loginUser(email: string, password: string, deviceName: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, deviceName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  return res.json();
}

export async function recoverUser(email: string, recoveryKey: string, newPassword?: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/auth/recover'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, recoveryKey, newPassword })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Recovery failed');
  }
  return res.json();
}

export async function updateProfileOnServer(userId: string, displayName: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/auth/update-profile'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, displayName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Profile update failed');
  }
  return res.json();
}

export async function pullSyncData(userId: string, deviceId: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/sync/pull'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, deviceId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to pull cloud sync data');
  }
  return res.json();
}

export async function pushSyncData(userId: string, deviceId: string, syncData: any, clientTimestamp: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/sync/push'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, deviceId, syncData, clientTimestamp })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to push cloud sync data');
  }
  return res.json();
}

export async function fetchDevices(userId: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/devices/list'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch devices');
  }
  return res.json();
}

export async function logoutDeviceOnServer(userId: string, deviceId: string): Promise<any> {
  const res = await fetch(getApiUrl('/api/devices/logout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, deviceId })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to logout device');
  }
  return res.json();
}

/**
 * Validates the schema of an imported backup JSON file.
 */
export function validateBackup(parsed: any): BackupObject {
  const typesIncluded: string[] = [];
  let isCorrupted = false;

  if (parsed.profile) typesIncluded.push('UserProfile');
  else isCorrupted = true;

  if (parsed.topics) typesIncluded.push('TopicProgress');
  else isCorrupted = true;

  if (parsed.problems) typesIncluded.push('PracticeArena');
  else isCorrupted = true;

  if (parsed.roadmap) typesIncluded.push('StudyRoadmap');
  else isCorrupted = true;

  if (parsed.currentDayNumber !== undefined) typesIncluded.push('TimelineState');

  const sizeEstimate = `${Math.ceil((JSON.stringify(parsed).length) / 1024)} KB`;

  return {
    id: 'bak_' + Math.random().toString(36).substr(2, 9),
    creationDate: new Date().toISOString(),
    includedDataTypes: typesIncluded,
    sizeEstimate,
    integrityStatus: isCorrupted ? 'Corrupted' : 'Valid',
    restoreCompatibility: 'v1.1.0 (Latest Release)'
  };
}

/**
 * Detects legacy structures and migrates them safely to latest.
 */
export function runDataMigration(oldData: any): { migratedData: any; migrationInfo: MigrationObject } {
  let dataConvertedCount = 0;
  const warnings: string[] = [];

  const upgraded = JSON.parse(JSON.stringify(oldData));

  // 1. Check legacy profiles without selectedDurationDays (only weeks)
  if (upgraded.profile) {
    if (upgraded.profile.selectedDurationDays === undefined) {
      const weeks = upgraded.profile.selectedDurationWeeks || 8;
      upgraded.profile.selectedDurationDays = weeks * 7;
      dataConvertedCount++;
      warnings.push(`Legacy profile had no selectedDurationDays. Upgraded based on ${weeks} study weeks.`);
    }
    if (!upgraded.profile.themePreference) {
      upgraded.profile.themePreference = 'dark';
      dataConvertedCount++;
    }
    if (upgraded.profile.preferredLanguageTrack !== 'Java') {
      upgraded.profile.preferredLanguageTrack = 'Java';
      dataConvertedCount++;
    }
  }

  // 2. Add modern topic attributes like masteryState if missing
  if (upgraded.topics && Array.isArray(upgraded.topics)) {
    upgraded.topics = upgraded.topics.map((topic: any) => {
      let changed = false;
      if (!topic.masteryState) {
        topic.masteryState = topic.completionStatus === 'Completed' ? 'Mastered' : 'Not Started';
        changed = true;
      }
      if (topic.reviewCount === undefined) {
        topic.reviewCount = 0;
        changed = true;
      }
      if (changed) dataConvertedCount++;
      return topic;
    });
  }

  // 3. Add problem details if missing
  if (upgraded.problems && Array.isArray(upgraded.problems)) {
    upgraded.problems = upgraded.problems.map((problem: any) => {
      let changed = false;
      if (problem.attemptCount === undefined) {
        problem.attemptCount = 0;
        changed = true;
      }
      if (problem.bookmarked === undefined) {
        problem.bookmarked = false;
        changed = true;
      }
      if (changed) dataConvertedCount++;
      return problem;
    });
  }

  const migrationInfo: MigrationObject = {
    sourceVersion: oldData?.version || 'v1.0.0 (Legacy)',
    targetVersion: 'v1.1.0 (Active)',
    migrationStatus: 'Completed',
    dataConverted: dataConvertedCount,
    warnings,
    completionTime: new Date().toISOString()
  };

  return {
    migratedData: upgraded,
    migrationInfo
  };
}
