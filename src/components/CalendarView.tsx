/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
  FileText,
  Save,
  TrendingUp,
  Flame,
  AlertTriangle,
  X
} from 'lucide-react';
import { Topic, Problem, RoadmapDay, UserProfile } from '../types';

interface CalendarViewProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  onUpdateDayStatus: (dayNumber: number, status: RoadmapDay['status']) => void;
  onToggleTopicStatus: (topicId: string) => void;
  onToggleProblemStatus: (problemId: string, status: Problem['status']) => void;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  studySessions?: any[];
}

export default function CalendarView({
  theme,
  profile,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  onUpdateDayStatus,
  onToggleTopicStatus,
  onToggleProblemStatus,
  onUpdateTopic,
  onUpdateProblem,
  studySessions = []
}: CalendarViewProps) {
  const isDark = theme === 'dark';
  
  // Manage current year and month shown on the calendar
  const [currentDate, setCurrentDate] = useState(() => {
    // Default to the student's roadmap start date, or today
    const start = new Date(profile.startDate);
    return isNaN(start.getTime()) ? new Date() : start;
  });

  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(currentDayNumber);

  // Helper to fetch details
  const getTopicDetails = (id: string): Topic | undefined => topics.find((t) => t.id === id);
  const getProblemDetails = (id: string): Problem | undefined => problems.find((p) => p.id === id);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Get total days in the current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar days
  const calendarDays = [];
  // Filler days for the previous month
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayOfMonth: prevMonthTotalDays - i,
      isCurrentMonth: false,
      dateString: new Date(year, month - 1, prevMonthTotalDays - i).toISOString().split('T')[0]
    });
  }

  // Days of the current month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    // Avoid time-zone shift by creating date manually
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      dayOfMonth: i,
      isCurrentMonth: true,
      dateString: dateStr
    });
  }

  // Filler days for next month to complete the calendar grid row (multiples of 7)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      dayOfMonth: i,
      isCurrentMonth: false,
      dateString: new Date(year, month + 1, i).toISOString().split('T')[0]
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find roadmap day matching a date string
  const getRoadmapDayByDate = (dateStr: string) => {
    return roadmap.find((d) => d.date === dateStr);
  };

  // Current selected day details
  const activeRoadmapDay = selectedDayNumber 
    ? roadmap.find((d) => d.dayNumber === selectedDayNumber)
    : roadmap.find((d) => d.dayNumber === currentDayNumber) || roadmap[0];

  // Study sessions for the selected roadmap day
  const activeDaySessions = studySessions.filter((session) => {
    if (!activeRoadmapDay) return false;
    return session.date === activeRoadmapDay.date;
  });

  const totalSessionDuration = activeDaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Status statistics for calendar summary
  const completedCount = roadmap.filter((d) => d.status === 'Completed').length;
  const partialCount = roadmap.filter((d) => d.status === 'Partial').length;
  const skippedCount = roadmap.filter((d) => d.status === 'Skipped').length;
  const pendingCount = roadmap.filter((d) => d.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            <CalendarIcon className="w-6 h-6 text-orange-500" />
            Calendar Study Tracker
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Visual map of your Java & DSA journey. Drill down into daily study agendas, workloads, and revision plans.
          </p>
        </div>

        {/* Legend stats summary */}
        <div className={`flex flex-wrap items-center gap-2.5 border p-2 rounded-xl text-[10px] font-mono ${
          isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
        }`}>
          <span className="text-neutral-500 font-bold uppercase mr-1 pl-1">LEGEND:</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{partialCount} Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{skippedCount} Skipped</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-450" />
            <span className="text-neutral-500">{pendingCount} Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns - Interactive Monthly Calendar */}
        <div
          className={`lg:col-span-7 p-6 rounded-2xl border flex flex-col h-fit ${
            isDark ? 'bg-neutral-900/20 border-neutral-800/80' : 'bg-white border-neutral-200'
          }`}
        >
          {/* Month Selector Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              <span className="text-orange-500 font-mono">{monthNames[month]}</span>
              <span className="text-neutral-500 font-normal">{year}</span>
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className={`p-1.5 rounded-lg border focus:outline-none transition ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white hover:border-neutral-700' 
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(profile.startDate))}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono uppercase transition ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white hover:border-neutral-700'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                Plan Start
              </button>
              <button
                onClick={handleNextMonth}
                className={`p-1.5 rounded-lg border focus:outline-none transition ${
                  isDark 
                    ? 'border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:text-white hover:border-neutral-700' 
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className={`grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-wider mb-2 border-b pb-2 ${
            isDark ? 'border-neutral-800' : 'border-neutral-200'
          }`}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, index) => {
              const roadmapDay = getRoadmapDayByDate(cell.dateString);
              const isSelected = activeRoadmapDay?.date === cell.dateString;
              const isToday = new Date().toISOString().split('T')[0] === cell.dateString;
              
              // Revision Day (Day number divisible by 7)
              const isRevisionDay = roadmapDay && roadmapDay.dayNumber % 7 === 0;
              // Heavy workload (estimated study hours > 4)
              const isHeavyWorkload = roadmapDay && roadmapDay.estimatedHours > 4;

              // Determine cell color styles based on day status
              let statusColor = isDark 
                ? 'bg-neutral-950/20 text-neutral-600 border-neutral-950/40' 
                : 'bg-neutral-50 text-neutral-450 border-neutral-100';
              if (cell.isCurrentMonth) {
                if (roadmapDay) {
                  switch (roadmapDay.status) {
                    case 'Completed':
                      statusColor = isDark
                        ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-300';
                      break;
                    case 'Partial':
                      statusColor = isDark
                        ? 'bg-amber-950/10 border-amber-500/30 text-amber-400 hover:border-amber-500/60'
                        : 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-300';
                      break;
                    case 'Skipped':
                      statusColor = isDark
                        ? 'bg-rose-950/10 border-rose-500/30 text-rose-400 hover:border-rose-500/60'
                        : 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-300';
                      break;
                    default:
                      statusColor = isDark
                        ? 'bg-neutral-900/30 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50';
                  }
                } else {
                  statusColor = isDark
                    ? 'bg-neutral-950/10 border-transparent text-neutral-600'
                    : 'bg-neutral-50 border-transparent text-neutral-400';
                }
              }

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (roadmapDay) {
                      setSelectedDayNumber(roadmapDay.dayNumber);
                    }
                  }}
                  className={`p-1.5 sm:p-2.5 rounded-xl border flex flex-col justify-between h-14 sm:h-20 min-h-[3.5rem] sm:min-h-20 transition relative cursor-pointer group ${statusColor} ${
                    isSelected ? 'ring-2 ring-orange-500 border-orange-500/80 shadow-lg shadow-orange-500/5' : ''
                  } ${isToday ? 'ring-1 ring-neutral-400 border-neutral-400' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] sm:text-xs font-mono font-bold ${cell.isCurrentMonth ? '' : 'opacity-30'}`}>
                      {cell.dayOfMonth}
                    </span>
                    {roadmapDay && (
                      <span className="text-[7px] sm:text-[8px] font-mono font-bold text-neutral-500 group-hover:text-neutral-300">
                        D{roadmapDay.dayNumber}
                      </span>
                    )}
                  </div>

                  {/* Status indicators inside card */}
                  {roadmapDay && (
                    <div className="space-y-0.5 sm:space-y-1 mt-auto">
                      {/* Revision indicator */}
                      {isRevisionDay && (
                        <div className="flex items-center gap-0.5 text-[7px] sm:text-[8px] font-mono text-orange-400 font-semibold leading-none">
                          <Star className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-orange-400 fill-orange-400" />
                          <span className="hidden xs:inline">REV</span>
                        </div>
                      )}

                      {/* Workload hours or dots */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] sm:text-[9px] font-mono text-neutral-500">
                          {roadmapDay.estimatedHours}h
                        </span>
                        
                        <div className="flex gap-0.5">
                          {isHeavyWorkload && (
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500" title="Heavy workload day" />
                          )}
                          {activeDaySessions.length > 0 && (
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400" title={`${activeDaySessions.length} logged sessions`} />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns - Study Day Details & Records */}
        <div className="lg:col-span-5 space-y-6">
          {activeRoadmapDay ? (
            <div
              className={`p-6 rounded-2xl border ${
                isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
              }`}
            >
              {/* Day Header */}
              <div className={`flex items-start justify-between border-b pb-4 mb-5 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-orange-500 uppercase tracking-widest font-bold">
                      Day {activeRoadmapDay.dayNumber} Focus
                    </span>
                    {activeRoadmapDay.dayNumber % 7 === 0 && (
                      <span className="text-[8px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 py-0.2 rounded font-bold uppercase">
                        Revision
                      </span>
                    )}
                  </div>
                  <h3 className={`text-md font-bold mt-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {new Date(activeRoadmapDay.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      activeRoadmapDay.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : activeRoadmapDay.status === 'Partial'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : activeRoadmapDay.status === 'Skipped'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {activeRoadmapDay.status}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Target: {activeRoadmapDay.estimatedHours} hrs
                  </span>
                </div>
              </div>

              {/* Day Quick Actions */}
              <div className="space-y-2 mb-6">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Update Day Completion State
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateDayStatus(activeRoadmapDay.dayNumber, 'Completed')}
                    className={`py-1.5 px-2 rounded-lg text-center font-semibold text-xs border transition ${
                      activeRoadmapDay.status === 'Completed'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => onUpdateDayStatus(activeRoadmapDay.dayNumber, 'Partial')}
                    className={`py-1.5 px-2 rounded-lg text-center font-semibold text-xs border transition ${
                      activeRoadmapDay.status === 'Partial'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Partial
                  </button>
                  <button
                    onClick={() => onUpdateDayStatus(activeRoadmapDay.dayNumber, 'Skipped')}
                    className={`py-1.5 px-2 rounded-lg text-center font-semibold text-xs border transition ${
                      activeRoadmapDay.status === 'Skipped'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-400'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    Skipped
                  </button>
                </div>
              </div>

              {/* Day Syllabus Targets */}
              <div className="space-y-3 mb-6">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Syllabus Concepts ({activeRoadmapDay.assignedTopicIds.length})
                </span>
                
                {activeRoadmapDay.assignedTopicIds.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic pl-1">No core topics scheduled. Review backlog content!</p>
                ) : (
                  <div className="space-y-2">
                    {activeRoadmapDay.assignedTopicIds.map((tid) => {
                      const topic = getTopicDetails(tid);
                      if (!topic) return null;
                      return (
                        <div
                          key={tid}
                          className={`p-3 border rounded-xl flex items-center justify-between gap-3 ${
                            isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className={`text-xs font-semibold block truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                            <span className="text-[9px] font-mono text-neutral-500 uppercase">{topic.category}</span>
                          </div>
                          <button
                            onClick={() => onToggleTopicStatus(topic.id)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition ${
                              topic.completionStatus === 'Completed'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : topic.completionStatus === 'In Progress'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : isDark
                                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                : 'bg-white border-neutral-200 text-neutral-650 hover:bg-neutral-50'
                            }`}
                          >
                            {topic.completionStatus}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Practice Problems */}
              <div className="space-y-3 mb-6">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Practice Problems ({activeRoadmapDay.assignedProblemIds.length})
                </span>

                {activeRoadmapDay.assignedProblemIds.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic pl-1">No practice challenges scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {activeRoadmapDay.assignedProblemIds.map((pid) => {
                      const prob = getProblemDetails(pid);
                      if (!prob) return null;
                      return (
                        <div
                          key={pid}
                          className={`p-3 border rounded-xl flex items-center justify-between gap-3 ${
                            isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className={`text-xs font-semibold block truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{prob.title}</span>
                            <span className={`text-[8px] font-mono font-bold uppercase ${
                              prob.difficulty === 'Easy' ? 'text-emerald-400' : prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                            }`}>{prob.difficulty}</span>
                          </div>
                          
                          <select
                            value={prob.status}
                            onChange={(e) => onToggleProblemStatus(prob.id, e.target.value as Problem['status'])}
                            className={`text-[10px] font-mono border rounded p-1 focus:outline-none ${
                              isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-black border-black text-[#ffffff]'
                            }`}
                          >
                            <option value="Unsolved">Unsolved</option>
                            <option value="Solved">Solved</option>
                            <option value="Revision">Revision</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Day Study Log / Sessions */}
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Productive Duration Logs
                </span>

                <div className={`p-3 border rounded-xl flex justify-between items-center text-xs ${
                  isDark ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/50 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className={`font-sans ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Logged Study Duration:</span>
                  </div>
                  <span className="font-bold text-emerald-400 font-mono">
                    {totalSessionDuration || 0} minutes
                  </span>
                </div>

                {activeDaySessions.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pl-1">
                    {activeDaySessions.map((session, sIdx) => (
                      <div key={session.id || sIdx} className={`p-2.5 rounded-lg border text-[11px] leading-relaxed ${
                        isDark ? 'bg-neutral-950/60 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
                      }`}>
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                          <span className="text-orange-400 font-bold uppercase">{session.focusType}: {session.focusName}</span>
                          <span>{session.startTime} - {session.endTime} ({session.durationMinutes}m)</span>
                        </div>
                        {session.notes && (
                          <p className={`italic ${isDark ? 'text-neutral-300' : 'text-neutral-750'}`}>" {session.notes} "</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-neutral-500 italic pl-1">No automated study sessions logged on this day. Use the timer on the Dashboard to record productive hours!</p>
                )}
              </div>
            </div>
          ) : (
            <div className={`p-12 text-center border border-dashed rounded-2xl font-mono ${
              isDark ? 'border-neutral-800 bg-neutral-900/10 text-neutral-500' : 'border-neutral-200 bg-neutral-50/50 text-neutral-500'
            }`}>
              Select a date on the calendar to view its study details and task history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
