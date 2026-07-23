/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Topic,
  Problem,
  RoadmapDay,
  AccountObject,
  SyncRecordObject
} from './types';
import { pushSyncData, pullSyncData } from './lib/syncService';
import {
  INITIAL_TOPICS,
  INITIAL_PROBLEMS,
  DEFAULT_USER_PROFILE,
  generateRoadmap
} from './data/initialData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

import RoadmapView from './components/RoadmapView';
import TopicsView from './components/TopicsView';
import ProblemsView from './components/ProblemsView';
import AIMentorView from './components/AIMentorView';
import RevisionView from './components/RevisionView';
import AnalyticsView from './components/AnalyticsView';
import RecommendationsView from './components/RecommendationsView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import OnboardingWizard from './components/OnboardingWizard';
import CalendarView from './components/CalendarView';

import { Compass, GraduationCap, Sun, Moon, Menu } from 'lucide-react';

function ScreenLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-800">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-neutral-800 rounded"></div>
          <div className="h-4 w-72 bg-neutral-800/60 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-neutral-800 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="h-32 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="h-4 w-1/4 bg-neutral-800 rounded"></div>
            <div className="h-3 w-3/4 bg-neutral-800/60 rounded"></div>
            <div className="h-3 w-1/2 bg-neutral-800/40 rounded"></div>
          </div>
          <div className="h-64 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6">
            <div className="h-4 w-1/3 bg-neutral-800 rounded mb-4"></div>
            <div className="space-y-2.5">
              <div className="h-3 bg-neutral-800 rounded"></div>
              <div className="h-3 bg-neutral-800/80 rounded"></div>
              <div className="h-3 bg-neutral-800/60 rounded"></div>
              <div className="h-3 bg-neutral-800/40 rounded"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="h-4 w-1/3 bg-neutral-800 rounded"></div>
            <div className="h-12 bg-neutral-800 rounded-xl"></div>
            <div className="h-3 w-2/3 bg-neutral-800/50 rounded"></div>
          </div>
          <div className="h-48 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-3">
            <div className="h-4 w-1/2 bg-neutral-800 rounded"></div>
            <div className="h-3 w-5/6 bg-neutral-800/60 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // --- Persistent State Initialization ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('java_dsa_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('java_dsa_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem('java_dsa_problems');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  const [roadmap, setRoadmap] = useState<RoadmapDay[]>(() => {
    const saved = localStorage.getItem('java_dsa_roadmap');
    if (saved) {
      return JSON.parse(saved);
    } else {
      return generateRoadmap(INITIAL_TOPICS, INITIAL_PROBLEMS, DEFAULT_USER_PROFILE);
    }
  });

  const [currentDayNumber, setCurrentDayNumber] = useState<number>(() => {
    const saved = localStorage.getItem('java_dsa_current_day');
    return saved ? parseInt(saved) : 1;
  });

  const [studySessions, setStudySessions] = useState<any[]>(() => {
    const saved = localStorage.getItem('java_dsa_study_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // --- Phase 7 Cloud Sync & User Accounts States ---
  const [account, setAccount] = useState<AccountObject | null>(() => {
    const saved = localStorage.getItem('java_dsa_account');
    return saved ? JSON.parse(saved) : null;
  });

  const [deviceId] = useState<string>(() => {
    let id = localStorage.getItem('java_dsa_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('java_dsa_device_id', id);
    }
    return id;
  });

  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('java_dsa_last_sync_time');
  });

  const [syncRecord, setSyncRecord] = useState<SyncRecordObject | null>(() => {
    const saved = localStorage.getItem('java_dsa_sync_record');
    return saved ? JSON.parse(saved) : null;
  });

  const executeAutoPush = async (): Promise<boolean> => {
    if (!account || !isOnline) return false;
    try {
      const syncData = {
        profile,
        topics,
        problems,
        roadmap,
        currentDayNumber,
        studySessions,
        lastUpdated: new Date().toISOString()
      };
      
      const res = await pushSyncData(account.id, deviceId, syncData, new Date().toISOString());
      
      if (res.status === 'success') {
        const now = new Date().toISOString();
        setLastSyncTime(now);
        localStorage.setItem('java_dsa_last_sync_time', now);
        
        const record: SyncRecordObject = {
          dataType: 'All Learning Data (Fidelity Sync)',
          lastSyncedTime: now,
          sourceDevice: deviceId,
          syncStatus: 'Synced',
          conflictState: 'No Conflict'
        };
        setSyncRecord(record);
        localStorage.setItem('java_dsa_sync_record', JSON.stringify(record));
        return true;
      } else if (res.status === 'conflict') {
        const record: SyncRecordObject = {
          dataType: 'All Learning Data (Fidelity Sync)',
          lastSyncedTime: new Date().toISOString(),
          sourceDevice: deviceId,
          syncStatus: 'Failed',
          conflictState: 'Conflict Detected',
          resolutionResult: 'Server is newer. Pull required.'
        };
        setSyncRecord(record);
        localStorage.setItem('java_dsa_sync_record', JSON.stringify(record));
        return false;
      }
      return false;
    } catch (err) {
      console.error('Auto sync push failed:', err);
      const record: SyncRecordObject = {
        dataType: 'All Learning Data (Fidelity Sync)',
        lastSyncedTime: lastSyncTime || new Date().toISOString(),
        sourceDevice: deviceId,
        syncStatus: 'Failed',
        conflictState: 'No Conflict',
        resolutionResult: 'Network error or offline'
      };
      setSyncRecord(record);
      localStorage.setItem('java_dsa_sync_record', JSON.stringify(record));
      return false;
    }
  };

  const executeAutoPull = async (): Promise<boolean> => {
    if (!account || !isOnline) return false;
    try {
      const res = await pullSyncData(account.id, deviceId);
      if (res.syncData) {
        const parsed = res.syncData;
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.topics) setTopics(parsed.topics);
        if (parsed.problems) setProblems(parsed.problems);
        if (parsed.roadmap) setRoadmap(parsed.roadmap);
        if (parsed.currentDayNumber) setCurrentDayNumber(parsed.currentDayNumber);
        if (parsed.studySessions) setStudySessions(parsed.studySessions);
        
        const now = new Date().toISOString();
        setLastSyncTime(now);
        localStorage.setItem('java_dsa_last_sync_time', now);
        
        const record: SyncRecordObject = {
          dataType: 'All Learning Data (Fidelity Sync)',
          lastSyncedTime: now,
          sourceDevice: deviceId,
          syncStatus: 'Synced',
          conflictState: 'No Conflict'
        };
        setSyncRecord(record);
        localStorage.setItem('java_dsa_sync_record', JSON.stringify(record));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Manual pull failed:', err);
      return false;
    }
  };

  // Auto sync push on data modifications
  useEffect(() => {
    if (!account || !account.syncModeStatus || !isOnline) return;

    const timer = setTimeout(() => {
      executeAutoPush();
    }, 2500);

    return () => clearTimeout(timer);
  }, [profile, topics, problems, roadmap, currentDayNumber, studySessions]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // --- Synchronization with LocalStorage ---
  useEffect(() => {
    localStorage.setItem('java_dsa_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('java_dsa_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('java_dsa_problems', JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem('java_dsa_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem('java_dsa_current_day', currentDayNumber.toString());
  }, [currentDayNumber]);

  useEffect(() => {
    localStorage.setItem('java_dsa_study_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // --- Core State Mutators & Handlers ---

  const handleRecalculateRemainingRoadmap = (targetProfile?: UserProfile) => {
    const activeProfile = targetProfile ?? profile;
    const days = activeProfile.selectedDurationDays || (activeProfile.selectedDurationWeeks * 7);

    // Identify completed days up to current total days
    const completedDays = roadmap.filter(d => d.status === 'Completed' && d.dayNumber <= days);
    const completedDaysCount = completedDays.length;

    // Gather completed topics & solved problems from completed days
    const completedTopicIds = new Set<string>();
    const solvedProblemIds = new Set<string>();

    completedDays.forEach(day => {
      day.assignedTopicIds.forEach(id => completedTopicIds.add(id));
      day.assignedProblemIds.forEach(id => solvedProblemIds.add(id));
    });

    // Synced completed status in states
    setTopics(prev => prev.map(t => {
      if (completedTopicIds.has(t.id)) {
        return { ...t, completionStatus: 'Completed' as const };
      }
      return t;
    }));
    setProblems(prev => prev.map(p => {
      if (solvedProblemIds.has(p.id)) {
        return { ...p, status: 'Solved' as const };
      }
      return p;
    }));

    // Re-schedule the remaining (incomplete) topics and problems
    const remainingTopics = topics.filter(t => t.completionStatus !== 'Completed' && !completedTopicIds.has(t.id));
    const remainingProblems = problems.filter(p => p.status !== 'Solved' && !solvedProblemIds.has(p.id));

    const remainingDaysCount = days - completedDaysCount;
    if (remainingDaysCount > 0) {
      let baseDateObj = new Date(activeProfile.startDate);
      const lastCompletedDay = completedDays[completedDays.length - 1];
      if (lastCompletedDay) {
        baseDateObj = new Date(lastCompletedDay.date);
        baseDateObj.setDate(baseDateObj.getDate() + 1);
      }

      const miniRoadmap = generateRoadmap(remainingTopics, remainingProblems, {
        ...activeProfile,
        startDate: baseDateObj.toISOString().split('T')[0],
        selectedDurationDays: remainingDaysCount
      });

      const finalRoadmap: RoadmapDay[] = [
        ...completedDays,
        ...miniRoadmap.map((day, idx) => ({
          ...day,
          dayNumber: completedDaysCount + idx + 1
        }))
      ];

      setRoadmap(finalRoadmap);

      const firstPendingDay = finalRoadmap.find(d => d.status !== 'Completed');
      if (firstPendingDay) {
        setCurrentDayNumber(firstPendingDay.dayNumber);
      } else {
        setCurrentDayNumber(finalRoadmap.length || 1);
      }
    } else {
      setRoadmap(completedDays);
      setCurrentDayNumber(completedDays.length || 1);
    }
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    const nextProfile = { ...profile, ...updatedProfile };
    
    // Check if any roadmap-affecting property changed
    const needsRecalc = 
      updatedProfile.selectedDurationWeeks !== undefined ||
      updatedProfile.selectedDurationDays !== undefined ||
      updatedProfile.startDate !== undefined ||
      updatedProfile.dailyStudyHoursGoal !== undefined ||
      updatedProfile.currentLevel !== undefined ||
      updatedProfile.learningPace !== undefined;

    if (needsRecalc) {
      const days = updatedProfile.selectedDurationDays ?? profile.selectedDurationDays;
      const start = updatedProfile.startDate ?? profile.startDate;
      const startObj = new Date(start);
      const endObj = new Date(startObj.getTime() + days * 24 * 60 * 60 * 1000);
      nextProfile.endDate = endObj.toISOString().split('T')[0];
      nextProfile.selectedDurationWeeks = Math.ceil(days / 7);

      setProfile(nextProfile);

      // Compute combined new roadmap
      const completedDays = roadmap.filter(d => d.status === 'Completed' && d.dayNumber <= days);
      const completedDaysCount = completedDays.length;

      const completedTopicIds = new Set<string>();
      const solvedProblemIds = new Set<string>();
      completedDays.forEach(day => {
        day.assignedTopicIds.forEach(id => completedTopicIds.add(id));
        day.assignedProblemIds.forEach(id => solvedProblemIds.add(id));
      });

      const remainingTopics = topics.filter(t => !completedTopicIds.has(t.id));
      const remainingProblems = problems.filter(p => !solvedProblemIds.has(p.id));

      const remainingDaysCount = days - completedDaysCount;
      if (remainingDaysCount > 0) {
        let baseDateObj = new Date(nextProfile.startDate);
        const lastCompletedDay = completedDays[completedDays.length - 1];
        if (lastCompletedDay) {
          baseDateObj = new Date(lastCompletedDay.date);
          baseDateObj.setDate(baseDateObj.getDate() + 1);
        }

        const miniRoadmap = generateRoadmap(remainingTopics, remainingProblems, {
          ...nextProfile,
          startDate: baseDateObj.toISOString().split('T')[0],
          selectedDurationDays: remainingDaysCount
        });

        const finalRoadmap: RoadmapDay[] = [
          ...completedDays,
          ...miniRoadmap.map((day, idx) => ({
            ...day,
            dayNumber: completedDaysCount + idx + 1
          }))
        ];

        setRoadmap(finalRoadmap);

        const firstPendingDay = finalRoadmap.find(d => d.status !== 'Completed');
        if (firstPendingDay) {
          setCurrentDayNumber(firstPendingDay.dayNumber);
        } else {
          setCurrentDayNumber(finalRoadmap.length || 1);
        }
      } else {
        setRoadmap(completedDays);
        setCurrentDayNumber(completedDays.length || 1);
      }
    } else {
      setProfile(nextProfile);
    }
  };

  const handleUpdateDayStatus = (dayNumber: number, status: RoadmapDay['status']) => {
    let targetDay: RoadmapDay | undefined;
    setRoadmap((prev) => {
      const updated = prev.map((d) => (d.dayNumber === dayNumber ? { ...d, status } : d));
      targetDay = updated.find(d => d.dayNumber === dayNumber);
      return updated;
    });

    // If day was marked Completed, automatically mark all of its topics completed and problems solved
    if (status === 'Completed') {
      setTimeout(() => {
        const foundDay = roadmap.find(d => d.dayNumber === dayNumber) || targetDay;
        if (foundDay) {
          setTopics(prev => prev.map(t => {
            if (foundDay.assignedTopicIds.includes(t.id)) {
              return { ...t, completionStatus: 'Completed' as const };
            }
            return t;
          }));
          setProblems(prev => prev.map(p => {
            if (foundDay.assignedProblemIds.includes(p.id)) {
              return { ...p, status: 'Solved' as const };
            }
            return p;
          }));
        }
      }, 50);
    }

    // If day was marked Skipped or Partial, trigger recalculation/rebalance for the remaining portion
    if (status === 'Skipped' || status === 'Partial') {
      setTimeout(() => {
        handleRecalculateRemainingRoadmap();
      }, 100);
    }
  };

  const handleToggleTopicStatus = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const statuses: Topic['completionStatus'][] = ['Not Started', 'In Progress', 'Completed'];
          const currentIdx = statuses.indexOf(t.completionStatus);
          const nextStatus = statuses[(currentIdx + 1) % statuses.length];
          const isComp = nextStatus === 'Completed';
          return {
            ...t,
            completionStatus: nextStatus,
            masteryState: isComp ? 'Mastered' : (nextStatus === 'In Progress' ? 'Reading' : 'Not Started'),
            lastStudiedDate: isComp || nextStatus === 'In Progress' ? new Date().toISOString().split('T')[0] : t.lastStudiedDate
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTopic = (topicId: string, updates: Partial<Topic>) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, ...updates } : t))
    );
  };

  const handleToggleProblemStatus = (problemId: string, status: Problem['status']) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const solvedDate = status === 'Solved' ? new Date().toISOString().split('T')[0] : undefined;
          return {
            ...p,
            status,
            attemptCount: p.attemptCount + 1,
            solvedDate
          };
        }
        return p;
      })
    );
  };

  const handleUpdateProblem = (problemId: string, updates: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, ...updates } : p))
    );
  };

  const handleUpdateProblemNotes = (problemId: string, notes: string) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, notes } : p))
    );
  };

  const handleAddStudySession = (newSession: any) => {
    setStudySessions((prev) => [newSession, ...prev]);
  };

  // --- Onboarding Completion Handler ---
  const handleOnboardingComplete = (onboardedProfile: Omit<UserProfile, 'themePreference'>) => {
    const nextProfile: UserProfile = {
      ...profile,
      ...onboardedProfile,
      onboarded: true
    };
    setProfile(nextProfile);

    // Reset status to fresh starting point
    const freshTopics = INITIAL_TOPICS.map(t => ({ ...t, completionStatus: 'Not Started' as const }));
    const freshProblems = INITIAL_PROBLEMS.map(p => ({ ...p, status: 'Unsolved' as const }));
    setTopics(freshTopics);
    setProblems(freshProblems);

    // Generate fresh roadmap with new settings
    const newRoadmap = generateRoadmap(freshTopics, freshProblems, nextProfile);
    setRoadmap(newRoadmap);
    setCurrentDayNumber(1);
  };

  const handleResetAllData = () => {
    localStorage.removeItem('java_dsa_profile');
    localStorage.removeItem('java_dsa_topics');
    localStorage.removeItem('java_dsa_problems');
    localStorage.removeItem('java_dsa_roadmap');
    localStorage.removeItem('java_dsa_current_day');

    setProfile(DEFAULT_USER_PROFILE);
    setTopics(INITIAL_TOPICS);
    setProblems(INITIAL_PROBLEMS);
    setRoadmap(generateRoadmap(INITIAL_TOPICS, INITIAL_PROBLEMS, DEFAULT_USER_PROFILE));
    setCurrentDayNumber(1);
    setActiveTab('dashboard');
  };

  const handleExportBackupData = () => {
    const backupObj = {
      profile,
      topics,
      problems,
      roadmap,
      currentDayNumber
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `java_dsa_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackupData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        if (event.target?.result) {
          try {
            const parsed = JSON.parse(event.target.result as string);
            if (parsed.profile && parsed.topics && parsed.problems && parsed.roadmap) {
              setProfile(parsed.profile);
              setTopics(parsed.topics);
              setProblems(parsed.problems);
              setRoadmap(parsed.roadmap);
              if (parsed.currentDayNumber) {
                setCurrentDayNumber(parsed.currentDayNumber);
              }
              alert('Backup imported successfully!');
            } else {
              alert('Invalid backup schema format.');
            }
          } catch (err) {
            alert('Failed to parse backup JSON file.');
          }
        }
      };
    }
  };

  // Syllabus progress helper (topics completed / total topics)
  const syllabusProgress = Math.round(
    (topics.filter((t) => t.completionStatus === 'Completed').length / topics.length) * 100
  );

  const isDark = profile.themePreference === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-800'
      }`}
    >
      {/* Sidebar - Desktop Layout */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={profile.themePreference}
        progressPercentage={syllabusProgress}
        profile={profile}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Backdrop overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Container */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header
          className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${
            isDark
              ? 'bg-neutral-950/80 border-neutral-800'
              : 'bg-white/80 border-neutral-200'
          }`}
        >
          {/* Track Tag & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 rounded bg-orange-500 text-neutral-950 hover:bg-orange-400 focus:outline-none transition-all"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-1 rounded">
                Active Track: Java + DSA
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-500">
                Pacing: Custom slider set to {profile.dailyStudyHoursGoal}h
              </span>
              {isOnline ? (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Offline Study Active
                </span>
              )}
            </div>
          </div>

          {/* Quick theme toggler & user badge */}
          <div className="flex items-center gap-4">
            {/* Quick theme toggle */}
            <button
              onClick={() =>
                handleUpdateProfile({
                  themePreference: isDark ? 'light' : 'dark'
                })
              }
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 hidden md:inline">
                Target End: {new Date(profile.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </header>

        {/* Major Active Screen Dispatcher */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <React.Suspense fallback={<ScreenLoadingSkeleton />}>
            {activeTab === 'dashboard' && (
              <Dashboard
                theme={profile.themePreference}
                profile={profile}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                setCurrentDayNumber={setCurrentDayNumber}
                onUpdateDayStatus={handleUpdateDayStatus}
                onToggleTopicStatus={handleToggleTopicStatus}
                onToggleProblemStatus={handleToggleProblemStatus}
                onUpdateTopic={handleUpdateTopic}
                onUpdateProblem={handleUpdateProblem}
                setActiveTab={setActiveTab}
                onRescheduleRemaining={() => handleRecalculateRemainingRoadmap()}
                studySessions={studySessions}
                onAddStudySession={handleAddStudySession}
                account={account}
                lastSyncTime={lastSyncTime}
                syncRecord={syncRecord}
                deviceId={deviceId}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapView
                theme={profile.themePreference}
                profile={profile}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                setCurrentDayNumber={setCurrentDayNumber}
                onUpdateDayStatus={handleUpdateDayStatus}
                onRescheduleRoadmap={() => handleRecalculateRemainingRoadmap()}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                theme={profile.themePreference}
                profile={profile}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                onUpdateDayStatus={handleUpdateDayStatus}
                onToggleTopicStatus={handleToggleTopicStatus}
                onToggleProblemStatus={handleToggleProblemStatus}
                onUpdateTopic={handleUpdateTopic}
                onUpdateProblem={handleUpdateProblem}
                studySessions={studySessions}
              />
            )}

            {activeTab === 'topics' && (
              <TopicsView
                theme={profile.themePreference}
                topics={topics}
                problems={problems}
                onToggleTopicStatus={handleToggleTopicStatus}
                onToggleProblemStatus={handleToggleProblemStatus}
                onUpdateTopic={handleUpdateTopic}
                onUpdateProblem={handleUpdateProblem}
              />
            )}

            {activeTab === 'problems' && (
              <ProblemsView
                theme={profile.themePreference}
                problems={problems}
                topics={topics}
                onToggleProblemStatus={handleToggleProblemStatus}
                onUpdateProblemNotes={handleUpdateProblemNotes}
                onUpdateProblem={handleUpdateProblem}
              />
            )}

            {activeTab === 'aimentor' && (
              <AIMentorView
                theme={profile.themePreference}
                topics={topics}
                problems={problems}
                onNavigateToSettings={() => setActiveTab('settings')}
              />
            )}

            {activeTab === 'revision' && (
              <RevisionView
                theme={profile.themePreference}
                topics={topics}
                onUpdateTopic={handleUpdateTopic}
                problems={problems}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                theme={profile.themePreference}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                profile={profile}
                studySessions={studySessions}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsView
                theme={profile.themePreference}
                profile={profile}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                onUpdateTopic={handleUpdateTopic}
                onUpdateProblem={handleUpdateProblem}
                onRescheduleRemaining={() => handleRecalculateRemainingRoadmap()}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                theme={profile.themePreference}
                profile={profile}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                onUpdateDayStatus={handleUpdateDayStatus}
                studySessions={studySessions}
              />
            )}



            {activeTab === 'settings' && (
              <SettingsView
                theme={profile.themePreference}
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onResetAllData={handleResetAllData}
                exportBackupData={handleExportBackupData}
                importBackupData={handleImportBackupData}
                account={account}
                onUpdateAccount={setAccount}
                deviceId={deviceId}
                onSyncPush={executeAutoPush}
                onSyncPull={executeAutoPull}
                lastSyncTime={lastSyncTime}
                syncRecord={syncRecord}
                topics={topics}
                problems={problems}
                roadmap={roadmap}
                currentDayNumber={currentDayNumber}
                studySessions={studySessions}
              />
            )}

          </React.Suspense>
        </main>
      </div>
      {!profile.onboarded && (
        <React.Suspense fallback={<ScreenLoadingSkeleton />}>
          <OnboardingWizard
            theme={profile.themePreference}
            onComplete={handleOnboardingComplete}
          />
        </React.Suspense>
      )}
    </div>
  );
}
