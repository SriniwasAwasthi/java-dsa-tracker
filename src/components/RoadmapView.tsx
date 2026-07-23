/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  ListRestart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Code2,
  Info,
  CalendarDays,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Topic, Problem, RoadmapDay, UserProfile } from '../types';

interface RoadmapViewProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  setCurrentDayNumber: (day: number) => void;
  onUpdateDayStatus: (dayNumber: number, status: RoadmapDay['status']) => void;
  onRescheduleRoadmap: () => void;
}

export default function RoadmapView({
  theme,
  profile,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  setCurrentDayNumber,
  onUpdateDayStatus,
  onRescheduleRoadmap
}: RoadmapViewProps) {
  const isDark = theme === 'dark';
  const [expandedWeeks, setExpandedWeeks] = useState<{ [weekNum: number]: boolean }>({
    1: true, // Expand week 1 by default
    2: true
  });

  const getTopicDetails = (id: string) => topics.find((t) => t.id === id);
  const getProblemDetails = (id: string) => problems.find((p) => p.id === id);

  // Group roadmap days into 7-day weeks
  const weeksCount = profile.selectedDurationWeeks;
  const weeks: { weekNumber: number; days: RoadmapDay[] }[] = [];

  for (let w = 1; w <= weeksCount; w++) {
    const startIdx = (w - 1) * 7;
    const daysInWeek = roadmap.slice(startIdx, startIdx + 7);
    if (daysInWeek.length > 0) {
      weeks.push({ weekNumber: w, days: daysInWeek });
    }
  }

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }));
  };

  // Find if there are any overdue/skipped days that could benefit from rescheduled shift
  const missedDaysCount = roadmap.filter(
    (d) => d.dayNumber < currentDayNumber && (d.status === 'Skipped' || d.status === 'Partial' || d.status === 'Pending')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header and adaptive action panel */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            <Compass className="w-6 h-6 text-orange-500" />
            Study Roadmap
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Day-by-day structured learning plan spanning {profile.selectedDurationWeeks} weeks ({profile.selectedDurationWeeks * 7} days).
          </p>
        </div>
      </div>

      {/* Adaptive Scheduling Notification / Callout */}
      {missedDaysCount > 0 && (
        <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 mt-1 md:mt-0">
              <ListRestart className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Adaptive Shift Available</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                You have <span className="font-bold text-orange-500">{missedDaysCount} unfinished or skipped days</span>.
                Triggering the adaptive scheduler will carry forward skipped topics and distribute them evenly into future days, maintaining prerequisites and load balancing.
              </p>
            </div>
          </div>
          <button
            onClick={onRescheduleRoadmap}
            className="w-full md:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs font-mono tracking-wider uppercase rounded-xl transition"
          >
            Rebalance Roadmap
          </button>
        </div>
      )}

      {/* Timeline Layout */}
      <div className="space-y-6">
        {weeks.map((week) => {
          const isExpanded = !!expandedWeeks[week.weekNumber];
          const completedInWeek = week.days.filter((d) => d.status === 'Completed').length;
          const weekProgress = Math.round((completedInWeek / week.days.length) * 100);

          return (
            <div
              key={week.weekNumber}
              className={`rounded-2xl border transition ${
                isDark ? 'bg-neutral-900/20 border-neutral-800/80' : 'bg-white border-neutral-200'
              }`}
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week.weekNumber)}
                className={`w-full flex items-center justify-between p-5 text-left border-b ${
                  isDark ? 'border-neutral-800' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-neutral-600'
                    }`}>
                      Week {week.weekNumber}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Days {(week.weekNumber - 1) * 7 + 1} - {week.weekNumber * 7}
                    </p>
                  </div>
                  {/* Progress Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                      {weekProgress}% Done
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-32 rounded-full h-1.5 overflow-hidden hidden sm:block ${
                    isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                  }`}>
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${weekProgress}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Week Days List */}
              {isExpanded && (
                <div className="p-5 space-y-4">
                  {week.days.map((day) => {
                    const isCurrent = day.dayNumber === currentDayNumber;
                    return (
                      <div
                        key={day.dayNumber}
                        className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                          isCurrent
                            ? isDark
                              ? 'bg-neutral-800/60 border-orange-500/50 shadow-lg shadow-orange-500/5'
                              : 'bg-orange-50/20 border-orange-500/50 shadow-md'
                            : isDark
                            ? 'bg-neutral-950/40 border-neutral-800/50 hover:border-neutral-800'
                            : 'bg-neutral-50/50 border-neutral-200/80 hover:border-neutral-200'
                        }`}
                      >
                         {/* Day & Date Title */}
                        <div className="flex items-start gap-4 lg:w-1/4">
                          <button
                            onClick={() => setCurrentDayNumber(day.dayNumber)}
                            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono transition border ${
                              isDark
                                ? isCurrent
                                  ? 'bg-orange-500 text-neutral-950 border-orange-400 font-bold'
                                  : day.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : day.status === 'Skipped'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : day.status === 'Partial'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                                : isCurrent
                                ? 'bg-orange-500 text-neutral-950 border-orange-500 font-bold ring-2 ring-orange-500/25'
                                : `bg-black text-white font-bold ${
                                    day.status === 'Completed'
                                      ? 'border-emerald-500'
                                      : day.status === 'Skipped'
                                      ? 'border-rose-500'
                                      : day.status === 'Partial'
                                      ? 'border-amber-500'
                                      : 'border-black'
                                  }`
                            }`}
                          >
                            <span className="text-[10px] uppercase leading-none">Day</span>
                            <span className="text-md font-bold mt-0.5">{day.dayNumber}</span>
                          </button>
                          <div>
                            <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-neutral-600'}`}>
                              {new Date(day.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                weekday: 'short'
                              })}
                            </p>
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">
                              Est: {day.estimatedHours} hrs
                            </span>
                          </div>
                        </div>

                        {/* Content Syllabus (Topics & Problems) */}
                        <div className="flex-1 space-y-2 lg:px-4">
                          {/* Topics List */}
                          {day.assignedTopicIds.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <BookOpen className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                              {day.assignedTopicIds.map((tid) => {
                                const topic = getTopicDetails(tid);
                                return (
                                  <span
                                    key={tid}
                                    title={topic?.description}
                                    className={`text-[11px] font-medium font-sans px-2 py-0.5 rounded border cursor-help ${
                                      isDark 
                                        ? 'bg-neutral-900 text-neutral-300 border-neutral-800/80' 
                                        : 'bg-black text-[#ffffff] border-black shadow-sm'
                                    }`}
                                  >
                                    {topic?.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Problems List */}
                          {day.assignedProblemIds.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <Code2 className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                              {day.assignedProblemIds.map((pid) => {
                                const problem = getProblemDetails(pid);
                                return (
                                  <span
                                    key={pid}
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                      isDark
                                        ? problem?.status === 'Solved'
                                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                          : problem?.status === 'Revision'
                                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800/80'
                                        : `bg-black text-[#ffffff] ${problem?.status === 'Solved' ? 'border-emerald-500' : problem?.status === 'Revision' ? 'border-orange-500' : 'border-black'}`
                                    }`}
                                  >
                                    {problem?.title}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Status controls */}
                        <div className="flex items-center gap-2 lg:w-1/5 justify-end">
                          <select
                            value={day.status}
                            onChange={(e) => onUpdateDayStatus(day.dayNumber, e.target.value as RoadmapDay['status'])}
                            className={`text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-orange-500 border ${
                              isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-black border-black text-[#ffffff]'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Partial">Partial</option>
                            <option value="Skipped">Skipped</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
