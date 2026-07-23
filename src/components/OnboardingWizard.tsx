/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Target,
  User,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  theme: 'dark' | 'light';
  onComplete: (profileData: Omit<UserProfile, 'themePreference'>) => void;
}

export default function OnboardingWizard({ theme, onComplete }: OnboardingWizardProps) {
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [durationPreset, setDurationPreset] = useState<'30' | '60' | '90' | 'custom'>('60');
  const [customDays, setCustomDays] = useState(45);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dailyHours, setDailyHours] = useState(2);
  const [currentLevel, setCurrentLevel] = useState<'Complete Beginner' | 'Beginner' | 'Intermediate'>('Beginner');
  const [targetGoal, setTargetGoal] = useState<'Placements' | 'Interview Prep' | 'DSA Mastery'>('DSA Mastery');
  const [learningPace, setLearningPace] = useState<'Light' | 'Balanced' | 'Intensive'>('Balanced');

  const getDurationDays = () => {
    if (durationPreset === '30') return 30;
    if (durationPreset === '60') return 60;
    if (durationPreset === '90') return 90;
    return customDays;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const days = getDurationDays();
      const startObj = new Date(startDate);
      const endObj = new Date(startObj.getTime() + days * 24 * 60 * 60 * 1000);
      const endDateStr = endObj.toISOString().split('T')[0];

      onComplete({
        name: name.trim() || 'Alex Rivera',
        preferredLanguageTrack: 'Java',
        selectedDurationWeeks: Math.ceil(days / 7),
        selectedDurationDays: days,
        startDate,
        endDate: endDateStr,
        dailyStudyHoursGoal: dailyHours,
        currentLevel,
        targetGoal,
        learningPace,
        onboarded: true,
        progressPercentage: 0
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div
        id="onboarding-modal"
        className={`w-full max-w-xl rounded-2xl border overflow-hidden shadow-2xl transition-all duration-300 ${
          isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-800'
        }`}
      >
        {/* Header Branding */}
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-neutral-800/80 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500 text-neutral-950">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-md font-bold tracking-tight font-sans ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Java + DSA Study Planner
              </h2>
              <p className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold">
                Personalized Onboarding Wizard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  s === step ? 'bg-orange-500' : s < step ? (isDark ? 'bg-neutral-700' : 'bg-neutral-300') : (isDark ? 'bg-neutral-800' : 'bg-neutral-200')
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Forms */}
        <div className="p-6 md:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  <User className="w-5 h-5 text-orange-500" />
                  What should we call you?
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Welcome to your study journey. Enter your name to customize your dashboard.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  Learner Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors ${isDark ? 'bg-neutral-950/60 border-neutral-800 text-neutral-200 placeholder-neutral-650' : 'bg-neutral-50 border-neutral-200 text-neutral-805 placeholder-neutral-400'}`}
                />
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-neutral-950/40 border-neutral-800/80' : 'bg-neutral-50 border-neutral-200'}`}>
                <span className="text-[10px] font-mono font-bold text-orange-500 uppercase block">
                  Active Track Selected
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-neutral-900'}`}>{name.trim() || 'Your'} Java + DSA Comprehensive Track</span>
                    <span className="text-[10px] text-neutral-500 block">Java Language Basics, OOPs, Collections, Linear & Non-Linear DSA, and algorithms.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Choose your learning duration
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Select a duration. We'll distribute the syllabus topics evenly to avoid daily overload.
                </p>
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDurationPreset('30')}
                  className={`p-4 rounded-xl border text-left transition ${
                    durationPreset === '30'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold font-sans'
                      : isDark
                      ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-neutral-800'}`}>30 Days</span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">Extreme Sprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDurationPreset('60')}
                  className={`p-4 rounded-xl border text-left transition ${
                    durationPreset === '60'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold font-sans'
                      : isDark
                      ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-neutral-800'}`}>60 Days</span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">Balanced Standard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDurationPreset('90')}
                  className={`p-4 rounded-xl border text-left transition ${
                    durationPreset === '90'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold font-sans'
                      : isDark
                      ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-neutral-800'}`}>90 Days</span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">In-depth Mastery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDurationPreset('custom')}
                  className={`p-4 rounded-xl border text-left transition ${
                    durationPreset === 'custom'
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold font-sans'
                      : isDark
                      ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-neutral-800'}`}>Custom Duration</span>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">Select your own days</span>
                </button>
              </div>

              {/* Custom days input */}
              {durationPreset === 'custom' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                      Custom Study Duration (Days)
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Min 15 - Max 2000</span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min={15}
                      max={2000}
                      value={customDays > 2000 ? 2000 : customDays}
                      onChange={(e) => setCustomDays(parseInt(e.target.value) || 15)}
                      className="flex-1 accent-orange-500"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={15}
                        max={2000}
                        value={customDays}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setCustomDays(isNaN(val) ? 0 : val);
                        }}
                        onBlur={() => {
                          if (customDays < 15) setCustomDays(15);
                          if (customDays > 2000) setCustomDays(2000);
                        }}
                        className={`w-20 border rounded-lg p-2 text-xs font-mono font-bold text-orange-500 text-center focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                      />
                      <span className="text-xs font-mono text-neutral-400">days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  Select Journey Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors ${isDark ? 'bg-neutral-950/60 border-neutral-800 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'}`}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  <Target className="w-5 h-5 text-orange-500" />
                  Define your level and target goal
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  This customizes the topic workload weight and depth.
                </p>
              </div>

              {/* Current experience level */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  Current Programming Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Complete Beginner', 'Beginner', 'Intermediate'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCurrentLevel(lvl)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition ${
                        currentLevel === lvl
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold'
                          : isDark
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target goal */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                  What is your primary goal?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Placements', 'Interview Prep', 'DSA Mastery'] as const).map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setTargetGoal(goal)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition ${
                        targetGoal === goal
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500 font-bold'
                          : isDark
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace & study hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                    Learning Pace
                  </label>
                  <select
                    value={learningPace}
                    onChange={(e) => setLearningPace(e.target.value as any)}
                    className={`w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'}`}
                  >
                    <option value="Light">Light (Slower, revision focused)</option>
                    <option value="Balanced">Balanced (Standard pacing)</option>
                    <option value="Intensive">Intensive (Faster, challenge heavy)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
                      Daily Study Hours
                    </label>
                    <span className="text-[11px] font-mono font-bold text-orange-500">
                      {dailyHours}h
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseInt(e.target.value))}
                    className="w-full accent-orange-500 bg-neutral-800 h-1 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className={`p-6 border-t flex items-center justify-between ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50'}`}>
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`text-xs font-mono disabled:opacity-30 uppercase tracking-wider font-bold transition-colors ${isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-500 hover:text-neutral-950'}`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider rounded-xl flex items-center gap-2 transition"
          >
            {step === 3 ? 'Generate Roadmap' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
