import React, { useState } from 'react';
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  History,
  Calendar,
  Zap,
  Bookmark,
  Check,
  Award
} from 'lucide-react';
import { Topic, Problem } from '../types';

interface RevisionViewProps {
  theme: 'dark' | 'light';
  topics: Topic[];
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  problems: Problem[];
}

export default function RevisionView({
  theme,
  topics,
  onUpdateTopic,
  problems
}: RevisionViewProps) {
  const isDark = theme === 'dark';
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<'queue' | 'history' | 'all'>('queue');

  // Helper: Get current date string in local format (YYYY-MM-DD)
  const getTodayStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  const todayStr = getTodayStr();

  // --- Spaced Repetition Logic Engine ---
  // Calculates dynamic spaced repetition intervals based on review counts and difficulty
  const getRevisionStatus = (topic: Topic) => {
    if (topic.completionStatus === 'Not Started') {
      return { status: 'Unstudied', priority: 'Low', daysRemaining: 999 };
    }

    const reviewCount = topic.reviewCount || 0;
    const isWeak = topic.isWeakTopic || false;
    
    // If the user explicitly marked it mastered, we respect it
    if (topic.isMastered || topic.masteryState === 'Mastered') {
      return { status: 'Mastered', priority: 'Low', daysRemaining: 999 };
    }

    let nextDateStr = topic.nextRevisionDate;
    if (!nextDateStr) {
      // If it's started but has no next revision date, assign one based on difficulty
      const lastStudied = topic.lastStudiedDate || todayStr;
      const baseDays = topic.difficulty === 'Easy' ? 4 : topic.difficulty === 'Medium' ? 2 : 1;
      const finalDays = isWeak ? Math.max(1, baseDays - 1) : baseDays;
      const nextDate = new Date(lastStudied);
      nextDate.setDate(nextDate.getDate() + finalDays);
      nextDateStr = nextDate.toISOString().split('T')[0];
    }

    const today = new Date(todayStr);
    const nextRevision = new Date(nextDateStr);
    const diffTime = nextRevision.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= -2) {
      return { status: 'Overdue', priority: 'High', daysRemaining: diffDays, nextDateStr };
    } else if (diffDays <= 0) {
      return { status: 'Due Today', priority: isWeak ? 'High' : 'Medium', daysRemaining: diffDays, nextDateStr };
    } else if (diffDays <= 3) {
      return { status: 'Due This Week', priority: 'Medium', daysRemaining: diffDays, nextDateStr };
    } else {
      return { status: 'Safe to Delay', priority: 'Low', daysRemaining: diffDays, nextDateStr };
    }
  };

  // Process all topics with our revision engine
  const processedTopics = topics.map((t) => {
    const revisionInfo = getRevisionStatus(t);
    return {
      ...t,
      revisionStatus: revisionInfo.status,
      revisionPriority: revisionInfo.priority,
      daysRemaining: revisionInfo.daysRemaining,
      nextRevDate: revisionInfo.nextDateStr || todayStr
    };
  });

  // Categories
  const overdueQueue = processedTopics.filter((t) => t.revisionStatus === 'Overdue');
  const dueTodayQueue = processedTopics.filter((t) => t.revisionStatus === 'Due Today');
  const dueThisWeekQueue = processedTopics.filter((t) => t.revisionStatus === 'Due This Week');
  const masteredList = processedTopics.filter((t) => t.revisionStatus === 'Mastered');
  const safeList = processedTopics.filter((t) => t.revisionStatus === 'Safe to Delay');

  // Triggered when user marks a topic as reviewed today
  const handleLogReview = (topicId: string, customRating: 'easy' | 'medium' | 'hard') => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return;

    const currentReviews = topic.reviewCount || 0;
    const nextReviews = currentReviews + 1;
    
    // Interval factors: bigger interval if it was easy today, shorter if hard
    let multiplier = 2;
    if (customRating === 'easy') multiplier = 3;
    if (customRating === 'hard') multiplier = 1;

    // Calculate next revision date
    const baseInterval = topic.difficulty === 'Easy' ? 5 : topic.difficulty === 'Medium' ? 3 : 2;
    // Growth factor for spaced repetition: interval doubles or triples each review
    const nextIntervalDays = Math.round(baseInterval * Math.pow(multiplier, nextReviews - 1));

    const nextRev = new Date();
    nextRev.setDate(nextRev.getDate() + nextIntervalDays);
    const nextRevDateStr = nextRev.toISOString().split('T')[0];

    // Determine mastery state automatically
    let masteryState = topic.masteryState || 'Reading';
    if (nextReviews >= 3 && customRating === 'easy') {
      masteryState = 'Mastered';
    } else if (nextReviews >= 2) {
      masteryState = 'Practiced';
    } else {
      masteryState = 'Understood';
    }

    onUpdateTopic(topicId, {
      reviewCount: nextReviews,
      lastStudiedDate: todayStr,
      nextRevisionDate: nextRevDateStr,
      masteryState,
      isRevisionDue: false,
      isWeakTopic: customRating === 'hard' // If review is hard, flag as weak
    });

    setSelectedTopicId(null);
  };

  const handleToggleMastery = (topicId: string, currentVal: boolean) => {
    onUpdateTopic(topicId, {
      isMastered: !currentVal,
      masteryState: !currentVal ? 'Mastered' : 'Practiced'
    });
  };

  return (
    <div className="space-y-6">
        
        {/* Header Block */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <RefreshCw className="w-5 h-5 text-orange-500 animate-spin-slow" />
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-bold">
                Spaced Repetition System
              </span>
            </div>
            <h2 className={`text-2xl font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Syllabus Revision Hub
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl mt-1">
              The revision engine dynamically adjusts intervals using your past study reviews, difficulty constraints, and performance ratings to combat the forgetting curve.
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'queue', label: 'Due Queue', icon: Clock },
              { id: 'history', label: 'Mastered Deck', icon: Award },
              { id: 'all', label: 'All Intervals', icon: Calendar }
            ].map((seg) => {
              const Icon = seg.icon;
              return (
                <button
                  key={seg.id}
                  onClick={() => setActiveSegment(seg.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
                    activeSegment === seg.id
                      ? 'bg-orange-500 border-orange-500 text-neutral-950'
                      : isDark
                      ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {seg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Revision Queue Segment */}
        {activeSegment === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Queue Stream Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Overdue Items */}
              {overdueQueue.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider">
                      Overdue Revision Required ({overdueQueue.length})
                    </h3>
                  </div>
                  <div className="space-y-2.5">
                    {overdueQueue.map((topic) => (
                      <div
                        key={topic.id}
                        className={`border rounded-xl p-4 flex items-center justify-between transition ${
                          isDark 
                            ? 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10' 
                            : 'bg-rose-50 border-rose-200 hover:bg-rose-100/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                            <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full uppercase">
                              Overdue by {Math.abs(topic.daysRemaining)}d
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">{topic.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTopicId(topic.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold font-mono transition"
                        >
                          Review Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Due Today Items */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider">
                    Due for Active Recall Today ({dueTodayQueue.length})
                  </h3>
                </div>
                {dueTodayQueue.length === 0 && overdueQueue.length === 0 ? (
                  <div className={`border border-dashed rounded-2xl p-12 text-center ${
                    isDark ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-neutral-50'
                  }`}>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 animate-pulse" />
                    <p className={`text-xs font-sans ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Excellent job! Your revision queue is completely empty today.</p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase">Continue exploring new syllabus categories.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {dueTodayQueue.map((topic) => (
                      <div
                        key={topic.id}
                        className={`border rounded-xl p-4 flex items-center justify-between transition ${
                          isDark 
                            ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700' 
                            : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                            <span className="text-[9px] font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full uppercase">
                              Today
                            </span>
                            {topic.isWeakTopic && (
                              <span className="text-[9px] font-mono bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full">
                                Weak Area
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400">{topic.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTopicId(topic.id)}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold font-mono transition"
                        >
                          Recall
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Upcoming Review This Week */}
              {dueThisWeekQueue.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider">
                      Upcoming Reviews This Week ({dueThisWeekQueue.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dueThisWeekQueue.map((topic) => (
                      <div
                        key={topic.id}
                        className={`border rounded-xl p-4 flex flex-col justify-between transition space-y-3 ${
                          isDark 
                            ? 'bg-neutral-950 border-neutral-850 hover:border-neutral-800' 
                            : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold truncate max-w-[150px] ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                            <span className="text-[9px] font-mono text-neutral-500">In {topic.daysRemaining} days</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 line-clamp-2">{topic.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`w-full py-1.5 text-center text-[10px] font-mono rounded-lg transition ${
                            isDark 
                              ? 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300' 
                              : 'bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          Review Early
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Action & Active Logging Panel */}
            <div className="space-y-6">
              
              {/* Active Logging Deck */}
              <div className={`border rounded-2xl p-6 space-y-4 ${
                isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-white border-neutral-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <h3 className={`text-sm font-bold font-sans ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Active Recall Console
                  </h3>
                </div>

                {selectedTopicId ? (
                  (() => {
                    const activeTopic = topics.find((t) => t.id === selectedTopicId);
                    if (!activeTopic) return null;
                    const relatedProblems = problems.filter((p) => p.topicId === activeTopic.id);
                    return (
                      <div className="space-y-4 animate-fade-in text-xs">
                        <div className={`p-3.5 border rounded-xl ${
                          isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                        }`}>
                          <span className="text-[9px] font-mono text-neutral-500 uppercase">Selected Structure</span>
                          <span className={`text-xs font-bold block mt-0.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{activeTopic.name}</span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase block">Active Recall Challenge</span>
                          <p className="text-neutral-400 leading-relaxed text-[11px]">
                            Explain the memory layout and core complexities to yourself. Try to recall how the basic insert/delete/search mechanics are structured in Java.
                          </p>
                        </div>

                        {relatedProblems.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase block">Practice Problems to Verify</span>
                            <div className="space-y-1">
                              {relatedProblems.slice(0, 3).map((p) => (
                                <div key={p.id} className="flex justify-between text-[10px] text-neutral-400">
                                  <span>{p.title}</span>
                                  <span className={`font-mono text-[9px] ${p.status === 'Solved' ? 'text-green-500' : 'text-neutral-600'}`}>
                                    {p.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 pt-2 border-t border-neutral-850">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase block">How easily did you recall this concept?</span>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => handleLogReview(activeTopic.id, 'easy')}
                              className="py-2 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 font-mono text-[10px] font-bold transition text-center animate-fade-in"
                            >
                              Easy 🟢
                            </button>
                            <button
                              onClick={() => handleLogReview(activeTopic.id, 'medium')}
                              className="py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold transition text-center animate-fade-in"
                            >
                              Medium 🟡
                            </button>
                            <button
                              onClick={() => handleLogReview(activeTopic.id, 'hard')}
                              className="py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold transition text-center animate-fade-in"
                            >
                              Hard 🔴
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedTopicId(null)}
                          className={`w-full text-center py-2 text-[10px] font-mono text-neutral-500 transition ${isDark ? 'hover:text-white' : 'hover:text-neutral-900'}`}
                        >
                          Cancel review
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-8 h-8 text-neutral-750 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400">Click &apos;Review&apos; or &apos;Recall&apos; on any due item to launch active self-testing.</p>
                  </div>
                )}
              </div>

              {/* Memory Stats Column */}
              <div className={`border rounded-2xl p-5 text-xs space-y-3.5 ${
                isDark ? 'bg-neutral-900/10 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'
              }`}>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Retention Breakdown</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 border rounded-xl text-center ${
                    isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
                  }`}>
                    <span className="text-[10px] font-mono text-neutral-500 block">DUE/OVERDUE</span>
                    <span className="text-xl font-bold font-mono text-orange-500">{overdueQueue.length + dueTodayQueue.length}</span>
                  </div>
                  <div className={`p-3 border rounded-xl text-center ${
                    isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
                  }`}>
                    <span className="text-[10px] font-mono text-neutral-500 block">MASTERED</span>
                    <span className="text-xl font-bold font-mono text-green-500">{masteredList.length}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-850">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next 3 days backlog</span>
                    <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{dueThisWeekQueue.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Safe/Unstudied count</span>
                    <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{safeList.length}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Mastered Deck Segment */}
        {activeSegment === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className={`text-sm font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Mastered Syllabus Deck ({masteredList.length})
              </h3>
            </div>

            {masteredList.length === 0 ? (
              <div className={`border border-dashed rounded-2xl p-16 text-center ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <Bookmark className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <p className="text-xs text-neutral-400">No topics are currently marked as mastered. Successfully complete 3 recall intervals on a topic to see it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {masteredList.map((topic) => (
                  <div
                    key={topic.id}
                    className={`border rounded-xl p-4.5 flex flex-col justify-between hover:border-green-500/30 transition space-y-4 ${
                      isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-[9px] font-mono">
                      <span className="text-neutral-500">Reviews: {topic.reviewCount || 0}</span>
                      <button
                        onClick={() => handleToggleMastery(topic.id, true)}
                        className="text-orange-500 hover:underline"
                      >
                        Reset Spaced intervals
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Intervals Segment */}
        {activeSegment === 'all' && (
          <div className={`border rounded-2xl overflow-hidden animate-fade-in ${
            isDark ? 'bg-neutral-900/15 border-neutral-850' : 'bg-white border-neutral-200 shadow-sm'
          }`}>
            <div className={`p-4 border-b ${
              isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <span className={`text-xs font-mono font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-850'}`}>Complete Syllabus Recall Timeline</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b text-neutral-450 font-mono ${
                    isDark ? 'border-neutral-850' : 'border-neutral-200 bg-neutral-50/50'
                  }`}>
                    <th className="p-4 font-semibold">Topic Name</th>
                    <th className="p-4 font-semibold">Difficulty</th>
                    <th className="p-4 font-semibold">Recall Count</th>
                    <th className="p-4 font-semibold">Next Scheduled Revision</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Override</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-neutral-850' : 'divide-neutral-200'}`}>
                  {processedTopics.map((topic) => (
                    <tr key={topic.id} className={`transition-colors ${
                      isDark ? 'hover:bg-neutral-800/10 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-700'
                    }`}>
                      <td className={`p-4 font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</td>
                      <td className="p-4 font-mono">{topic.difficulty}</td>
                      <td className="p-4 font-mono">{topic.reviewCount || 0} times</td>
                      <td className="p-4 font-mono">
                        {topic.completionStatus === 'Not Started' ? 'Not Studied Yet' : topic.nextRevDate}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-full ${
                            topic.revisionStatus === 'Overdue'
                              ? 'bg-rose-500/10 text-rose-400'
                              : topic.revisionStatus === 'Due Today'
                              ? 'bg-orange-500/10 text-orange-400'
                              : topic.revisionStatus === 'Mastered'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-neutral-850 text-neutral-500'
                          }`}
                        >
                          {topic.revisionStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleMastery(topic.id, !!topic.isMastered)}
                          className="text-xs font-mono text-orange-500 hover:underline"
                        >
                          {topic.isMastered ? 'Undo Mastered' : 'Mark Mastered'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

    </div>
  );
}
