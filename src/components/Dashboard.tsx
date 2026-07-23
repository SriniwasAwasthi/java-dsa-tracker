/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Flame,
  Brain,
  Star,
  Bell,
  Clock,
  Play,
  Square,
  RotateCcw
} from 'lucide-react';
import { Topic, Problem, RoadmapDay, UserProfile } from '../types';

interface DashboardProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  setCurrentDayNumber: (day: number) => void;
  onUpdateDayStatus: (dayNumber: number, status: RoadmapDay['status']) => void;
  onToggleTopicStatus: (topicId: string) => void;
  onToggleProblemStatus: (problemId: string, status: Problem['status']) => void;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  setActiveTab: (tab: string) => void;
  onRescheduleRemaining?: () => void;
  studySessions?: any[];
  onAddStudySession?: (session: any) => void;
  
  // Phase 7 status props
  account: any;
  lastSyncTime: string | null;
  syncRecord: any;
  deviceId: string;
}

export default function Dashboard({
  theme,
  profile,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  setCurrentDayNumber,
  onUpdateDayStatus,
  onToggleTopicStatus,
  onToggleProblemStatus,
  onUpdateTopic,
  onUpdateProblem,
  setActiveTab,
  onRescheduleRemaining,
  studySessions = [],
  onAddStudySession,
  account,
  lastSyncTime,
  syncRecord,
  deviceId
}: DashboardProps) {
  const isDark = theme === 'dark';

  // --- Focus Timer States ---
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerFocus, setTimerFocus] = useState({
    type: 'general',
    id: '',
    name: 'General Study Session'
  });

  const [showLogForm, setShowLogForm] = useState(false);
  const [loggedMinutes, setLoggedMinutes] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [productivityStars, setProductivityStars] = useState(5);

  // Load active timer from localStorage on mount (survives browser refresh!)
  React.useEffect(() => {
    const active = localStorage.getItem('java_dsa_active_timer_v2');
    if (active) {
      const parsed = JSON.parse(active);
      const elapsedSeconds = Math.floor((Date.now() - parsed.startTime) / 1000);
      setTimerFocus({
        type: parsed.focusType,
        id: parsed.focusId,
        name: parsed.focusName
      });
      setTimerSeconds(elapsedSeconds > 0 ? elapsedSeconds : 0);
      setTimerRunning(true);
    }
  }, []);

  // Timer interval ticker
  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const handleStartTimer = (focusType: string, focusId: string, focusName: string) => {
    const startTime = Date.now();
    localStorage.setItem('java_dsa_active_timer_v2', JSON.stringify({
      startTime,
      focusType,
      focusId,
      focusName
    }));
    setTimerFocus({ type: focusType, id: focusId, name: focusName });
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  const handleStopTimer = () => {
    const finalMin = Math.max(1, Math.round(timerSeconds / 60));
    setLoggedMinutes(finalMin);
    setSessionNotes('');
    setProductivityStars(5);
    setShowLogForm(true);
    setTimerRunning(false);
    localStorage.removeItem('java_dsa_active_timer_v2');
  };

  const handleCancelTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
    localStorage.removeItem('java_dsa_active_timer_v2');
  };

  const handleSaveLoggedSession = () => {
    if (onAddStudySession) {
      const now = new Date();
      const endHHMM = now.toTimeString().split(' ')[0].slice(0, 5);
      const startMs = now.getTime() - loggedMinutes * 60 * 1000;
      const startHHMM = new Date(startMs).toTimeString().split(' ')[0].slice(0, 5);

      onAddStudySession({
        id: `session_${Date.now()}`,
        date: now.toISOString().split('T')[0],
        startTime: startHHMM,
        endTime: endHHMM,
        durationMinutes: loggedMinutes,
        focusType: timerFocus.type,
        focusId: timerFocus.id,
        focusName: timerFocus.name,
        notes: sessionNotes,
        rating: productivityStars
      });
    }
    setShowLogForm(false);
    setTimerSeconds(0);
  };

  const formatTimerValue = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if there are skipped days or if current day has carry forward items
  const hasSkippedDays = roadmap.some((d) => d.dayNumber < currentDayNumber && d.status === 'Skipped');
  const currentDay = roadmap.find((d) => d.dayNumber === currentDayNumber) || roadmap[0];
  const hasCarryForward = currentDay?.carryForwardTopicIds && currentDay.carryForwardTopicIds.length > 0;

  // Helper to fetch details
  const getTopicDetails = (id: string): Topic | undefined => topics.find((t) => t.id === id);
  const getProblemDetails = (id: string): Problem | undefined => problems.find((p) => p.id === id);

  // Quick statistics calculation
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.completionStatus === 'Completed').length;
  const inProgressTopics = topics.filter((t) => t.completionStatus === 'In Progress').length;
  const pendingTopics = totalTopics - completedTopics;

  const totalProblems = problems.length;
  const solvedProblems = problems.filter((p) => p.status === 'Solved').length;
  const revisionProblems = problems.filter((p) => p.status === 'Revision').length;

  // Streak/Consistency calculation from roadmap history
  const activeDaysCount = roadmap.filter((d) => d.status === 'Completed').length;
  const skippedDaysCount = roadmap.filter((d) => d.status === 'Skipped').length;
  const partialDaysCount = roadmap.filter((d) => d.status === 'Partial').length;

  // Render Consistency Grid of last 14 days
  const recentDays = roadmap.slice(Math.max(0, currentDayNumber - 8), Math.min(roadmap.length, currentDayNumber + 6));

  // --- Study Engine Calculations (Phase 3) ---

  // 1. Recently Studied Topic
  const recentlyStudiedTopic = [...topics]
    .filter(t => t.lastStudiedDate || t.completionStatus !== 'Not Started')
    .sort((a, b) => {
      if (a.lastStudiedDate && b.lastStudiedDate) {
        return b.lastStudiedDate.localeCompare(a.lastStudiedDate);
      }
      if (a.lastStudiedDate) return -1;
      if (b.lastStudiedDate) return 1;
      return 0;
    })[0] || null;

  // 2. Next Recommended Topic
  const currentDayTopicIds = currentDay?.assignedTopicIds || [];
  const nextRecommendedTopic = topics.find(t => currentDayTopicIds.includes(t.id) && t.completionStatus !== 'Completed') ||
    topics.find(t => t.completionStatus !== 'Completed') || null;

  // 3. Weak Topics and reminders
  const weakTopics = topics.filter(t => t.isWeakTopic);

  // 4. Topics Pending Revision
  const todayStr = new Date().toISOString().split('T')[0];
  const revisionDueTopics = topics.filter(t => 
    t.isRevisionDue || 
    (t.nextRevisionDate && t.nextRevisionDate <= todayStr) ||
    t.masteryState === 'Revision Needed'
  );

  const handleNextDay = () => {
    if (currentDayNumber < roadmap.length) {
      setCurrentDayNumber(currentDayNumber + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDayNumber > 1) {
      setCurrentDayNumber(currentDayNumber - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            Welcome back, <span className="text-orange-500">{profile.name}</span>
          </h2>
          <p className="text-sm text-neutral-400 mt-1 font-mono">
            Active Journey Track: Java + DSA Core Plan. standard study rate: {profile.dailyStudyHoursGoal}h/day.
          </p>
        </div>

        {/* Date Selector / Day Indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevDay}
            disabled={currentDayNumber === 1}
            className={`p-2 rounded-lg border transition ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 disabled:opacity-40'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center min-w-[120px]">
            <p className="text-[10px] font-mono text-neutral-500 uppercase">Currently viewing</p>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Day {currentDayNumber} of {roadmap.length}</p>
          </div>
          <button
            onClick={handleNextDay}
            disabled={currentDayNumber === roadmap.length}
            className={`p-2 rounded-lg border transition ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-40'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 disabled:opacity-40'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PHASE 7: DATA SYNC & CONTINUITY METRIC STATUS STRIP */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-neutral-900/20 border-neutral-800/80' : 'bg-neutral-100 border-neutral-200'
      } flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs animate-fade-in`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${account?.syncModeStatus ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-500'} shrink-0 border ${
            isDark ? 'border-neutral-800/50' : 'border-neutral-200'
          }`}>
            <svg className={`w-5 h-5 ${account?.syncModeStatus && 'animate-pulse'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold leading-none mb-1">
              Data Continuity & Cloud Sync Hub
            </span>
            <div className={`font-medium flex flex-wrap items-center gap-1.5 leading-none ${
              isDark ? 'text-neutral-200' : 'text-neutral-800'
            }`}>
              {account ? (
                <>
                  <span>Active Profile: <strong className="text-orange-500">{account.displayName}</strong></span>
                  <span className={isDark ? 'text-neutral-700' : 'text-neutral-300'}>|</span>
                  <span className={`text-[10px] font-mono uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Device ID: {deviceId.slice(0, 6).toUpperCase()}</span>
                </>
              ) : (
                <span className={`font-mono text-[10px] uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Currently running in <strong className="text-amber-500">Offline-First Cache</strong> mode. Create an account to enable multi-device sync.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[10px] uppercase">
          {account ? (
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-400 font-bold">Cloud Synced</span>
              </div>
              <div className="text-[9px] text-neutral-500 mt-0.5">Last sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Pending'}</div>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('settings')}
              className="py-1.5 px-3 bg-neutral-950 hover:bg-neutral-900 text-orange-500 border border-neutral-800 hover:border-neutral-700 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition"
            >
              Enable Cloud Sync
            </button>
          )}
        </div>
      </div>

      {/* Carry Forward Alert Banner */}
      {(hasSkippedDays || hasCarryForward) && onRescheduleRemaining && (
        <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex gap-3">
            <div className="p-2 bg-orange-500/20 text-orange-500 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Unfinished Milestones Detected</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {hasCarryForward 
                  ? "Unfinished topics from previous days have been carried forward to ensure no gaps remain in your learning."
                  : "You have skipped days or left some topics incomplete in past days. Click below to dynamically reschedule and balance your remaining duration."}
              </p>
            </div>
          </div>
          <button
            onClick={onRescheduleRemaining}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider rounded-lg transition shrink-0"
          >
            Rebalance Schedule
          </button>
        </div>
      )}

      {/* PHASE 3: PERSONALIZED STUDY & REVISION CENTRE (Bento Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Recently Studied */}
        <div
          onClick={() => setActiveTab('topics')}
          className={`p-4 rounded-xl border cursor-pointer transition hover:border-orange-500/50 flex flex-col justify-between ${
            isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200'
          }`}
        >
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Recently Studied</span>
            {recentlyStudiedTopic ? (
              <div className="mt-2 space-y-1">
                <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{recentlyStudiedTopic.name}</h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  State: <span className="text-orange-500">{recentlyStudiedTopic.masteryState || 'In Progress'}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 mt-2 italic">No study logs detected yet.</p>
            )}
          </div>
          {recentlyStudiedTopic?.lastStudiedDate && (
            <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2 mt-2">
              Last Studied: {recentlyStudiedTopic.lastStudiedDate}
            </div>
          )}
        </div>

        {/* Card 2: Next Recommended */}
        <div
          onClick={() => setActiveTab('topics')}
          className={`p-4 rounded-xl border cursor-pointer transition hover:border-orange-500/50 flex flex-col justify-between ${
            isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200'
          }`}
        >
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Next Recommendation</span>
            {nextRecommendedTopic ? (
              <div className="mt-2 space-y-1">
                <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{nextRecommendedTopic.name}</h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Syllabus: <span className="text-orange-500">{nextRecommendedTopic.category}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-500 mt-2 italic">All topics completed!</p>
            )}
          </div>
          {nextRecommendedTopic && (
            <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2 mt-2 flex items-center justify-between">
              <span>Difficulty: {nextRecommendedTopic.difficulty}</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          )}
        </div>

        {/* Card 3: Weak Area Reminders */}
        <div
          onClick={() => setActiveTab('topics')}
          className={`p-4 rounded-xl border cursor-pointer transition hover:border-orange-500/50 flex flex-col justify-between ${
            isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200'
          }`}
        >
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Weak Areas Tracker</span>
              {weakTopics.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="mt-2">
              <h4 className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{weakTopics.length} <span className={`text-xs font-sans font-normal ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>topics marked weak</span></h4>
              {weakTopics.length > 0 ? (
                <p className="text-[11px] text-rose-400 mt-1 truncate">
                  Needs practice: {weakTopics[0].name}
                </p>
              ) : (
                <p className="text-xs text-emerald-500 mt-1 font-mono font-semibold">All areas robust!</p>
              )}
            </div>
          </div>
          <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2 mt-2">
            Target Weak Areas inside Syllabus
          </div>
        </div>

        {/* Card 4: Revision Planner */}
        <div
          onClick={() => setActiveTab('topics')}
          className={`p-4 rounded-xl border cursor-pointer transition hover:border-orange-500/50 flex flex-col justify-between ${
            isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200'
          }`}
        >
          <div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Spaced-Revision Planner</span>
            <div className="mt-2">
              <h4 className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{revisionDueTopics.length} <span className={`text-xs font-sans font-normal ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>topics due</span></h4>
              {revisionDueTopics.length > 0 ? (
                <p className="text-[11px] text-orange-500 font-semibold mt-1 truncate">
                  Next due: {revisionDueTopics[0].name}
                </p>
              ) : (
                <p className="text-xs text-neutral-500 mt-1 italic">No pending revision targets.</p>
              )}
            </div>
          </div>
          <div className="text-[9px] font-mono text-neutral-500 border-t border-neutral-800/60 pt-2 mt-2">
            Spaced Repetition active
          </div>
        </div>

      </div>

      {/* Focus Area: Today's Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Daily Task Card */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  Schedules for Day {currentDay?.dayNumber}
                  {currentDayNumber % 7 === 0 && (
                    <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold animate-pulse">
                      REVISION DAY
                    </span>
                  )}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-1 rounded font-semibold uppercase tracking-wider ${
                  currentDay?.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : currentDay?.status === 'Skipped'
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : currentDay?.status === 'Partial'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {currentDay?.status}
              </span>
            </div>

            {/* Topic Study List */}
            <div className="space-y-4 mb-6">
              <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                1. Master Core Concepts
              </h3>
              {currentDay?.assignedTopicIds.length === 0 ? (
                <p className="text-sm text-neutral-500 italic pl-4 font-sans">No major topics assigned today. Focus on weak areas & backlog revision!</p>
              ) : (
                <div className="space-y-3 pl-2">
                  {currentDay?.assignedTopicIds.map((tid) => {
                    const topic = getTopicDetails(tid);
                    if (!topic) return null;
                    return (
                      <div
                        key={tid}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                          isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-200 text-neutral-700'}`}>
                              {topic.category}
                            </span>
                            {topic.isWeakTopic && (
                              <span className="text-[9px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                                Weak
                              </span>
                            )}
                            {currentDay?.carryForwardTopicIds?.includes(tid) && (
                              <span className="text-[9px] font-mono bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Carried Forward
                              </span>
                            )}
                          </div>
                          <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{topic.description}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-mono text-neutral-500">{topic.estimatedHours} hrs</span>
                          <button
                            onClick={() => onToggleTopicStatus(topic.id)}
                            className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border transition ${
                              topic.completionStatus === 'Completed'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                                : topic.completionStatus === 'In Progress'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                                : isDark
                                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                : 'bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-neutral-900'
                            }`}
                          >
                            {topic.completionStatus}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Problem Practice List */}
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                2. Solve Coding Challenges
              </h3>
              {currentDay?.assignedProblemIds.length === 0 ? (
                <p className="text-sm text-neutral-500 italic pl-4 font-sans">No structured practice problems for today.</p>
              ) : (
                <div className="space-y-3 pl-2">
                  {currentDay?.assignedProblemIds.map((pid) => {
                    const problem = getProblemDetails(pid);
                    if (!problem) return null;
                    return (
                      <div
                        key={pid}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                          isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{problem.title}</span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                                problem.difficulty === 'Easy'
                                  ? isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                                  : problem.difficulty === 'Medium'
                                  ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-800'
                                  : isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-850'
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-neutral-500">Syllabus Context: {problem.topicName}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {problem.url && (
                            <a
                              href={problem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono text-orange-500 hover:underline flex items-center gap-1"
                            >
                              Code <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                          <select
                            value={problem.status}
                            onChange={(e) => onToggleProblemStatus(problem.id, e.target.value as Problem['status'])}
                            className={`text-xs font-mono rounded-lg p-1.5 focus:outline-none focus:border-orange-500 border ${
                              isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-black border-black text-[#ffffff]'
                            }`}
                          >
                            <option value="Unsolved">Unsolved</option>
                            <option value="Solved">Solved</option>
                            <option value="Revision">Revision</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className={`border-t mt-8 pt-6 flex flex-wrap gap-3 ${
              isDark ? 'border-neutral-800/80' : 'border-neutral-200'
            }`}>
              <button
                onClick={() => onUpdateDayStatus(currentDay.dayNumber, 'Completed')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Day
              </button>
              <button
                onClick={() => onUpdateDayStatus(currentDay.dayNumber, 'Partial')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-600 border border-amber-500/20 font-semibold text-sm transition"
              >
                <AlertCircle className="w-4 h-4" />
                Partial Progress
              </button>
              <button
                onClick={() => onUpdateDayStatus(currentDay.dayNumber, 'Skipped')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-200 hover:bg-neutral-350 text-neutral-700 font-semibold text-sm transition"
              >
                <HelpCircle className="w-4 h-4" />
                Skip & Reschedule
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Right Column: Summary, Consistency, Metrics */}
        <div className="space-y-6">
          {/* STUDY FOCUS TIMER WIDGET */}
          <div
            className={`p-6 rounded-2xl border relative overflow-hidden ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            {/* Background decoration */}
            {timerRunning && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-orange-500 animate-ping m-4" />
            )}

            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                Focus Session Tracker
              </h3>
            </div>

            {/* CASE 1: LOGGING COMPLETED SESSION FORM */}
            {showLogForm ? (
              <div className="space-y-4 animate-fade-in">
                <div className={`p-3.5 rounded-xl border ${
                  isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">Completed Focus</span>
                  <span className={`text-sm font-bold block mt-0.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{timerFocus.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      value={loggedMinutes}
                      onChange={(e) => setLoggedMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full text-xs rounded-lg p-2 font-mono focus:outline-none focus:border-orange-500 ${
                        isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Productive Rating</label>
                    <div className="flex items-center gap-1.5 h-9">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setProductivityStars(star)}
                          className="focus:outline-none"
                          title={`${star} Stars`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= productivityStars ? 'text-orange-500 fill-orange-500' : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Study Notes / Reflections</label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="e.g. Understood double pointers method, resolved 2 edge cases"
                    className={`w-full text-xs rounded-lg p-2.5 focus:outline-none focus:border-orange-500 font-sans leading-relaxed ${
                      isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                    }`}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveLoggedSession}
                    className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs uppercase tracking-wider font-mono transition"
                  >
                    Save Session
                  </button>
                  <button
                    onClick={() => setShowLogForm(false)}
                    className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : timerRunning ? (
              /* CASE 2: TIMER IS RUNNING */
              <div className="space-y-4 text-center py-2 animate-fade-in">
                <span className="text-[10px] font-mono text-orange-500 uppercase font-bold tracking-widest block bg-orange-500/10 py-1 px-3 rounded-full w-fit mx-auto">
                  Studying: {timerFocus.name}
                </span>

                <div className={`text-3xl font-mono font-extrabold tracking-widest py-1.5 rounded-2xl border shadow-inner ${
                  isDark ? 'text-white bg-neutral-950/40 border-neutral-850' : 'text-neutral-900 bg-neutral-100 border-neutral-200'
                }`}>
                  {formatTimerValue(timerSeconds)}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={handleStopTimer}
                    className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition"
                  >
                    <Square className="w-3.5 h-3.5 fill-white text-white" />
                    Stop & Log
                  </button>
                  <button
                    onClick={handleCancelTimer}
                    className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-500 font-bold text-xs uppercase tracking-wider font-mono transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* CASE 3: TIMER IS IDLE (SELECT AND START) */
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1.5">
                    What are you studying today?
                  </label>
                  <select
                    id="focus-target-select"
                    onChange={(e) => {
                      const val = e.target.value;
                      // Store temporarily in state
                    }}
                    className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-300 focus:outline-none focus:border-orange-500 font-sans"
                  >
                    <option value="general||General Study Session">General Study Session</option>
                    <option value="revision||Active Backlog Revision">Revision Review</option>
                    {currentDay?.assignedTopicIds.length > 0 && <optgroup label="Assigned Topics">
                      {currentDay.assignedTopicIds.map(tid => {
                        const t = getTopicDetails(tid);
                        if (!t) return null;
                        return (
                          <option key={t.id} value={`topic|${t.id}|Topic: ${t.name}`}>
                            {t.name}
                          </option>
                        );
                      })}
                    </optgroup>}
                    {currentDay?.assignedProblemIds.length > 0 && <optgroup label="Practice Problems">
                      {currentDay.assignedProblemIds.map(pid => {
                        const p = getProblemDetails(pid);
                        if (!p) return null;
                        return (
                          <option key={p.id} value={`problem|${p.id}|Problem: ${p.title}`}>
                            {p.title}
                          </option>
                        );
                      })}
                    </optgroup>}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const selectEl = document.getElementById('focus-target-select') as HTMLSelectElement;
                    const val = selectEl?.value || 'general||General Study Session';
                    const [type, id, name] = val.split('|');
                    handleStartTimer(type, id, name);
                  }}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
                  Start Focus Timer
                </button>
              </div>
            )}
          </div>

          {/* Main Progress Block */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className="text-sm font-semibold text-neutral-400 font-mono uppercase tracking-wider mb-4">
              Overview Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-400 mb-1 font-mono">
                  <span>REMAINING DAYS</span>
                  <span>{roadmap.filter((d) => d.status !== 'Completed').length} / {roadmap.length} Days</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(roadmap.filter((d) => d.status === 'Completed').length / roadmap.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-400 mb-1 font-mono">
                  <span>TOPICS MASTERED</span>
                  <span>{completedTopics} / {totalTopics}</span>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedTopics / totalTopics) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-400 mb-1 font-mono">
                  <span>PROBLEMS SOLVED</span>
                  <span>{solvedProblems} / {totalProblems}</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(solvedProblems / totalProblems) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`pt-4 border-t grid grid-cols-2 gap-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-neutral-950/50 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    Active Days
                  </span>
                  <span className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{activeDaysCount}</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${
                  isDark ? 'bg-neutral-950/50 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    In Revision
                  </span>
                  <span className="text-xl font-bold text-orange-500 font-mono">{revisionProblems}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Non-Gamified Consistency Graph */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-400 font-mono uppercase tracking-wider">
                Consistency Log
              </h3>
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Recent 14 Days</span>
            </div>

            {/* Mini contribution style grid */}
            <div className="grid grid-cols-7 gap-2.5 mb-4">
              {recentDays.map((d) => (
                <div
                  key={d.dayNumber}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    title={`Day ${d.dayNumber}: ${d.status}`}
                    className={`w-full aspect-square rounded-md transition ${
                      d.status === 'Completed'
                        ? 'bg-emerald-500'
                        : d.status === 'Partial'
                        ? 'bg-amber-500'
                        : d.status === 'Skipped'
                        ? 'bg-rose-500'
                        : 'bg-neutral-800'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-neutral-500">D{d.dayNumber}</span>
                </div>
              ))}
            </div>

            {/* Grid Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-800/60">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-neutral-800" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Done</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>Skipped</span>
              </div>
            </div>
          </div>

          {/* Shortcut Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`p-4 rounded-xl border text-left transition hover:border-orange-500 group ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                Full Plan
              </span>
              <span className={`text-xs font-semibold group-hover:text-orange-500 flex items-center gap-1 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Open Roadmap <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => setActiveTab('topics')}
              className={`p-4 rounded-xl border text-left transition hover:border-orange-500 group ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                Syllabus
              </span>
              <span className={`text-xs font-semibold group-hover:text-orange-500 flex items-center gap-1 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                Explore Topics <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
