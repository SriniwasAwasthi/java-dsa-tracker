/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  X,
  FileEdit,
  Save
} from 'lucide-react';
import { Problem, Topic } from '../types';

interface ProblemsViewProps {
  theme: 'dark' | 'light';
  problems: Problem[];
  topics: Topic[];
  onToggleProblemStatus: (problemId: string, status: Problem['status']) => void;
  onUpdateProblemNotes: (problemId: string, notes: string) => void;
  onUpdateProblem?: (problemId: string, updates: Partial<Problem>) => void;
}

export default function ProblemsView({
  theme,
  problems,
  topics,
  onToggleProblemStatus,
  onUpdateProblemNotes,
  onUpdateProblem
}: ProblemsViewProps) {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVal, setSearchVal] = useState('');

  // Debounce search query to prevent stutter
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Unsolved' | 'Solved' | 'Revision'>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [currentNotesContent, setCurrentNotesContent] = useState('');

  // Filter problems
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.topicName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || prob.status === selectedStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleStartEditingNotes = (prob: Problem) => {
    setEditingNotesId(prob.id);
    setCurrentNotesContent(prob.notes || '');
  };

  const handleSaveNotes = (probId: string) => {
    onUpdateProblemNotes(probId, currentNotesContent);
    setEditingNotesId(null);
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
            <Code2 className="w-6 h-6 text-orange-500" />
            Practice Arena
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Solve classical LeetCode & GFG problems handpicked for each DSA topic. Keep notes on tricky test cases.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
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
            placeholder="Search problems by title or topic..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:border-orange-500 font-sans ${
              isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
            }`}
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono">DIFFICULTY:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as typeof selectedDifficulty)}
              className={`text-xs rounded-lg p-2 focus:outline-none focus:border-orange-500 font-sans ${
                isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              className={`text-xs rounded-lg p-2 focus:outline-none focus:border-orange-500 font-sans ${
                isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
              }`}
            >
              <option value="All">All Statuses</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Solved">Solved</option>
              <option value="Revision">Revision</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-4">
        {filteredProblems.map((prob) => {
          const isEditingNotes = editingNotesId === prob.id;
          return (
            <div
              key={prob.id}
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{prob.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[11px] font-sans text-neutral-400">
                      <BookOpen className="w-3 h-3 text-neutral-500" />
                      {prob.topicName}
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold uppercase ${
                        prob.difficulty === 'Easy'
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : prob.difficulty === 'Medium'
                          ? isDark ? 'text-amber-400' : 'text-amber-600'
                          : isDark ? 'text-rose-400' : 'text-rose-600'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>
                </div>
                {prob.url ? (
                  <a
                    href={prob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-orange-500 hover:underline flex items-center gap-1 shrink-0"
                  >
                    {prob.url.includes('geeksforgeeks.org') ? 'GeeksforGeeks' : 'LeetCode'} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-neutral-500 italic text-[10px] shrink-0">Challenge</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-neutral-800/20">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Status</span>
                <select
                  value={prob.status}
                  onChange={(e) => onToggleProblemStatus(prob.id, e.target.value as Problem['status'])}
                  className={`text-xs font-mono rounded p-1.5 focus:outline-none focus:border-orange-500 ${
                    isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-850'
                  }`}
                >
                  <option value="Unsolved">Unsolved</option>
                  <option value="Solved">Solved</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              <div className="pt-2.5 border-t border-neutral-800/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Study Notes</span>
                  {!isEditingNotes && (
                    <button
                      onClick={() => handleStartEditingNotes(prob)}
                      className={`p-1 transition ${isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                      title="Edit Notes"
                    >
                      <FileEdit className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={currentNotesContent}
                      onChange={(e) => setCurrentNotesContent(e.target.value)}
                      placeholder="Add notes..."
                      className={`w-full rounded px-2 py-1.5 text-xs focus:outline-none focus:border-orange-500 ${
                        isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                      }`}
                    />
                    <button
                      onClick={() => handleSaveNotes(prob.id)}
                      className="p-1.5 rounded bg-orange-500 text-neutral-950 hover:bg-orange-400 transition shrink-0"
                      title="Save Notes"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className={`text-xs italic font-sans break-words p-2 rounded border mt-1 ${
                    isDark ? 'text-neutral-400 bg-neutral-950/30 border-neutral-800/30' : 'text-neutral-600 bg-neutral-50 border-neutral-200'
                  }`}>
                    {prob.notes || 'No custom notes logged'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {filteredProblems.length === 0 && (
          <div className={`py-12 text-center text-neutral-500 font-mono border border-dashed rounded-xl ${
            isDark ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-300 bg-neutral-50'
          }`}>
            No practice challenges matched your search filters.
          </div>
        )}
      </div>

      {/* Problems Table / Board - Desktop View */}
      <div
        className={`hidden md:block border rounded-xl overflow-hidden ${
          isDark ? 'bg-neutral-900/10 border-neutral-800' : 'bg-white border-neutral-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[10px] font-mono text-neutral-500 uppercase tracking-wider ${
                  isDark ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <th className="py-4 px-6 font-semibold">Title</th>
                <th className="py-4 px-6 font-semibold">Topic Mapping</th>
                <th className="py-4 px-6 font-semibold">Difficulty</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Study Notes</th>
                <th className="py-4 px-6 font-semibold text-right">Resource</th>
              </tr>
            </thead>
            <tbody className={isDark ? 'divide-y divide-neutral-800/50' : 'divide-y divide-neutral-200'}>
              {filteredProblems.map((prob) => {
                const isEditingNotes = editingNotesId === prob.id;

                return (
                  <tr
                    key={prob.id}
                    className={`text-xs hover:bg-neutral-900/[0.02] transition ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    {/* Title */}
                    <td className={`py-4 px-6 font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {prob.title}
                    </td>

                    {/* Topic Name */}
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 font-sans">
                        <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                        {prob.topicName}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-4 px-6">
                      <span
                        className={`font-mono text-[10px] font-bold uppercase ${
                          prob.difficulty === 'Easy'
                            ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                            : prob.difficulty === 'Medium'
                            ? isDark ? 'text-amber-400' : 'text-amber-600'
                            : isDark ? 'text-rose-400' : 'text-rose-600'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td className="py-4 px-6">
                      <select
                        value={prob.status}
                        onChange={(e) => onToggleProblemStatus(prob.id, e.target.value as Problem['status'])}
                        className={`text-xs font-mono rounded p-1.5 focus:outline-none focus:border-orange-500 ${
                          isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-850'
                        }`}
                      >
                        <option value="Unsolved">Unsolved</option>
                        <option value="Solved">Solved</option>
                        <option value="Revision">Revision</option>
                      </select>
                    </td>

                    {/* Notes Box */}
                    <td className="py-4 px-6 max-w-sm">
                      {isEditingNotes ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={currentNotesContent}
                            onChange={(e) => setCurrentNotesContent(e.target.value)}
                            placeholder="Add notes, e.g., 'Use two pointer...'"
                            className={`w-full rounded p-1 text-xs focus:outline-none focus:border-orange-500 ${
                              isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                            }`}
                          />
                          <button
                            onClick={() => handleSaveNotes(prob.id)}
                            className="p-1 rounded bg-orange-500 text-neutral-950 hover:bg-orange-400 transition"
                            title="Save Notes"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 group">
                          <span className={isDark ? 'text-neutral-400 italic block overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]' : 'text-neutral-600 italic block overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]'}>
                            {prob.notes || 'No custom notes logged'}
                          </span>
                          <button
                            onClick={() => handleStartEditingNotes(prob)}
                            className={`opacity-0 group-hover:opacity-100 p-1 transition ${isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
                            title="Edit Notes"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Links */}
                    <td className="py-4 px-6 text-right">
                      {prob.url ? (
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-orange-500 hover:underline flex items-center justify-end gap-1"
                        >
                          {prob.url.includes('geeksforgeeks.org') ? 'GeeksforGeeks' : 'LeetCode'} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-neutral-500 italic text-[11px]">Syllabus challenge</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                    No practice challenges matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
