/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Code,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Calculator,
  Terminal,
  Brain,
  Star,
  Bookmark,
  Calendar,
  Sparkles,
  Info,
  HelpCircle,
  Lightbulb,
  Heart
} from 'lucide-react';
import { Topic, Problem, TopicCategory } from '../types';
import { getApiUrl, getAiHeaders } from '../lib/api';
import { PROGRAMS_BY_TOPIC } from '../data/programsData';
import { SYLLABUS_CONTENT } from '../data/syllabusContent';
import { THINGS_TO_LEARN } from '../data/thingsToLearn';

interface TopicsViewProps {
  theme: 'dark' | 'light';
  topics: Topic[];
  problems: Problem[];
  onToggleTopicStatus: (topicId: string) => void;
  onToggleProblemStatus: (problemId: string, status: Problem['status']) => void;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
}

export default function TopicsView({
  theme,
  topics,
  problems,
  onToggleTopicStatus,
  onToggleProblemStatus,
  onUpdateTopic,
  onUpdateProblem
}: TopicsViewProps) {
  const isDark = theme === 'dark';
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'All'>('All');
  const [selectedMastery, setSelectedMastery] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showWeakOnly, setShowWeakOnly] = useState(false);
  const [showRevisionOnly, setShowRevisionOnly] = useState(false);

  // Debounce effect for searchQuery
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchVal]);

  // Focus topic state
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activeTopicTab, setActiveTopicTab] = useState<'syllabus' | 'details' | 'code' | 'notes'>('syllabus');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Explanation state
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isAiExplaining, setIsAiExplaining] = useState<boolean>(false);

  // Sync AI explanation state with topic selection
  useEffect(() => {
    setAiExplanation('');
    setIsAiExplaining(false);
  }, [selectedTopicId]);

  const handleFetchAiExplanation = async () => {
    const topicObj = topics.find(t => t.id === selectedTopicId);
    if (!topicObj || isAiExplaining) return;
    setIsAiExplaining(true);
    setAiExplanation('');

    try {
      const response = await fetch(getApiUrl('/api/ai/explain'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          topicName: topicObj.name,
          topicCategory: topicObj.category,
          difficulty: topicObj.difficulty,
          description: topicObj.description
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setAiExplanation(data.text);
      } else {
        throw new Error(data.error || 'Failed to fetch explanation');
      }
    } catch (err: any) {
      setAiExplanation(`⚠️ **Failed to load AI Deep Dive**: ${err.message}`);
    } finally {
      setIsAiExplaining(false);
    }
  };

  useEffect(() => {
    if (activeTopicTab === 'ai-explanation' && !aiExplanation && !isAiExplaining && selectedTopicId) {
      handleFetchAiExplanation();
    }
  }, [activeTopicTab, selectedTopicId]);
  
  // Expandable subtopics indices
  const [expandedSubtopic, setExpandedSubtopic] = useState<number>(0);
  
  // Expandable problems detailed panel state
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  // Local state for Notes and Study Memory inputs to avoid lag on typing
  const [localNotes, setLocalNotes] = useState('');
  const [localFormulas, setLocalFormulas] = useState('');
  const [localReminders, setLocalReminders] = useState('');
  const [localTips, setLocalTips] = useState('');

  // Find the currently selected Topic object
  const selectedTopic = topics.find(t => t.id === selectedTopicId) || null;

  // Sync local states whenever selected topic changes
  useEffect(() => {
    if (selectedTopic) {
      setLocalNotes(selectedTopic.notes || '');
      setLocalFormulas(selectedTopic.formulas || '');
      setLocalReminders(selectedTopic.reminders || '');
      setLocalTips(selectedTopic.interviewTips || '');
    }
  }, [selectedTopicId]);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Trigger saves to parent state on blur
  const handleSaveNotes = () => {
    if (selectedTopic) {
      onUpdateTopic(selectedTopic.id, {
        notes: localNotes,
        formulas: localFormulas,
        reminders: localReminders,
        interviewTips: localTips
      });
    }
  };

  const categories: (TopicCategory | 'All')[] = [
    'All',
    'Java Basics',
    'OOP',
    'Collections',
    'Basic DSA',
    'Linear DSA',
    'Non-Linear DSA',
    'Algorithms',
    'Advanced DSA'
  ];

  const masteryStates = [
    'All',
    'Not Started',
    'Reading',
    'Understood',
    'Practiced',
    'Revision Needed',
    'Mastered'
  ];

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    
    const topicMastery = topic.masteryState || 'Not Started';
    const matchesMastery = selectedMastery === 'All' || topicMastery === selectedMastery;
    
    const matchesDifficulty = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
    const matchesWeak = !showWeakOnly || !!topic.isWeakTopic;
    const matchesRevision = !showRevisionOnly || !!topic.isRevisionDue;

    return matchesSearch && matchesCategory && matchesMastery && matchesDifficulty && matchesWeak && matchesRevision;
  });

  const getProblemsForTopic = (topicId: string) => problems.filter((p) => p.topicId === topicId);

  const renderDetailedPanel = () => {
    if (!selectedTopic) return null;
    return (
      <div
        className={`p-6 rounded-xl border ${
          isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        {/* Top Summary Banner */}
        <div className={`flex items-start justify-between mb-4 border-b pb-4 ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <div>
            <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">
              {selectedTopic.category}
            </span>
            <h3 className={`text-md font-bold mt-1 flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {selectedTopic.name}
              {selectedTopic.isWeakTopic && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 font-bold border border-rose-500/20 uppercase tracking-wide">
                  Weak Area
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={() => onToggleTopicStatus(selectedTopic.id)}
            className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg border transition ${
              selectedTopic.completionStatus === 'Completed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : selectedTopic.completionStatus === 'In Progress'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                : 'bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-neutral-900'
            }`}
          >
            {selectedTopic.completionStatus}
          </button>
        </div>

        {/* Tab Selector */}
        <div className={`flex border-b mb-5 overflow-x-auto gap-1 ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTopicTab('syllabus')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTopicTab === 'syllabus'
                ? 'border-orange-500 ' + (isDark ? 'text-white' : 'text-neutral-900')
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Syllabus
          </button>
          <button
            type="button"
            onClick={() => setActiveTopicTab('details')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTopicTab === 'details'
                ? 'border-orange-500 ' + (isDark ? 'text-white' : 'text-neutral-900')
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Revision & Mastery
          </button>
          <button
            type="button"
            onClick={() => setActiveTopicTab('code')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTopicTab === 'code'
                ? 'border-orange-500 ' + (isDark ? 'text-white' : 'text-neutral-900')
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Code ({PROGRAMS_BY_TOPIC[selectedTopic.id]?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTopicTab('notes')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTopicTab === 'notes'
                ? 'border-orange-500 ' + (isDark ? 'text-white' : 'text-neutral-900')
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            My Notes
          </button>

        </div>

        {/* Tab 1: SYLLABUS */}
        {activeTopicTab === 'syllabus' && (
          <div className="space-y-6">
            {/* Category Relevance Tag */}
            {SYLLABUS_CONTENT[selectedTopic.id] ? (
              <div className={`p-3.5 rounded-xl space-y-2 border ${
                isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-100 border-neutral-200'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500 font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Learning Path Introduction
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-750'}`}>
                  {SYLLABUS_CONTENT[selectedTopic.id].introduction}
                </p>
                <p className="text-xs text-neutral-400 italic">
                  {SYLLABUS_CONTENT[selectedTopic.id].conceptBreakdown}
                </p>
                <div className={`pt-2 border-t mt-2 text-[10px] font-mono ${
                  isDark ? 'border-neutral-800/50 text-neutral-500' : 'border-neutral-200 text-neutral-600'
                }`}>
                  Interview Weight: <span className={`font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>{SYLLABUS_CONTENT[selectedTopic.id].relevance}</span>
                </div>
              </div>
            ) : (
              <div className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-100 border-neutral-200'
              }`}>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-750'}`}>
                  {selectedTopic.description}
                </p>
              </div>
            )}

            {/* Things to learn checklist */}
            <div className={`p-5 rounded-xl border space-y-4 ${
              isDark ? 'bg-neutral-900/30 border-neutral-800/80' : 'bg-white border-neutral-200 shadow-sm'
            }`}>
              <h4 className="text-xs font-mono text-orange-500 uppercase tracking-wider font-bold">
                📋 What You Have To Learn
              </h4>
              <p className={`text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                Make sure you read and understand the following core concepts under this topic:
              </p>
              <ul className="space-y-2">
                {THINGS_TO_LEARN[selectedTopic.id]?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="text-orange-500 mt-1 font-bold shrink-0">•</span>
                    <span className={isDark ? 'text-neutral-200' : 'text-neutral-800'}>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-2">
                <button
                  onClick={() => onToggleTopicStatus(selectedTopic.id)}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider font-mono border transition ${
                    selectedTopic.completionStatus === 'Completed'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                      : 'bg-orange-500 hover:bg-orange-400 text-neutral-950 border-orange-500'
                  }`}
                >
                  {selectedTopic.completionStatus === 'Completed'
                    ? '✓ Topic Completed - Mark Incomplete'
                    : 'Mark Topic as Completed'}
                </button>
              </div>
            </div>

            {/* Level 3: Detailed Syllabus Subtopics Accordion */}
            {SYLLABUS_CONTENT[selectedTopic.id]?.subtopics && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Level 3: Core Concepts & Deep Dive
                </span>
                
                <div className="space-y-2.5">
                  {SYLLABUS_CONTENT[selectedTopic.id].subtopics.map((sub, idx) => {
                    const isExpanded = expandedSubtopic === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border transition ${
                          isExpanded
                            ? isDark ? 'border-neutral-700 bg-neutral-950/20' : 'border-neutral-300 bg-neutral-50'
                            : isDark ? 'border-neutral-800/50 hover:border-neutral-850' : 'border-neutral-250 hover:border-neutral-350'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedSubtopic(isExpanded ? -1 : idx)}
                          className="w-full text-left p-3.5 flex justify-between items-center focus:outline-none"
                        >
                          <span className={`text-xs font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-850'}`}>{sub.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                            sub.complexity.includes('O(1)') 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : sub.complexity.includes('O(N)') 
                              ? 'bg-orange-500/10 text-orange-500' 
                              : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {sub.complexity}
                          </span>
                        </button>
                        
                        {isExpanded && (
                          <div className={`p-3.5 border-t space-y-3.5 text-xs ${
                            isDark ? 'border-neutral-800 bg-neutral-950/10' : 'border-neutral-200 bg-white'
                          }`}>
                            <p className={isDark ? 'text-neutral-300' : 'text-neutral-750'}>{sub.definition}</p>
                            
                            {sub.commonMistakes && sub.commonMistakes.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-rose-500 uppercase block tracking-wider">Common Pitfalls</span>
                                <ul className={`text-[11px] space-y-1 border p-2 rounded list-disc pl-5 ${
                                  isDark ? 'text-rose-400 bg-rose-950/10 border-rose-900/20' : 'text-rose-750 bg-rose-50 border-rose-200'
                                }`}>
                                  {sub.commonMistakes.map((pit, pIdx) => <li key={pIdx}>{pit}</li>)}
                                </ul>
                              </div>
                            )}
                            
                            {sub.interviewQuestions && sub.interviewQuestions.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">Interview Context Questions</span>
                                <div className="space-y-1">
                                  {sub.interviewQuestions.map((q, qIdx) => (
                                    <div key={qIdx} className={`p-2 rounded border flex items-start gap-1.5 ${
                                      isDark ? 'bg-neutral-900/20 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                                    }`}>
                                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                                      <span>{q}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Level 4: Practice Problems */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                Level 4: Integrated Problem Practice ({getProblemsForTopic(selectedTopic.id).length})
              </span>
              
              <div className="space-y-2.5">
                {getProblemsForTopic(selectedTopic.id).map((prob) => {
                  const isExpanded = expandedProblemId === prob.id;
                  return (
                    <div
                      key={prob.id}
                      className={`rounded-lg border transition ${
                        isExpanded
                          ? isDark ? 'border-neutral-700 bg-neutral-950/20' : 'border-neutral-300 bg-neutral-50'
                          : isDark ? 'border-neutral-800/50 hover:border-neutral-850' : 'border-neutral-250 hover:border-neutral-350'
                      }`}
                    >
                      <div className="p-3.5 flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onUpdateProblem(prob.id, { bookmarked: !prob.bookmarked })}
                            className="p-1 rounded-md text-neutral-500 hover:text-amber-500 transition shrink-0"
                            title={prob.bookmarked ? "Remove Bookmark" : "Bookmark Problem"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${prob.bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                          
                          <a
                            href={prob.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-bold hover:text-orange-500 transition leading-snug ${
                              isDark ? 'text-neutral-200' : 'text-neutral-850'
                            }`}
                          >
                            {prob.title}
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            prob.difficulty === 'Easy' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : prob.difficulty === 'Medium' 
                              ? 'bg-orange-500/10 text-orange-500' 
                              : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {prob.difficulty}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatusMap: Record<Problem['status'], Problem['status']> = {
                                'Unsolved': 'Revision',
                                'Revision': 'Solved',
                                'Solved': 'Unsolved'
                              };
                              onToggleProblemStatus(prob.id, nextStatusMap[prob.status || 'Unsolved']);
                            }}
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase transition ${
                              prob.status === 'Solved'
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                : prob.status === 'Revision'
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-450'
                                : isDark
                                ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                                : 'bg-neutral-200 border-neutral-300 text-neutral-700 hover:text-neutral-900'
                            }`}
                          >
                            {prob.status}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setExpandedProblemId(isExpanded ? null : prob.id)}
                            className={`p-1 transition focus:outline-none rounded ${isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className={`p-3.5 border-t space-y-3.5 text-xs ${
                          isDark ? 'border-neutral-800 bg-neutral-950/10' : 'border-neutral-200 bg-white'
                        }`}>
                          {prob.hints && prob.hints.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider">Concept Hints</span>
                              <div className="p-2.5 bg-orange-500/[0.02] border border-orange-500/10 rounded-lg text-xs text-neutral-300 flex items-start gap-1.5 leading-relaxed bg-white/20 dark:bg-black/10">
                                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  {prob.hints.map((hint, hIdx) => (
                                    <p key={hIdx} className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{hIdx + 1}. {hint}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Log / Attempt details */}
                          <div className={`pt-2.5 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 ${
                            isDark ? 'border-neutral-800/50' : 'border-neutral-200'
                          }`}>
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Platform Source</span>
                              <input
                                type="text"
                                value={prob.platformSource || 'LeetCode'}
                                disabled
                                className={`w-full mt-1 p-1 text-[11px] rounded border ${
                                  isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                                }`}
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Time Taken (mins)</span>
                              <input
                                type="number"
                                value={prob.timeTakenMinutes || ''}
                                onChange={(e) => onUpdateProblem(prob.id, { timeTakenMinutes: parseInt(e.target.value) || 0 })}
                                className={`w-full mt-1 p-1 text-[11px] rounded border focus:outline-none focus:border-orange-500 ${
                                  isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-850'
                                }`}
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono text-neutral-500 uppercase block">Attempt Counts</span>
                              <input
                                type="number"
                                value={prob.attemptCount || 0}
                                onChange={(e) => onUpdateProblem(prob.id, { attemptCount: parseInt(e.target.value) || 0 })}
                                className={`w-full mt-1 p-1 text-[11px] rounded border focus:outline-none focus:border-orange-500 ${
                                  isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-850'
                                }`}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase block">My Solution approach & Logs</span>
                            <textarea
                              rows={2}
                              placeholder="Record algorithmic logic, edge cases encountered, or optimal time/space complexity notes..."
                              value={prob.notes || ''}
                              onChange={(e) => onUpdateProblem(prob.id, { notes: e.target.value })}
                              className={`w-full p-2 text-[11px] rounded border focus:outline-none focus:border-orange-500 ${
                                isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                              }`}
                            />
                          </div>
                          
                          <span className="text-[10px] font-mono text-neutral-500 block pl-7">
                            Attempts: {prob.attemptCount || 0} • Solved Date: {prob.solvedDate || 'Never'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {getProblemsForTopic(selectedTopic.id).length === 0 && (
                  <p className="text-xs text-neutral-500 italic pl-2">No structured problems listed for this topic.</p>
                )}
              </div>
            </div>

            {/* External Links */}
            {SYLLABUS_CONTENT[selectedTopic.id]?.externalLinks && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  External Authority Links
                </span>
                <div className="flex flex-wrap gap-2">
                  {SYLLABUS_CONTENT[selectedTopic.id].externalLinks.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 text-[11px] border px-2.5 py-1 rounded-lg transition ${
                        isDark ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700' : 'bg-white border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-350'
                      }`}
                    >
                      <span>{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: DETAILS */}
        {activeTopicTab === 'details' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'}`}>
              <p className={`text-xs leading-normal ${isDark ? 'text-neutral-450 font-mono' : 'text-neutral-600 font-sans'}`}>
                Update your mastery depth of <span className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>{selectedTopic.name}</span>. The system adjusts scheduling priority based on your state.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block">Concept Mastery Level</label>
                <select
                  value={selectedTopic.masteryState || 'Not Started'}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { masteryState: e.target.value as any })}
                  className={`w-full text-xs rounded p-2 font-sans focus:outline-none focus:border-orange-500 ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-850'
                  }`}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Reading">Reading</option>
                  <option value="Understood">Understood</option>
                  <option value="Practiced">Practiced</option>
                  <option value="Revision Needed">Revision Needed</option>
                  <option value="Mastered">Mastered</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block">Last Studied Date</label>
                <input
                  type="date"
                  value={selectedTopic.lastStudiedDate || ''}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { lastStudiedDate: e.target.value })}
                  className={`w-full text-xs rounded p-2 focus:outline-none font-mono ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block">Next Revision Date</label>
                <input
                  type="date"
                  value={selectedTopic.nextRevisionDate || ''}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { nextRevisionDate: e.target.value })}
                  className={`w-full text-xs rounded p-2 focus:outline-none font-mono ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block font-medium">Revision Priority</label>
                <select
                  value={selectedTopic.revisionPriority || 'Medium'}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { revisionPriority: e.target.value as any })}
                  className={`w-full text-xs rounded p-2 font-sans focus:outline-none ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-850'
                  }`}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block">Review Session Counter</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={selectedTopic.reviewCount || 0}
                    onChange={(e) => onUpdateTopic(selectedTopic.id, { reviewCount: parseInt(e.target.value) || 0 })}
                    className={`w-full text-xs rounded p-2 focus:outline-none text-center font-mono ${
                      isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateTopic(selectedTopic.id, { reviewCount: (selectedTopic.reviewCount || 0) + 1 })}
                    className={`px-3 py-2 rounded font-bold text-xs ${
                      isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-neutral-200 hover:bg-neutral-350 text-neutral-800'
                    }`}
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-neutral-800/30">
              <label className={`flex items-center gap-2 text-xs cursor-pointer ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <input
                  type="checkbox"
                  checked={!!selectedTopic.isWeakTopic}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { isWeakTopic: e.target.checked })}
                  className={`rounded text-orange-500 focus:ring-0 ${
                    isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                  }`}
                />
                <span>Flag as Weak Topic (Needs intense practice)</span>
              </label>

              <label className={`flex items-center gap-2 text-xs cursor-pointer ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <input
                  type="checkbox"
                  checked={!!selectedTopic.isRevisionDue}
                  onChange={(e) => onUpdateTopic(selectedTopic.id, { isRevisionDue: e.target.checked })}
                  className={`rounded text-orange-500 focus:ring-0 ${
                    isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                  }`}
                />
                <span>Flag as Revision Due (Bypasses schedule queue)</span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: CODE */}
        {activeTopicTab === 'code' && (
          <div className="space-y-4">
            <p className="text-[10px] text-neutral-400 font-mono uppercase mb-2">
              Step-by-Step Code Examples (Basic to Advanced)
            </p>
            <div className="space-y-4">
              {(PROGRAMS_BY_TOPIC[selectedTopic.id] || []).map((prog, index) => (
                <div
                  key={prog.id}
                  className={`p-4 rounded-xl border ${
                    isDark ? 'bg-neutral-950/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                      {index + 1}. {prog.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(prog.id, prog.codeSnippet)}
                      className={`text-[10px] font-mono border px-2 py-0.5 rounded transition ${
                        copiedId === prog.id
                          ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                          : isDark
                          ? 'border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white'
                          : 'border-neutral-250 hover:border-neutral-350 text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {copiedId === prog.id ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                  <p className={`text-[11px] leading-relaxed mb-3.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {prog.description}
                  </p>
                  <pre className={`p-3.5 rounded-lg text-[10px] font-mono overflow-x-auto max-h-56 ${
                    isDark ? 'bg-neutral-950 text-orange-400 border border-neutral-900' : 'bg-white border border-neutral-200 text-orange-700'
                  }`}>
                    <code>{prog.codeSnippet}</code>
                  </pre>
                </div>
              ))}

              {(!PROGRAMS_BY_TOPIC[selectedTopic.id] || PROGRAMS_BY_TOPIC[selectedTopic.id].length === 0) && (
                <p className="text-xs text-neutral-500 italic">No custom programs loaded yet for this topic.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: NOTES */}
        {activeTopicTab === 'notes' && (
          <div className="space-y-4">
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Write down your personal learning notes, syntax triggers, code shortcuts, and formulas. State is auto-saved locally on blur!
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-500" />
                  Personal Notes & Summaries
                </label>
                <textarea
                  rows={4}
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:border-orange-500 leading-relaxed font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                  placeholder="Record key concepts, structural behaviors, time/space limits..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-orange-500" />
                  Saved Concepts & Formulas
                </label>
                <textarea
                  rows={2}
                  value={localFormulas}
                  onChange={(e) => setLocalFormulas(e.target.value)}
                  onBlur={handleSaveNotes}
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:border-orange-500 leading-relaxed font-mono ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                  placeholder="Recurrence relations: T(N) = 2T(N/2) + O(N)..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-orange-500" />
                  Syntax & Code Reminders
                </label>
                <textarea
                  rows={2}
                  value={localReminders}
                  onChange={(e) => setLocalReminders(e.target.value)}
                  onBlur={handleSaveNotes}
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:border-orange-500 leading-relaxed font-mono ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                  placeholder="Map.getOrDefault(key, defaultValue)..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-orange-500" />
                  FAANG Interview Strategy & Tips
                </label>
                <textarea
                  rows={2}
                  value={localTips}
                  onChange={(e) => setLocalTips(e.target.value)}
                  onBlur={handleSaveNotes}
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:border-orange-500 leading-relaxed font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                  placeholder="Focus on slow-fast pointer technique, edge case arrays of length 0 or 1..."
                />
              </div>
            </div>
            
            <div className={`flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-2 border-t ${
              isDark ? 'border-neutral-800/40' : 'border-neutral-200'
            }`}>
              <span>STATE AUTO-SAVED ON BLUR</span>
              <button
                type="button"
                onClick={() => {
                  setLocalNotes('');
                  setLocalFormulas('');
                  setLocalReminders('');
                  setLocalTips('');
                  onUpdateTopic(selectedTopic.id, { notes: '', formulas: '', reminders: '', interviewTips: '' });
                }}
                className="text-rose-500 hover:text-rose-400 font-bold uppercase transition"
              >
                Clear Notes
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
            <BookOpen className="w-6 h-6 text-orange-500" />
            Syllabus Explorer
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Explore the complete 22-topic curriculum from basic Java syntax to advanced algorithms.
          </p>
        </div>
      </div>

      {/* Main Layout: Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (lg:col-span-7) - Filter & Topics List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Detailed Filters Panel */}
          <div
            className={`p-5 rounded-xl border space-y-4 ${
              isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-neutral-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-orange-500" />
                Advanced Filters
              </span>
              <button
                onClick={() => {
                  setSearchVal('');
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedMastery('All');
                  setSelectedDifficulty('All');
                  setShowWeakOnly(false);
                  setShowRevisionOnly(false);
                }}
                className={`text-[10px] font-mono font-bold uppercase tracking-wider transition ${
                  isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-500 hover:text-neutral-805'
                }`}
              >
                Reset Filters
              </button>
            </div>

            {/* Row 1: Search & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search syllabus topics..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className={`w-full text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-orange-500 font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-450'
                  }`}
                />
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className={`w-full text-xs rounded-lg p-2 focus:outline-none focus:border-orange-500 font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Mastery & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedMastery}
                  onChange={(e) => setSelectedMastery(e.target.value)}
                  className={`w-full text-xs rounded-lg p-2 focus:outline-none focus:border-orange-500 font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  <option value="All">All Concept Mastery States</option>
                  {masteryStates.filter(m => m !== 'All').map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className={`w-full text-xs rounded-lg p-2 focus:outline-none focus:border-orange-500 font-sans ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
                  }`}
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Row 3: Boolean Toggles */}
            <div className="flex flex-wrap gap-4 pt-1">
              <label className={`flex items-center gap-2 cursor-pointer text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <input
                  type="checkbox"
                  checked={showWeakOnly}
                  onChange={(e) => setShowWeakOnly(e.target.checked)}
                  className={`rounded focus:ring-0 focus:ring-offset-0 text-orange-500 ${
                    isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                  }`}
                />
                <span>Show Weak Topics Only</span>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <input
                  type="checkbox"
                  checked={showRevisionOnly}
                  onChange={(e) => setShowRevisionOnly(e.target.checked)}
                  className={`rounded focus:ring-0 focus:ring-offset-0 text-orange-500 ${
                    isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-300 bg-white'
                  }`}
                />
                <span>Revision Due Only</span>
              </label>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map((topic) => {
              const isActive = selectedTopicId === topic.id;
              const topicProblems = getProblemsForTopic(topic.id);
              const solvedProblems = topicProblems.filter((p) => p.status === 'Solved').length;
              const topicMastery = topic.masteryState || 'Not Started';

              // Map Mastery status to distinct styles
              const getMasteryColor = (state: string) => {
                switch(state) {
                  case 'Mastered': return isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  case 'Practiced': return isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-800 border-cyan-200';
                  case 'Understood': return isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-800 border-blue-200';
                  case 'Reading': return isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-850 border-amber-200';
                  case 'Revision Needed': return isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-100 text-rose-850 border-rose-200';
                  default: return isDark ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-neutral-100 text-neutral-600 border-neutral-200';
                }
              };

              return (
                <React.Fragment key={topic.id}>
                  <div
                    onClick={() => {
                      setSelectedTopicId(isActive ? null : topic.id);
                      setActiveTopicTab('syllabus');
                    }}
                    className={`p-5 rounded-xl border cursor-pointer transition flex flex-col justify-between h-52 relative ${
                      isActive
                        ? 'border-orange-500 bg-orange-500/[0.02] shadow-lg shadow-orange-500/5'
                        : isDark
                        ? 'bg-neutral-900/20 border-neutral-800/80 hover:border-neutral-800'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Status Indicator Bar */}
                    {topic.isWeakTopic && (
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-rose-500" title="Weak Area" />
                    )}

                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                          {topic.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {topic.isRevisionDue && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase animate-pulse">
                              Revision Due
                            </span>
                          )}
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${getMasteryColor(topicMastery)}`}>
                            {topicMastery}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {topic.name}
                      </h3>
                      <p className={`text-xs line-clamp-3 mt-1.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {topic.description}
                      </p>
                    </div>

                    <div className={`flex items-center justify-between border-t pt-3 mt-3 ${isDark ? 'border-neutral-800/50' : 'border-neutral-200'}`}>
                      <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {topic.estimatedHours} hrs
                      </span>
                      <span className={`text-[10px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {solvedProblems} / {topicProblems.length} Solved
                      </span>
                    </div>
                  </div>

                  {/* Inline details drawer for mobile/tablet */}
                  {isActive && (
                    <div className="col-span-full lg:hidden mt-2 mb-4">
                      {renderDetailedPanel()}
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className={`col-span-full py-16 text-center border border-dashed rounded-xl ${
                isDark ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-300 bg-neutral-50'
              }`}>
                <ShieldAlert className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm text-neutral-500 font-mono">No matching syllabus topics found.</p>
                <p className="text-xs text-neutral-600 mt-1">Try resetting or loosening your search and filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-5) - Detailed Topic Spec & Learning Panel (Desktop only) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-6">
          {selectedTopic ? (
            renderDetailedPanel()
          ) : (
            <div
              className={`p-10 rounded-xl border text-center ${
                isDark ? 'bg-neutral-900/20 border-neutral-800/80' : 'bg-white border-neutral-200'
              }`}
            >
              <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto mb-3.5" />
              <h3 className={`text-sm font-bold uppercase tracking-wider font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>Select a Syllabus Topic</h3>
              <p className={`text-xs mt-2.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Click any core card to study deep concept structures, explore full definitions, copy Java templates, record spaced repetition logs, and solve DSA problems.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
