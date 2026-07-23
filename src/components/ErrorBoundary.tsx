/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Download, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  props!: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleDownloadBackup = () => {
    const keys = [
      'java_dsa_profile',
      'java_dsa_topics',
      'java_dsa_problems',
      'java_dsa_roadmap',
      'java_dsa_current_day',
      'java_dsa_study_sessions'
    ];
    
    const data: Record<string, any> = {};
    keys.forEach((k) => {
      const val = localStorage.getItem(k);
      if (val) {
        try {
          // Store under clean keys matching normal backup imports
          const cleanKey = k.replace('java_dsa_', '');
          data[cleanKey] = JSON.parse(val);
        } catch (e) {
          const cleanKey = k.replace('java_dsa_', '');
          data[cleanKey] = val;
        }
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `java_dsa_crash_rescue_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetEverything = () => {
    if (confirm('Are you absolutely sure you want to clear your local database and restore initial default values? All progress will be deleted.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      const profileStr = localStorage.getItem('java_dsa_profile');
      let isDark = true;
      if (profileStr) {
        try {
          const profile = JSON.parse(profileStr);
          if (profile?.themePreference === 'light') {
            isDark = false;
          }
        } catch (e) {
          // default to dark if parse fails
        }
      }

      return (
        <div className={`min-h-screen flex items-center justify-center p-6 font-sans ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-850'}`}>
          <div className={`w-full max-w-xl border rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'}`}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>Something Went Wrong</h1>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-0.5">
                  Component Runtime Boundary Intercept
                </p>
              </div>
            </div>

            <div className={`rounded-2xl border p-4 text-xs font-mono space-y-2 ${isDark ? 'bg-neutral-950/60 border-neutral-850 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'}`}>
              <p className="text-red-500 font-bold">Error Message:</p>
              <pre className={`whitespace-pre-wrap overflow-x-auto break-all p-3 rounded-lg leading-relaxed max-h-40 ${isDark ? 'bg-neutral-950 text-neutral-400' : 'bg-neutral-100/80 text-neutral-600'}`}>
                {this.state.error?.toString() || 'Unknown Javascript Runtime Exception'}
              </pre>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              An unexpected crash was captured. To protect your hard-earned study logs, formulas, progress states, and custom notes, you can download a local rescue backup before resetting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleDownloadBackup}
                className={`py-3 px-4 rounded-xl font-mono font-bold uppercase tracking-wider text-[11px] transition flex items-center justify-center gap-2 border ${isDark ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-white' : 'bg-white border-neutral-350 hover:border-neutral-400 text-neutral-800'}`}
              >
                <Download className="w-4 h-4 text-orange-500" />
                Rescue Study Data
              </button>

              <button
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-mono font-bold uppercase tracking-wider text-[11px] transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Application
              </button>
            </div>

            <div className={`border-t pt-4 flex justify-between items-center text-[10px] font-mono text-neutral-500 ${isDark ? 'border-neutral-800/80' : 'border-neutral-200'}`}>
              <span>SANDBOX ENVIRONMENT PROTECTED</span>
              <button
                onClick={this.handleResetEverything}
                className="text-red-500 hover:underline hover:text-red-400"
              >
                Clear Database & Reset All
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}
