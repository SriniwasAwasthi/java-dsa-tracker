/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  Code2,
  ChevronDown,
  ChevronUp,
  FileText,
  Save,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Topic, Problem, RoadmapDay, UserProfile } from '../types';

interface HistoryViewProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  onUpdateDayStatus: (dayNumber: number, status: RoadmapDay['status']) => void;
  studySessions?: any[];
}

export default function HistoryView({
  theme,
  profile,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  onUpdateDayStatus,
  studySessions = []
}: HistoryViewProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Completed' | 'Partial' | 'Skipped' | 'Pending'>('All');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  // Day notes state - saved in localStorage inside App.tsx or managed locally/globally via roadmap edits
  // Wait, let's keep a state of custom day notes or save notes directly to a local notes record, or store them in a state that persists.
  // We can let the user edit the note. Since we have onUpdateDayStatus in App.tsx, wait! Does RoadmapDay have a notes field?
  // Let's check: in types.ts, RoadmapDay is:
  // export interface RoadmapDay {
  //   dayNumber: number;
  //   date: string;
  //   assignedTopicIds: string[];
  //   assignedProblemIds: string[];
  //   estimatedHours: number;
  //   status: 'Pending' | 'Completed' | 'Skipped' | 'Partial';
  //   carryForwardTopicIds?: string[];
  // }
  // We can let the user edit and save notes. We can save them in localStorage as 'java_dsa_day_notes', where key is dayNumber.
  // That is super clean and avoids modifying the core props, since we can initialize it directly and save to localStorage!
  const [dayNotes, setDayNotes] = useState<{ [dayNumber: number]: string }>(() => {
    const saved = localStorage.getItem('java_dsa_history_day_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingDayNum, setEditingDayNum] = useState<number | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');

  const handleSaveDayNote = (dayNum: number) => {
    const nextNotes = { ...dayNotes, [dayNum]: currentNoteText };
    setDayNotes(nextNotes);
    localStorage.setItem('java_dsa_history_day_notes', JSON.stringify(nextNotes));
    setEditingDayNum(null);
  };

  // Helper to fetch details
  const getTopicDetails = (id: string): Topic | undefined => topics.find((t) => t.id === id);
  const getProblemDetails = (id: string): Problem | undefined => problems.find((p) => p.id === id);

  // Filter roadmap days
  const filteredDays = roadmap.filter((day) => {
    const matchesFilter = selectedFilter === 'All' || day.status === selectedFilter;
    
    // Search by topics assigned or date
    const topicNames = day.assignedTopicIds.map(tid => getTopicDetails(tid)?.name.toLowerCase() || '');
    const problemTitles = day.assignedProblemIds.map(pid => getProblemDetails(pid)?.title.toLowerCase() || '');
    const matchesSearch = 
      day.date.includes(searchQuery) || 
      `day ${day.dayNumber}`.includes(searchQuery.toLowerCase()) ||
      topicNames.some(name => name.includes(searchQuery.toLowerCase())) ||
      problemTitles.some(title => title.includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const formatDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

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
            <History className="w-6 h-6 text-orange-500" />
            Study Log History
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Chronological audit log of your Java + DSA milestones. Review past performance, log reflections, and trace backlog items.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center justify-between ${
          isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
        }`}
      >
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-neutral-500" />
          </span>
          <input
            type="text"
            placeholder="Search logs by day, date, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:outline-none focus:border-orange-500 font-sans ${
              isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-850'
            }`}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-end">
          {['All', 'Completed', 'Partial', 'Skipped', 'Pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition uppercase ${
                selectedFilter === filter
                  ? 'bg-orange-500/10 border border-orange-500 text-orange-500'
                  : isDark
                  ? 'bg-neutral-950/40 border border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological List */}
      <div className="space-y-4">
        {filteredDays.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;
          const noteText = dayNotes[day.dayNumber] || '';
          
          // Calculate completions for the day
          const totalTopicsCount = day.assignedTopicIds.length;
          const completedTopicsCount = day.assignedTopicIds.filter(tid => getTopicDetails(tid)?.completionStatus === 'Completed').length;
          
          const totalProblemsCount = day.assignedProblemIds.length;
          const solvedProblemsCount = day.assignedProblemIds.filter(pid => getProblemDetails(pid)?.status === 'Solved').length;

          const totalAssignedItems = totalTopicsCount + totalProblemsCount;
          const totalDoneItems = completedTopicsCount + solvedProblemsCount;
          const completionPercentage = totalAssignedItems > 0 
            ? Math.round((totalDoneItems / totalAssignedItems) * 100)
            : day.status === 'Completed' ? 100 : 0;

          // Find study sessions for this date
          const sessionsForDay = studySessions.filter(s => s.date === day.date);
          const totalMinutesSpent = sessionsForDay.reduce((sum, s) => sum + s.durationMinutes, 0);

          return (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded 
                  ? 'border-neutral-700 bg-neutral-900/20' 
                  : isDark 
                  ? 'border-neutral-850 hover:border-neutral-800 bg-neutral-950/20' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              {/* Day Overview Bar */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator Badge */}
                  <div className="shrink-0">
                    {day.status === 'Completed' ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Completed Day">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : day.status === 'Partial' ? (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Partial Progress Day">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    ) : day.status === 'Skipped' ? (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20" title="Skipped Day">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-500 border border-neutral-700" title="Pending Day">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Day Title & Date */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>Day {day.dayNumber}</span>
                      {day.dayNumber === currentDayNumber && (
                        <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded uppercase font-bold animate-pulse">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-neutral-400 mt-0.5 block">
                      {formatDateString(day.date)}
                    </span>
                  </div>
                </div>

                {/* Progress Indicators in Row */}
                <div className="flex flex-wrap items-center gap-6 md:gap-10">
                  {/* Task Completion Bar */}
                  <div className="min-w-[120px]">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span>Milestones Done</span>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{completionPercentage}%</span>
                    </div>
                    <div className={`w-32 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          day.status === 'Completed' ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Duration Logged */}
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Study Duration</span>
                    <span className={`text-xs font-bold font-mono flex items-center gap-1 mt-0.5 ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {totalMinutesSpent ? `${totalMinutesSpent} mins` : `${day.estimatedHours}h est.`}
                    </span>
                  </div>

                  {/* Syllabus / Problems counts */}
                  <div className="text-left hidden sm:block">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Milestones</span>
                    <span className={`text-xs font-sans mt-0.5 block ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {completedTopicsCount}/{totalTopicsCount} Topics • {solvedProblemsCount}/{totalProblemsCount} Code
                    </span>
                  </div>

                  {/* Expand / Collapse Icon */}
                  <div className="text-neutral-500 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Collapsed Detailed Log Section */}
              {isExpanded && (
                <div className={`px-5 pb-6 pt-1 border-t grid grid-cols-1 lg:grid-cols-12 gap-6 ${
                  isDark ? 'border-neutral-800/60 bg-neutral-950/10' : 'border-neutral-200 bg-neutral-50/40'
                }`}>
                  
                  {/* Left Column - Topics, Problems, Carry Over (Col Span 7) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Topics List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Assigned Syllabus Concepts</span>
                      {day.assignedTopicIds.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic pl-1">No topics assigned on this day.</p>
                      ) : (
                        <div className="space-y-2">
                          {day.assignedTopicIds.map(tid => {
                            const topic = getTopicDetails(tid);
                            if (!topic) return null;
                            return (
                              <div key={tid} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200 shadow-sm'
                              }`}>
                                <div className="min-w-0 flex-1">
                                  <span className={`font-bold block truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                                  <span className="text-[9px] font-mono text-neutral-500 uppercase">{topic.category}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${
                                  topic.completionStatus === 'Completed' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-neutral-850 border-neutral-800 text-neutral-400'
                                }`}>
                                  {topic.completionStatus}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Problems List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Assigned Practice Challenges</span>
                      {day.assignedProblemIds.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic pl-1">No coding challenges assigned on this day.</p>
                      ) : (
                        <div className="space-y-2">
                          {day.assignedProblemIds.map(pid => {
                            const prob = getProblemDetails(pid);
                            if (!prob) return null;
                            return (
                              <div key={pid} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                isDark ? 'bg-neutral-900/40 border-neutral-800/80' : 'bg-white border-neutral-200 shadow-sm'
                              }`}>
                                <div className="min-w-0 flex-1">
                                  <span className={`font-bold block truncate ${isDark ? 'text-white' : 'text-neutral-900'}`}>{prob.title}</span>
                                  <span className={`text-[8px] font-mono font-bold uppercase ${
                                    prob.difficulty === 'Easy' ? 'text-emerald-400' : prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                                  }`}>{prob.difficulty}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${
                                  prob.status === 'Solved' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-neutral-850 border-neutral-800 text-neutral-400'
                                }`}>
                                  {prob.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Carry Forwards */}
                    {day.carryForwardTopicIds && day.carryForwardTopicIds.length > 0 && (
                      <div className="space-y-2 p-3.5 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                          Carry-Forward Items (Rescheduled Backlog)
                        </span>
                        <div className="space-y-1.5 mt-2">
                          {day.carryForwardTopicIds.map(tid => {
                            const topic = getTopicDetails(tid);
                            if (!topic) return null;
                            return (
                              <div key={tid} className={`text-xs flex justify-between items-center font-sans ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                                <span className="font-medium">{topic.name}</span>
                                <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Backlog</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Study Sessions, Day Notes (Col Span 5) */}
                  <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-neutral-800/60 pt-4 lg:pt-0 lg:pl-6">
                    
                    {/* Notes Logger */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Daily Study Reflections & Notes</span>
                      
                      {editingDayNum === day.dayNumber ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={currentNoteText}
                            onChange={(e) => setCurrentNoteText(e.target.value)}
                            placeholder="e.g. Spent longer on dynamic array sizing mechanics. Understood time complexity of doubling operations thoroughly."
                            className={`w-full text-xs border rounded-xl p-3 focus:outline-none focus:border-orange-500 leading-relaxed font-sans ${
                              isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-850'
                            }`}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveDayNote(day.dayNumber)}
                              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold font-mono uppercase flex items-center gap-1 transition"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Reflection
                            </button>
                            <button
                              onClick={() => setEditingDayNum(null)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={`p-3.5 border rounded-xl space-y-3 ${
                          isDark ? 'bg-neutral-950/40 border-neutral-855' : 'bg-white border-neutral-200 shadow-sm'
                        }`}>
                          {noteText ? (
                            <p className={`text-xs italic leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                              " {noteText} "
                            </p>
                          ) : (
                            <p className="text-xs text-neutral-500 italic">No custom notes logged for this day yet.</p>
                          )}
                          <button
                            onClick={() => {
                              setEditingDayNum(day.dayNumber);
                              setCurrentNoteText(noteText);
                            }}
                            className="text-[10px] font-mono text-orange-500 uppercase tracking-wider hover:underline flex items-center gap-1 font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {noteText ? 'Edit Reflection' : 'Add Study Log Reflection'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Study Sessions List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Completed Sessions Duration Log</span>
                      {sessionsForDay.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic pl-1">No timer sessions recorded for this day.</p>
                      ) : (
                        <div className="space-y-2">
                          {sessionsForDay.map((session, sIdx) => (
                            <div key={session.id || sIdx} className={`p-3 rounded-xl border text-xs flex flex-col gap-1 leading-relaxed ${
                              isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
                            }`}>
                              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                                <span className="text-orange-400 font-bold uppercase">{session.focusType}: {session.focusName}</span>
                                <span>{session.startTime} - {session.endTime} ({session.durationMinutes}m)</span>
                              </div>
                              {session.notes && (
                                <p className={`italic text-[11px] mt-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>" {session.notes} "</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}

        {filteredDays.length === 0 && (
          <div className={`p-16 text-center border border-dashed rounded-2xl font-mono ${
            isDark ? 'border-neutral-800 bg-neutral-900/10 text-neutral-500' : 'border-neutral-200 bg-neutral-50/50 text-neutral-500'
          }`}>
            No study records found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
