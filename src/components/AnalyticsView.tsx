/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Topic, Problem, RoadmapDay, TopicCategory, UserProfile } from '../types';
import {
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Flame,
  CalendarRange,
  User,
  Trophy,
  Zap,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Calendar,
  BookOpen,
  Code2,
  CheckCircle2,
  Star,
  Activity,
  Award as AwardIcon
} from 'lucide-react';

interface AnalyticsViewProps {
  theme: 'dark' | 'light';
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  profile: UserProfile;
  studySessions?: any[];
}

export default function AnalyticsView({
  theme,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  profile,
  studySessions = []
}: AnalyticsViewProps) {
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'review' | 'charts'>('overview');

  // Overall calculations
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.completionStatus === 'Completed').length;
  const inProgressTopics = topics.filter((t) => t.completionStatus === 'In Progress').length;
  const pendingTopics = totalTopics - completedTopics - inProgressTopics;

  const totalProblems = problems.length;
  const solvedProblems = problems.filter((p) => p.status === 'Solved').length;
  const revisionProblems = problems.filter((p) => p.status === 'Revision').length;
  const unsolvedProblems = totalProblems - solvedProblems - revisionProblems;

  // --- 1. WEAK AND STRONG TOPICS DETECTION ENGINE ---
  // A topic is weak if: manual isWeakTopic is true, OR has high attempts on unsolved related problems, OR skipped/revision needed.
  // A topic is strong if: masteryState is 'Mastered', OR all problems solved easily, OR isMastered is true.
  const topicsAnalysis = topics.map((topic) => {
    const relatedProblems = problems.filter((p) => p.topicId === topic.id);
    const solvedRelated = relatedProblems.filter((p) => p.status === 'Solved');
    const unsolvedRelated = relatedProblems.filter((p) => p.status === 'Unsolved');
    
    // Average attempts
    const avgAttempts = relatedProblems.length > 0 
      ? relatedProblems.reduce((sum, p) => sum + p.attemptCount, 0) / relatedProblems.length
      : 0;
    
    // Repeated failures definition
    const hasRepeatedFailures = relatedProblems.some(p => p.status !== 'Solved' && p.attemptCount >= 3);

    let score = 0;
    if (topic.completionStatus === 'Completed') score += 40;
    if (topic.masteryState === 'Mastered') score += 20;
    if (topic.masteryState === 'Practiced') score += 15;
    if (relatedProblems.length > 0) {
      score += (solvedRelated.length / relatedProblems.length) * 40;
    } else {
      score += 40; // no problems, default full practice points
    }

    // Penalties
    if (topic.isWeakTopic) score -= 30;
    if (topic.masteryState === 'Revision Needed') score -= 15;
    if (hasRepeatedFailures) score -= 25;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Categorization
    const isDetectedWeak = topic.isWeakTopic || finalScore < 45 || hasRepeatedFailures || topic.masteryState === 'Revision Needed';
    const isDetectedStrong = (topic.completionStatus === 'Completed' && finalScore >= 75) || topic.masteryState === 'Mastered' || topic.isMastered;

    return {
      ...topic,
      score: finalScore,
      isDetectedWeak,
      isDetectedStrong,
      solvedCount: solvedRelated.length,
      totalProblemsCount: relatedProblems.length,
      avgAttempts,
      hasRepeatedFailures
    };
  });

  const weakTopics = topicsAnalysis.filter(t => t.isDetectedWeak);
  const strongTopics = topicsAnalysis.filter(t => t.isDetectedStrong);

  // --- 2. REVISION PRIORITY RANKING SYSTEM ---
  // Ranks topics based on priority score: difficulty, mistakes, time since last study, mastery status.
  const revisionDueItems = topicsAnalysis
    .filter(t => t.completionStatus === 'Completed' || t.completionStatus === 'In Progress')
    .map(t => {
      let priorityScore = 0;
      
      // Weight 1: Difficulty
      if (t.difficulty === 'Hard') priorityScore += 30;
      else if (t.difficulty === 'Medium') priorityScore += 20;
      else priorityScore += 10;

      // Weight 2: Mastery state
      if (t.masteryState === 'Revision Needed') priorityScore += 40;
      else if (t.masteryState === 'Reading') priorityScore += 20;
      else if (t.masteryState === 'Not Started') priorityScore += 30;
      else if (t.masteryState === 'Understood') priorityScore += 15;
      else if (t.masteryState === 'Mastered') priorityScore += 5; // mastered needs less immediate revision

      // Weight 3: Failures and weakness
      if (t.isDetectedWeak) priorityScore += 25;
      if (t.hasRepeatedFailures) priorityScore += 15;

      // Weight 4: Priority flag
      if (t.revisionPriority === 'High') priorityScore += 25;
      else if (t.revisionPriority === 'Medium') priorityScore += 10;

      return {
        ...t,
        revisionScore: priorityScore
      };
    })
    .sort((a, b) => b.revisionScore - a.revisionScore);

  const reviseToday = revisionDueItems.slice(0, 3);
  const reviseThisWeek = revisionDueItems.slice(3, 8);
  const reviseLater = revisionDueItems.slice(8);

  // --- 3. ROADMAP COMPLETION FORECAST ENGINE ---
  // Calculates pace, estimated completion date, whether realistic.
  const passedRoadmapDays = roadmap.filter((d) => d.status !== 'Pending');
  const completedRoadmapDays = roadmap.filter((d) => d.status === 'Completed');
  const skippedRoadmapDays = roadmap.filter((d) => d.status === 'Skipped');
  const partialRoadmapDays = roadmap.filter((d) => d.status === 'Partial');

  // Elapsed days calculation
  const startDateObj = new Date(profile.startDate);
  const todayObj = new Date();
  const elapsedDays = Math.max(1, Math.ceil((todayObj.getTime() - startDateObj.getTime()) / (24 * 60 * 60 * 1000)));

  // Pace: roadmap days completed / elapsed calendar days
  const actualPace = passedRoadmapDays.length > 0 
    ? (completedRoadmapDays.length + (partialRoadmapDays.length * 0.5)) / elapsedDays
    : 1;

  // Forecast calculations
  const remainingRoadmapDays = roadmap.length - completedRoadmapDays.length;
  const daysNeededToComplete = actualPace > 0 
    ? Math.ceil(remainingRoadmapDays / actualPace)
    : remainingRoadmapDays;

  const forecastedEndDate = new Date();
  forecastedEndDate.setDate(forecastedEndDate.getDate() + daysNeededToComplete);

  const plannedEndDate = new Date(profile.endDate);
  const isAheadOfSchedule = forecastedEndDate.getTime() < plannedEndDate.getTime();
  const daysDifference = Math.ceil(Math.abs(forecastedEndDate.getTime() - plannedEndDate.getTime()) / (24 * 60 * 60 * 1000));
  
  let paceStatus: 'Ahead' | 'On Track' | 'Behind' = 'On Track';
  if (completedRoadmapDays.length === roadmap.length) {
    paceStatus = 'On Track';
  } else if (actualPace < 0.8) {
    paceStatus = 'Behind';
  } else if (actualPace > 1.2) {
    paceStatus = 'Ahead';
  }

  const remainingWorkloadRealistic = actualPace >= 0.7;

  // --- 4. CONSISTENCY & BEHAVIORAL INSIGHTS ---
  // Analyze consistency patterns, streaks, best study days.
  const totalStudyDaysCount = completedRoadmapDays.length + partialRoadmapDays.length;
  const totalHoursStudied = studySessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60;
  
  // Best study days calculation (dummy analysis based on weekdays of completed days)
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const completionByDayOfWeek = [0, 0, 0, 0, 0, 0, 0];
  const countByDayOfWeek = [0, 0, 0, 0, 0, 0, 0];

  roadmap.forEach(day => {
    try {
      const d = new Date(day.date);
      const dayIdx = d.getDay();
      if (!isNaN(dayIdx)) {
        countByDayOfWeek[dayIdx]++;
        if (day.status === 'Completed' || day.status === 'Partial') {
          completionByDayOfWeek[dayIdx]++;
        }
      }
    } catch {}
  });

  const dayOfWeekRates = weekdays.map((name, idx) => {
    const total = countByDayOfWeek[idx];
    const done = completionByDayOfWeek[idx];
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { name, rate, count: done };
  });

  const bestStudyDay = [...dayOfWeekRates].sort((a, b) => b.rate - a.rate)[0]?.name || 'Saturday';
  const worstStudyDay = [...dayOfWeekRates].filter(r => r.count > 0 || r.rate < 100).sort((a, b) => a.rate - b.rate)[0]?.name || 'Wednesday';

  // Weekend consistency vs Weekday consistency
  const weekendDays = dayOfWeekRates.filter(r => r.name === 'Saturday' || r.name === 'Sunday');
  const weekdayDays = dayOfWeekRates.filter(r => r.name !== 'Saturday' && r.name !== 'Sunday');

  const weekendRate = Math.round(weekendDays.reduce((sum, r) => sum + r.rate, 0) / 2);
  const weekdayRate = Math.round(weekdayDays.reduce((sum, r) => sum + r.rate, 0) / 5);

  // Streaks
  let currentStreak = 0;
  let maxStreak = 0;
  let runningStreak = 0;

  roadmap.forEach((day) => {
    if (day.status === 'Completed' || day.status === 'Partial') {
      runningStreak++;
      if (runningStreak > maxStreak) {
        maxStreak = runningStreak;
      }
    } else if (day.status === 'Skipped') {
      runningStreak = 0;
    }
  });
  currentStreak = runningStreak;

  // --- 5. TOPIC COVERAGE ANALYTICS ---
  const categories: TopicCategory[] = [
    'Java Basics',
    'OOP',
    'Collections',
    'Basic DSA',
    'Linear DSA',
    'Non-Linear DSA',
    'Algorithms',
    'Advanced DSA'
  ];

  const categoryProgress = categories.map((cat) => {
    const catTopics = topicsAnalysis.filter((t) => t.category === cat);
    const catCompleted = catTopics.filter((t) => t.completionStatus === 'Completed').length;
    const catTotal = catTopics.length;
    const rate = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    const catProblems = problems.filter(p => catTopics.some(t => t.id === p.topicId));
    const solvedProbs = catProblems.filter(p => p.status === 'Solved').length;

    return {
      name: cat,
      totalTopics: catTotal,
      completedTopics: catCompleted,
      rate,
      totalProblems: catProblems.length,
      solvedProblems: solvedProbs
    };
  });

  // --- 6. PROBLEM-SOLVING ANALYTICS ---
  const solvedEasy = problems.filter(p => p.difficulty === 'Easy' && p.status === 'Solved').length;
  const totalEasy = problems.filter(p => p.difficulty === 'Easy').length;
  const solvedMedium = problems.filter(p => p.difficulty === 'Medium' && p.status === 'Solved').length;
  const totalMedium = problems.filter(p => p.difficulty === 'Medium').length;
  const solvedHard = problems.filter(p => p.difficulty === 'Hard' && p.status === 'Solved').length;
  const totalHard = problems.filter(p => p.difficulty === 'Hard').length;

  const bookmarkedProblemsCount = problems.filter(p => p.bookmarked).length;
  const repeatedFailuresProblems = problems.filter(p => p.status !== 'Solved' && p.attemptCount >= 3);

  // --- 7. SMART ALERTS ENGINE ---
  // Highlight overdue revision, rescheduling, heavy loads, weak topics.
  const smartAlerts = [];

  // Alert: Overdue Revision
  const overdueRevisionCount = topics.filter(t => t.isRevisionDue || t.masteryState === 'Revision Needed').length;
  if (overdueRevisionCount > 0) {
    smartAlerts.push({
      type: 'warning',
      title: 'Overdue Spaced Revision',
      message: `${overdueRevisionCount} syllabus topics are due for active revision. Complete review questions to lock in concepts.`,
      action: 'Revise now'
    });
  }

  // Alert: Rescheduling Needed
  if (skippedRoadmapDays.length > 0) {
    smartAlerts.push({
      type: 'danger',
      title: 'Unresolved Backlogs Detected',
      message: `You have skipped ${skippedRoadmapDays.length} study days. Click 'Rebalance' on the Dashboard to reschedule without loss.`,
      action: 'Reschedule plan'
    });
  }

  // Alert: Upcoming Bottleneck
  const upcomingAdvancedDSA = roadmap
    .slice(currentDayNumber, currentDayNumber + 4)
    .some(d => d.assignedTopicIds.some(tid => topics.find(t => t.id === tid)?.category === 'Non-Linear DSA' || topics.find(t => t.id === tid)?.category === 'Advanced DSA'));
  if (upcomingAdvancedDSA) {
    smartAlerts.push({
      type: 'info',
      title: 'Upcoming Heavy Workload',
      message: `Non-linear or Advanced DSA concepts are coming up in the next 3 days. Dedicate focused hours to prevent backlogs.`,
      action: 'Preview material'
    });
  }

  // Alert: Weak Topics
  if (weakTopics.length > 0) {
    smartAlerts.push({
      type: 'danger',
      title: 'Weak Topic Backlog',
      message: `'${weakTopics[0].name}' has been marked weak due to unsolved problems or high attempt counts. Practice challenges recommended.`,
      action: 'Practice'
    });
  }

  // Alert: Consistency
  if (actualPace < 0.75) {
    smartAlerts.push({
      type: 'warning',
      title: 'Consistency Momentum Drop',
      message: `Your roadmap completion pace has slipped to ${Math.round(actualPace * 100)}%. Set smaller daily goals to build routine back up.`,
      action: 'Adjust pace'
    });
  }

  // Formatting date helper
  const formatDateStr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // RECHARTS CHART DATA PREPARATION
  // 1. Completion trend over time (cumulative days completed)
  let cumulativeCompleted = 0;
  const completionOverTimeData = roadmap
    .filter((d) => d.dayNumber <= currentDayNumber)
    .map((day) => {
      if (day.status === 'Completed') cumulativeCompleted++;
      else if (day.status === 'Partial') cumulativeCompleted += 0.5;
      return {
        name: `Day ${day.dayNumber}`,
        Completed: cumulativeCompleted,
        Planned: day.dayNumber
      };
    });

  // 2. Study hours by day from logged sessions
  // Map last 7 days study hours
  const studyHoursData = roadmap
    .slice(Math.max(0, currentDayNumber - 7), currentDayNumber)
    .map((day) => {
      const daySessions = studySessions.filter(s => s.date === day.date);
      const minutesSpent = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      return {
        name: `Day ${day.dayNumber}`,
        Actual: Math.round((minutesSpent / 60) * 10) / 10,
        Target: day.estimatedHours
      };
    });

  return (
    <div className="space-y-6">
      {/* Page Title & Tab Switcher */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            <BarChart3 className="w-6 h-6 text-orange-500" />
            Adaptive Analytics Studio
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Genuinely useful visual insights, roadmap forecasts, weak spot diagnostics, and study patterns.
          </p>
        </div>

        {/* Sub-tabs switcher */}
        <div className={`flex p-1 rounded-xl gap-1 border ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
              activeSubTab === 'overview'
                ? 'bg-orange-500 text-neutral-950 font-extrabold'
                : `text-neutral-400 ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Journey Overview
          </button>
          <button
            onClick={() => setActiveSubTab('review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
              activeSubTab === 'review'
                ? 'bg-orange-500 text-neutral-950 font-extrabold'
                : `text-neutral-400 ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            Weekly & Monthly
          </button>
          <button
            onClick={() => setActiveSubTab('charts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
              activeSubTab === 'charts'
                ? 'bg-orange-500 text-neutral-950 font-extrabold'
                : `text-neutral-400 ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Visual Charts
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: JOURNEY OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Smart Alerts Center */}
          {smartAlerts.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                Smart Alerts & Focus Diagnostics ({smartAlerts.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex gap-3.5 items-start relative ${
                      alert.type === 'danger'
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                        : alert.type === 'warning'
                        ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                        : 'bg-orange-500/5 border-orange-500/20 text-orange-400'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className={`text-sm font-bold leading-none ${isDark ? 'text-white' : 'text-neutral-900'}`}>{alert.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Forecast Card & Milestone Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Forecast Panel (Col Span 7) */}
            <div
              className={`p-6 rounded-2xl border lg:col-span-7 flex flex-col justify-between ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-orange-500 uppercase block font-bold tracking-wider">
                  Roadmap Completion Forecast
                </span>
                <h3 className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Journey Schedule Diagnostic</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Our algorithm estimates completion dates based on your real-world completion velocity of {Math.round(actualPace * 100)}% speed.
                </p>

                {/* Grid Comparison */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Original Goal</span>
                    <span className={`text-xs font-bold font-mono mt-1 block ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {formatDateStr(profile.endDate)}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Forecasted End</span>
                    <span className="text-xs font-bold text-orange-400 font-mono mt-1 block">
                      {formatDateStr(forecastedEndDate.toISOString().split('T')[0])}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Roadmap Pace</span>
                    <span className={`text-xs font-bold font-mono mt-1 block ${
                      paceStatus === 'Ahead' ? 'text-emerald-400' : paceStatus === 'Behind' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {paceStatus === 'Ahead' ? 'Ahead' : paceStatus === 'Behind' ? 'Behind' : 'On Track'}
                    </span>
                  </div>
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Feasible Plan</span>
                    <span className={`text-xs font-bold font-mono mt-1 block ${
                      remainingWorkloadRealistic ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {remainingWorkloadRealistic ? 'Highly Realistic' : 'Tight/Unrealistic'}
                    </span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className={`p-4 rounded-xl text-xs mt-6 leading-relaxed border ${
                  isDark ? 'bg-neutral-950/50 border-neutral-850 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}>
                  {paceStatus === 'Ahead' ? (
                    <p>
                      🎉 **Excellent Velocity!** You are studying at a pace faster than planned. You are currently scheduled to finish your roadmap **{daysDifference} days ahead** of your initial goal date!
                    </p>
                  ) : paceStatus === 'Behind' ? (
                    <p>
                      ⚠️ **Backlog Momentum Dropping.** Based on your study skips, you are currently projected to complete the curriculum **{daysDifference} days behind schedule**. We recommend using the **'Rebalance Schedule'** tool on the Dashboard to spread out remaining tasks comfortably.
                    </p>
                  ) : (
                    <p>
                      📈 **Perfect Consistency!** You are studying at exactly your target pace. If you keep this daily cadence, you will comfortably hit your Java + DSA goals on or slightly before your target end date!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Revision Priorities Panel (Col Span 5) */}
            <div
              className={`p-6 rounded-2xl border lg:col-span-5 ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">Spaced Repetition Scheduler</span>
                  <h3 className={`text-md font-bold mt-0.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Active Revision Priorities</h3>
                </div>
                <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20 text-xs font-mono font-bold">
                  {revisionDueItems.length} active
                </div>
              </div>

              {/* Priorities breakdown */}
              <div className="space-y-3">
                <div>
                  <span className="text-[9px] font-mono text-rose-500 font-bold uppercase block mb-1.5">Revision Needed Today</span>
                  <div className="space-y-1.5">
                    {reviseToday.map(t => (
                      <div key={t.id} className="p-2.5 bg-rose-500/5 border border-rose-500/15 rounded-lg flex justify-between items-center text-xs">
                        <span className={`font-semibold truncate max-w-[200px] ${isDark ? 'text-white' : 'text-neutral-900'}`}>{t.name}</span>
                        <span className="text-[9px] font-mono text-neutral-400">Score: {t.revisionScore}</span>
                      </div>
                    ))}
                    {reviseToday.length === 0 && (
                      <p className="text-[11px] text-neutral-500 italic">No urgent revision due today. Great job!</p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-amber-500 font-bold uppercase block mb-1.5">Queue For This Week</span>
                  <div className="space-y-1.5">
                    {reviseThisWeek.slice(0, 3).map(t => (
                      <div key={t.id} className="p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-lg flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-300 truncate max-w-[200px]">{t.name}</span>
                        <span className="text-[9px] font-mono text-neutral-500">Score: {t.revisionScore}</span>
                      </div>
                    ))}
                    {reviseThisWeek.length === 0 && (
                      <p className="text-[11px] text-neutral-500 italic">No upcoming revision queued.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic Coverage Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topic Category Coverage (Col Span 2) */}
            <div
              className={`p-6 rounded-2xl border lg:col-span-2 ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                Syllabus Architecture Analytics
              </span>
              <h3 className={`text-md font-bold mt-0.5 mb-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Curriculum Mastery by Learning Area</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {categoryProgress.map((cat) => (
                  <div key={cat.name} className={`space-y-1.5 p-3 rounded-xl border ${
                    isDark ? 'bg-neutral-950/20 border-neutral-850' : 'bg-neutral-50 border-neutral-200 shadow-sm'
                  }`}>
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>{cat.name}</span>
                      <span className="text-orange-500 font-mono font-bold">{cat.rate}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div
                        className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${cat.rate}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-0.5">
                      <span>{cat.completedTopics} of {cat.totalTopics} concepts</span>
                      <span>{cat.solvedProblems} solved</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem-Solving Practice Analytics */}
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                Practice Arena Metrics
              </span>
              <h3 className={`text-md font-bold mt-0.5 mb-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Problem-Solving Analytics</h3>

              <div className="space-y-4">
                {/* Solved by difficulty */}
                <div className="space-y-3">
                  {/* Easy */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-mono font-semibold uppercase">Easy</span>
                      <span className={`font-mono font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{solvedEasy} / {totalEasy} Solved</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${totalEasy > 0 ? (solvedEasy / totalEasy) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-400 font-mono font-semibold uppercase">Medium</span>
                      <span className={`font-mono font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{solvedMedium} / {totalMedium} Solved</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${totalMedium > 0 ? (solvedMedium / totalMedium) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-rose-400 font-mono font-semibold uppercase">Hard</span>
                      <span className={`font-mono font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{solvedHard} / {totalHard} Solved</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div
                        className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${totalHard > 0 ? (solvedHard / totalHard) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom practice stats */}
                <div className={`pt-4 border-t space-y-2.5 text-xs ${isDark ? 'border-neutral-850' : 'border-neutral-200'}`}>
                  <div className={`flex justify-between items-center p-2 rounded-lg border ${isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-neutral-400">Bookmarked challenges</span>
                    <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {bookmarkedProblemsCount}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center p-2 rounded-lg border ${isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-200'}`}>
                    <span className="text-neutral-400">Tricky / repeated failures</span>
                    <span className={`font-bold font-mono ${
                      repeatedFailuresProblems.length > 0 ? 'text-rose-400' : 'text-neutral-500'
                    }`}>
                      {repeatedFailuresProblems.length} unsolved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WEEKLY & MONTHLY REVIEWS */}
      {activeSubTab === 'review' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top banner: Streaks, consistency & duration logs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Total Study Days</span>
              <span className={`text-2xl font-bold font-mono block mt-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{totalStudyDaysCount}</span>
              <span className="text-[10px] font-mono text-neutral-500">of {passedRoadmapDays.length} elapsed days</span>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Total Hours Studied</span>
              <span className="text-2xl font-bold text-orange-500 font-mono block mt-1.5">
                {Math.round(totalHoursStudied * 10) / 10}h
              </span>
              <span className="text-[10px] font-mono text-neutral-500">logged in focus sessions</span>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Current Study Streak</span>
              <span className={`text-2xl font-bold font-mono block mt-1.5 flex items-center justify-center gap-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                {currentStreak} days
              </span>
              <span className="text-[10px] font-mono text-neutral-500">max streak: {maxStreak} days</span>
            </div>

            <div
              className={`p-5 rounded-2xl border text-center ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Skipped Study Days</span>
              <span className="text-2xl font-bold text-rose-500 font-mono block mt-1.5">{skippedRoadmapDays.length}</span>
              <span className="text-[10px] font-mono text-neutral-500">requiring rescheduling</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Weekly Consistency & Rhythm Panel (Col Span 7) */}
            <div
              className={`p-6 rounded-2xl border lg:col-span-7 ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                Study Rhythm Diagnostics
              </span>
              <h3 className={`text-md font-bold mt-0.5 mb-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Weekly Completion Rates & Best Days</h3>

              {/* Progress bars of weekdays */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                  {dayOfWeekRates.map((day) => (
                    <div key={day.name} className={`p-3 border rounded-xl text-center ${
                      isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">{day.name.slice(0,3)}</span>
                      <span className={`text-sm font-bold block mt-1 font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{day.rate}%</span>
                      <div className={`w-full h-1 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                        <div
                          className="bg-orange-500 h-1 rounded-full"
                          style={{ width: `${day.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-850 text-xs">
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Best Study Momentum</span>
                    <p className={`${isDark ? 'text-neutral-200' : 'text-neutral-750'} font-sans`}>
                      Your peak focus day is **{bestStudyDay}** where you hit your targets consistently. Study heavier topics on this day!
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Weekend Consistency</span>
                    <div className="flex justify-between items-center text-xs mt-1.5">
                      <span className="text-neutral-400">Saturday & Sunday rate</span>
                      <span className={`font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{weekendRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Weekday average rate</span>
                      <span className={`font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>{weekdayRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trend Reflections (Col Span 5) */}
            <div
              className={`p-6 rounded-2xl border lg:col-span-5 ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block">
                Journey Insights Reflective
              </span>
              <h3 className={`text-md font-bold mt-0.5 mb-5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>Monthly Trend & Diagnosis</h3>

              <div className="space-y-4">
                {/* Milestones completed check list */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>Java OOP Mastery Locked</span>
                      <p className="text-neutral-400">Class specifications, inheritance, polymorphism patterns understood.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className={`font-bold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>Linear DSA Foundations Laid</span>
                      <p className="text-neutral-400">Solved {problems.filter(p => p.topicId === 'arrays' || p.topicId === 'strings').filter(p => p.status === 'Solved').length} challenges in arrays and custom string builder mechanics.</p>
                    </div>
                  </div>

                  {weakTopics.length > 0 && (
                    <div className="flex items-start gap-2 text-xs p-2.5 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-400 block">Critical Weak Spot Diagnosed</span>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">
                          Practice related interview challenges for **'{weakTopics[0].name}'** to resolve high failure counts.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ADVANCED CHARTS */}
      {activeSubTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Roadmap Completion Trend Chart */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider mb-6 flex justify-between ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              <span>Roadmap Cumulative Progress</span>
              <span className="text-[10px] font-normal text-neutral-500">Planned vs. Actual</span>
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completionOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#262626" : "#e5e5e5"} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#171717' : '#ffffff',
                      borderColor: isDark ? '#262626' : '#e5e5e5',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDark ? '#ffffff' : '#171717'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Completed" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCompleted)" name="Actual Completion" />
                  <Line type="monotone" strokeDasharray="5 5" dataKey="Planned" stroke="#404040" strokeWidth={1.5} dot={false} name="Optimal Planned Pace" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Productive Daily Hours Chart */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider mb-6 flex justify-between ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              <span>Study Hours per Day (Last 7 Days)</span>
              <span className="text-[10px] font-normal text-neutral-500">Timer vs. Estimate</span>
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#262626" : "#e5e5e5"} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#171717' : '#ffffff',
                      borderColor: isDark ? '#262626' : '#e5e5e5',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDark ? '#ffffff' : '#171717'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Actual" fill="#f97316" name="Logged Productive Hours" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Target" fill={isDark ? "#262626" : "#d4d4d4"} name="Assigned Goal Hours" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Problem-Solving Distribution Chart */}
          <div
            className={`p-6 rounded-2xl border lg:col-span-2 ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <h3 className={`text-sm font-semibold font-mono uppercase tracking-wider mb-6 ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Problem-Solving volume by Topic Category
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#262626" : "#e5e5e5"} />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#171717' : '#ffffff',
                      borderColor: isDark ? '#262626' : '#e5e5e5',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: isDark ? '#ffffff' : '#171717'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="totalProblems" fill={isDark ? "#262626" : "#d4d4d4"} name="Syllabus Problems" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="solvedProblems" fill="#eab308" name="Solved Challenges" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
