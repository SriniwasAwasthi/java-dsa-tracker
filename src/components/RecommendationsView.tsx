import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  HelpCircle,
  Activity,
  Award,
  Sliders,
  Compass
} from 'lucide-react';
import { Topic, Problem, UserProfile, RoadmapDay } from '../types';

interface RecommendationsViewProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  onUpdateTopic: (topicId: string, updates: Partial<Topic>) => void;
  onUpdateProblem: (problemId: string, updates: Partial<Problem>) => void;
  onRescheduleRemaining?: () => void;
}

export default function RecommendationsView({
  theme,
  profile,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  onUpdateTopic,
  onUpdateProblem,
  onRescheduleRemaining
}: RecommendationsViewProps) {
  const isDark = theme === 'dark';

  // --- Local states for dynamic widgets ---
  const [availableHours, setAvailableHours] = useState(profile.dailyStudyHoursGoal || 2);
  const [generatedMixedSession, setGeneratedMixedSession] = useState<any | null>(null);
  const [activeRecoveryPlanTopic, setActiveRecoveryPlanTopic] = useState<string | null>(null);

  // --- 1. Compute Progress Signals & Metrics ---
  const completedTopics = topics.filter((t) => t.completionStatus === 'Completed');
  const solvedProblems = problems.filter((p) => p.status === 'Solved');
  const weakTopics = topics.filter((t) => t.isWeakTopic || t.masteryState === 'Revision Needed');
  const overdueCount = topics.filter((t) => {
    if (t.completionStatus === 'Not Started' || t.isMastered) return false;
    if (!t.nextRevisionDate) return false;
    const diff = new Date(t.nextRevisionDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= -2;
  }).length;

  const totalSyllabusHours = topics.reduce((acc, t) => acc + t.estimatedHours, 0);
  const completedSyllabusHours = completedTopics.reduce((acc, t) => acc + t.estimatedHours, 0);

  // --- 2. Learning Mode Suggestions Engine ---
  const determineRecommendedMode = () => {
    if (overdueCount >= 3) {
      return {
        mode: 'Revision Priority Mode 🔄',
        reason: 'You currently have 3 or more topics overdue for spaced recall. Consolidating your existing knowledge is crucial to avoid memory decay before learning new structures.',
        color: isDark ? 'border-orange-500/30 bg-orange-500/5 text-orange-400' : 'border-orange-200 bg-orange-50 text-orange-800',
        actionText: 'Head to the Revision Hub'
      };
    } else if (weakTopics.length >= 2) {
      return {
        mode: 'Weak-Topic Recovery Mode 🩹',
        reason: `${weakTopics.length} topics are marked as weak. We recommend slow-pacing your roadmap and dedicating today to targeted re-runs and foundational problem-solving.`,
        color: isDark ? 'border-rose-500/30 bg-rose-500/5 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-800',
        actionText: 'Review Weak Modules'
      };
    } else if (currentDayNumber > roadmap.length * 0.7 && completedTopics.length < topics.length * 0.5) {
      return {
        mode: 'Catch-Up Mode 🏃‍♂️',
        reason: 'Based on your roadmap timeline, you are currently behind your optimal schedule. We recommend grouping backlog prerequisites into compact 1.5-hour theory sprints.',
        color: isDark ? 'border-amber-500/30 bg-amber-500/5 text-amber-400' : 'border-amber-200 bg-amber-50 text-amber-800',
        actionText: 'Optimize Catch-up blocks'
      };
    } else {
      return {
        mode: 'Balanced Core Study Mode ⚖️',
        reason: 'Excellent balance! Your memory retention is solid, and you are tracking well against deadlines. Continue with the default mixture of 1 new concept and 2 problem-solving sessions.',
        color: isDark ? 'border-green-500/30 bg-green-500/5 text-green-400' : 'border-green-200 bg-green-50 text-green-800',
        actionText: 'Next Roadmap Topic'
      };
    }
  };

  const modeSuggestion = determineRecommendedMode();

  // --- 3. Next Best Study Actions recommendations ---
  const nextRecommendedTopic = topics.find((t) => t.completionStatus !== 'Completed') || topics[0];
  const nextRecommendedRevision = topics.find((t) => t.completionStatus === 'Completed' && !t.isMastered) || topics[0];
  const nextRecommendedProblemSet = problems.find((p) => p.status === 'Unsolved' && p.topicId === nextRecommendedTopic?.id) || problems.find((p) => p.status === 'Unsolved') || problems[0];

  // --- 4. Daily Plan Optimizer Calculations ---
  const calculatePlanSplit = (hours: number) => {
    // Splits available study hours into specific focus items
    const totalMinutes = hours * 60;
    let theoryMin = Math.round(totalMinutes * 0.35);
    let codingMin = Math.round(totalMinutes * 0.45);
    let reviewMin = Math.round(totalMinutes * 0.20);

    if (overdueCount >= 3) {
      // Shift toward revision
      reviewMin = Math.round(totalMinutes * 0.45);
      theoryMin = Math.round(totalMinutes * 0.25);
      codingMin = Math.round(totalMinutes * 0.30);
    } else if (weakTopics.length > 0) {
      // Shift toward problem repair
      codingMin = Math.round(totalMinutes * 0.55);
      theoryMin = Math.round(totalMinutes * 0.25);
      reviewMin = Math.round(totalMinutes * 0.20);
    }

    return { theoryMin, codingMin, reviewMin };
  };

  const planSplit = calculatePlanSplit(availableHours);

  // --- 5. Mixed Session Generator ---
  const handleGenerateMixedSession = () => {
    const newTopic = topics.find((t) => t.completionStatus !== 'Completed') || topics[0];
    const revTopic = topics.find((t) => t.completionStatus === 'Completed' && !t.isMastered) || topics[1];
    const unsolvedProbs = problems.filter((p) => p.status === 'Unsolved' && (p.topicId === newTopic?.id || p.topicId === revTopic?.id)).slice(0, 2);

    if (unsolvedProbs.length < 2) {
      // Fallback unsolved
      unsolvedProbs.push(...problems.filter((p) => p.status === 'Unsolved').slice(0, 2 - unsolvedProbs.length));
    }

    setGeneratedMixedSession({
      newTopic,
      revTopic,
      unsolvedProbs,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
              <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-bold">
                Adaptive Study Engine
              </span>
            </div>
            <h2 className={`text-2xl font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Smart Planner & Diagnostics
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl mt-1">
              Analyzing current metrics and learning pace to curate personalized schedules, mixed practice sessions, and critical recovery paths.
            </p>
          </div>
        </div>

        {/* Bento-Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT BENTO: Learning Mode & Next Best Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Mode Recommendation Banner */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden ${modeSuggestion.color}`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80 block">
                    Dynamic Mode Recommendation
                  </span>
                  <h3 className={`text-lg font-bold font-sans ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {modeSuggestion.mode}
                  </h3>
                  <p className={`text-xs leading-relaxed max-w-xl ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    {modeSuggestion.reason}
                  </p>
                </div>
                <Zap className="w-7 h-7 opacity-20 animate-pulse shrink-0" />
              </div>
            </div>

            {/* Next Best Actions Bento Card */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Next Best Study Actions
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Topic suggestion */}
                <div className={`p-4.5 border rounded-xl flex flex-col justify-between space-y-4 ${
                  isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-orange-500 uppercase block">1. Target Concept</span>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{nextRecommendedTopic?.name || 'Complete!'}</h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2">
                      {nextRecommendedTopic?.description || 'You completed the entire syllabus list!'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est: {nextRecommendedTopic?.estimatedHours || 0} hrs</span>
                  </div>
                </div>

                {/* Revision suggestion */}
                <div className={`p-4.5 border rounded-xl flex flex-col justify-between space-y-4 ${
                  isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-cyan-500 uppercase block">2. Recall Review</span>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{nextRecommendedRevision?.name || 'All Clean!'}</h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2">
                      Active recall reinforcement using spaced repetitions.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>RevCount: {nextRecommendedRevision?.reviewCount || 0}</span>
                  </div>
                </div>

                {/* Problem suggestion */}
                <div className={`p-4.5 border rounded-xl flex flex-col justify-between space-y-4 ${
                  isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-green-500 uppercase block">3. Coding Drill</span>
                    <h4 className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-neutral-900'}`}>{nextRecommendedProblemSet?.title || 'All Solved!'}</h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-2">
                      Topic: {nextRecommendedProblemSet?.topicName || 'General'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                    <Zap className={`w-3.5 h-3.5 ${nextRecommendedProblemSet?.difficulty === 'Hard' ? 'text-rose-500' : 'text-green-500'}`} />
                    <span>Diff: {nextRecommendedProblemSet?.difficulty || 'Medium'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Daily Mixed Study Session Builder */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Mixed Practice Session Compiler
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Intelligently assemble single-day study sets that bundle fresh learning, active recall, and core coding trials together.
                  </p>
                </div>
                <button
                  onClick={handleGenerateMixedSession}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 text-xs font-bold font-mono transition"
                >
                  Compile Set
                </button>
              </div>

              {generatedMixedSession && (
                <div className={`border rounded-xl p-5 space-y-4 animate-fade-in text-xs ${
                  isDark ? 'bg-neutral-950/60 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-neutral-850' : 'border-neutral-200'}`}>
                    <span className="font-mono text-[10px] text-orange-500 uppercase font-bold">Today&apos;s Compiled Mixed Core</span>
                    <span className="text-[10px] font-mono text-neutral-500">Compiled at {generatedMixedSession.generatedAt}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">1. Concepts to Study</span>
                      <div className={`p-3 rounded-lg space-y-1 ${isDark ? 'bg-neutral-900/40' : 'bg-white border border-neutral-200'}`}>
                        <div className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          <span>Theory: {generatedMixedSession.newTopic.name}</span>
                        </div>
                        <div className="text-neutral-400 pl-3">Recall Review: {generatedMixedSession.revTopic.name}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block">2. Coding Challenges</span>
                      <div className={`p-3 rounded-lg space-y-1.5 ${isDark ? 'bg-neutral-900/40' : 'bg-white border border-neutral-200'}`}>
                        {generatedMixedSession.unsolvedProbs.map((p: any) => (
                          <div key={p.id} className="flex justify-between items-center text-neutral-300">
                            <span className={isDark ? 'text-neutral-300' : 'text-neutral-750'}>{p.title}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                              {p.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT BENTO: Plan Optimizer, Diagnostics, and Recovery */}
          <div className="space-y-6">
            
            {/* Daily Study Plan Optimizer */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Daily Optimizer
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Move the slider to configure your available hours today and dynamically adjust your session times.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-neutral-500">Available Time</span>
                  <span className="text-orange-500 font-bold">{availableHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              <div className={`space-y-2 pt-3 border-t text-xs ${isDark ? 'border-neutral-850' : 'border-neutral-200'}`}>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">Optimized Schedule Split</span>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Theory & Conceptualizing</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{planSplit.theoryMin} mins</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Coding Arena Practices</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{planSplit.codingMin} mins</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className={isDark ? 'text-neutral-300' : 'text-neutral-600'}>Spaced Active Recall</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{planSplit.reviewMin} mins</span>
                </div>
              </div>
            </div>

            {/* Weak-Topic Diagnostics & Recovery Plans */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
            }`}>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                Weak-Topic Diagnoses ({weakTopics.length})
              </span>

              {weakTopics.length === 0 ? (
                <div className={`text-center py-6 border border-dashed rounded-xl ${
                  isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50/50'
                }`}>
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1.5" />
                  <p className="text-[11px] text-neutral-400">No diagnostic weaknesses detected. Keep studying!</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {weakTopics.slice(0, 3).map((topic) => (
                    <div
                      key={topic.id}
                      className={`p-3 border rounded-xl space-y-2 text-xs ${
                        isDark ? 'bg-neutral-950/60 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{topic.name}</span>
                        <span className="text-[9px] font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          Lags
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-2">
                        Requires foundational repairs. Recommended spacing: revisit every 2 days.
                      </p>

                      {activeRecoveryPlanTopic === topic.id ? (
                        <div className={`mt-2 p-3 rounded border space-y-2 text-[10px] animate-fade-in leading-relaxed ${
                          isDark ? 'bg-neutral-900/50 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-750 shadow-sm'
                        }`}>
                          <span className="font-bold text-orange-500 font-mono block uppercase">Action Recovery Steps:</span>
                          <div>• Re-read concept walkthrough with code visualizations.</div>
                          <div>• Dry run a simple 3-node traversal on paper.</div>
                          <div>• Solve 2 Easy-rated related challenges.</div>
                          <button
                            onClick={() => {
                              onUpdateTopic(topic.id, { isWeakTopic: false });
                              setActiveRecoveryPlanTopic(null);
                            }}
                            className="text-[9px] font-mono text-green-500 hover:underline block pt-1.5"
                          >
                            Mark Recovered & Ready
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveRecoveryPlanTopic(topic.id)}
                          className="text-[10px] font-mono text-orange-500 hover:underline"
                        >
                          Show Recovery Guide →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Roadmap Adaptability Controls */}
            {onRescheduleRemaining && (
              <div className={`p-6 rounded-2xl border space-y-3.5 text-xs ${
                isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
              }`}>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Timeline Resilience</span>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Have you fallen slightly behind? Use the adaptive rescheduler to redistribute pending syllabus tasks over your remaining schedule without overwhelming future days.
                </p>
                <button
                  onClick={() => {
                    onRescheduleRemaining();
                    alert('Your study timeline has been dynamically re-optimized! Overloaded future days have been smoothed out.');
                  }}
                  className={`w-full py-2.5 font-mono font-bold uppercase tracking-wider text-[10px] rounded-xl transition flex items-center justify-center gap-1.5 ${
                    isDark ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Trigger Adaptive Rescheduler
                </button>
              </div>
            )}

          </div>

        </div>

    </div>
  );
}
