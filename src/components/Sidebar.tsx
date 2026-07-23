/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Code2,
  BarChart3,
  Settings,
  GraduationCap,
  Calendar,
  History,
  Brain,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  progressPercentage: number;
  profile: UserProfile;
  mobileSidebarOpen?: boolean;
  setMobileSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  theme,
  progressPercentage,
  profile,
  mobileSidebarOpen = false,
  setMobileSidebarOpen
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', name: 'Study Roadmap', icon: Compass },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'topics', name: 'Syllabus Explorer', icon: BookOpen },
    { id: 'problems', name: 'Practice Arena', icon: Code2 },
    { id: 'aimentor', name: 'AI Mentor', icon: Brain },
    { id: 'revision', name: 'Revision Queue', icon: RefreshCw },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'recommendations', name: 'AI Advice', icon: Sparkles },
    { id: 'history', name: 'Study History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const isDark = theme === 'dark';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen border-r transition-transform duration-300 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 ${
        isDark
          ? 'bg-neutral-900 border-neutral-800 text-neutral-200'
          : 'bg-white border-neutral-200 text-neutral-800'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Scrollable Upper Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-sans font-bold tracking-tight text-md">
                  Java <span className="text-orange-500">DSA</span>
                </h1>
                <p className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
                  Journey Tracker
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            {setMobileSidebarOpen && (
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className={`md:hidden p-1.5 rounded-lg border text-neutral-400 transition ${
                  isDark 
                    ? 'border-neutral-800 hover:bg-neutral-800 hover:text-white' 
                    : 'border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Progress Indicator */}
          <div
            className={`p-4 rounded-xl border ${
              isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-neutral-500 uppercase">Syllabus Progress</span>
              <span className="text-xs font-mono font-bold text-orange-500">
                {progressPercentage}%
              </span>
            </div>
            <div className={`w-full rounded-full h-1.5 overflow-hidden ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-200'
            }`}>
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setMobileSidebarOpen) setMobileSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-neutral-800 text-white border-l-4 border-orange-500 pl-3'
                        : 'bg-neutral-100 text-neutral-950 border-l-4 border-orange-500 pl-3'
                      : isDark
                      ? 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-neutral-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pinned/Fixed Footer info - clean & structured */}
        <div className={`p-4 border-t shrink-0 ${
          isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold text-neutral-400 border uppercase ${
              isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-100 border-neutral-300'
            }`}>
              {profile.name ? (profile.name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('')) : 'AR'}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                {profile.name || 'Alex Rivera'}
              </p>
              <p className="text-[10px] font-mono text-neutral-500 uppercase truncate">
                Track: {profile.preferredLanguageTrack || 'Java'} + DSA
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
