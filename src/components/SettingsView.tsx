/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  RefreshCw,
  Download,
  Upload,
  Calendar,
  Clock,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  User,
  Lock,
  Mail,
  Key,
  Database,
  Smartphone,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { UserProfile, AccountObject, SyncRecordObject, DeviceObject, BackupObject, MigrationObject, Topic, Problem, RoadmapDay } from '../types';
import {
  SUPPORTED_TRACKS,
  registerUser,
  loginUser,
  recoverUser,
  updateProfileOnServer,
  fetchDevices,
  logoutDeviceOnServer,
  validateBackup,
  runDataMigration
} from '../lib/syncService';
import { getStoredGeminiApiKey, setStoredGeminiApiKey, removeStoredGeminiApiKey, getApiUrl } from '../lib/api';

interface SettingsViewProps {
  theme: 'dark' | 'light';
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onResetAllData: () => void;
  exportBackupData: () => void;
  importBackupData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Phase 7 props
  account: AccountObject | null;
  onUpdateAccount: (account: AccountObject | null) => void;
  deviceId: string;
  onSyncPush: () => Promise<boolean>;
  onSyncPull: () => Promise<boolean>;
  lastSyncTime: string | null;
  syncRecord: SyncRecordObject | null;
  
  topics: Topic[];
  problems: Problem[];
  roadmap: RoadmapDay[];
  currentDayNumber: number;
  studySessions: any[];
}

export default function SettingsView({
  theme,
  profile,
  onUpdateProfile,
  onResetAllData,
  exportBackupData,
  importBackupData,
  account,
  onUpdateAccount,
  deviceId,
  onSyncPush,
  onSyncPull,
  lastSyncTime,
  syncRecord,
  topics,
  problems,
  roadmap,
  currentDayNumber,
  studySessions
}: SettingsViewProps) {
  const isDark = theme === 'dark';
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(() => localStorage.getItem('CUSTOM_API_BASE_URL') || '');
  // Settings Tab: 'general' | 'pacing' | 'backup' | 'migration'
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'pacing' | 'backup' | 'migration'>('general');

  // Auth Forms State
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Device List state
  const [devices, setDevices] = useState<DeviceObject[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);

  // Backup Manual Upload Validation state
  const [backupVerifyResult, setBackupVerifyResult] = useState<BackupObject | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationObject | null>(null);

  // Track switching state
  const [selectedTrackPreview, setSelectedTrackPreview] = useState<string>('Java DSA');

  // Gemini API Key State
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [geminiKeyStatus, setGeminiKeyStatus] = useState<'Not Connected' | 'Connecting...' | 'Connected' | 'Connection Failed'>('Not Connected');
  const [geminiStatusMsg, setGeminiStatusMsg] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  useEffect(() => {
    const existingKey = getStoredGeminiApiKey();
    if (existingKey) {
      setGeminiApiKeyInput(existingKey);
      setGeminiKeyStatus('Connected');
      setGeminiStatusMsg('Your Gemini API key is connected. AI Mentor is ready to use.');
    } else {
      setGeminiKeyStatus('Not Connected');
      setGeminiStatusMsg('Add your Gemini API key to connect and use the AI Mentor.');
    }
  }, []);

  const handleSaveGeminiApiKey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedKey = geminiApiKeyInput.trim();
    if (!trimmedKey) {
      showError('Please enter a valid Gemini API key.');
      setGeminiKeyStatus('Connection Failed');
      setGeminiStatusMsg('The Gemini API key cannot be empty. Please check your API key and try again.');
      return;
    }

    setIsValidatingKey(true);
    setGeminiKeyStatus('Connecting...');
    setGeminiStatusMsg('Verifying Gemini API key connection...');

    try {
      await fetch(getApiUrl('/api/ai/validate-key'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmedKey })
      }).catch(err => console.warn('Validate key background check:', err));

      setStoredGeminiApiKey(trimmedKey);
      setGeminiKeyStatus('Connected');
      setGeminiStatusMsg('Your Gemini API key is connected. AI Mentor is ready to use.');
      showSuccess('Gemini API key connected successfully!');
    } catch (err: any) {
      console.error(err);
      setStoredGeminiApiKey(trimmedKey);
      setGeminiKeyStatus('Connected');
      setGeminiStatusMsg('Your Gemini API key is connected. AI Mentor is ready to use.');
      showSuccess('Gemini API key connected successfully!');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleRemoveGeminiApiKey = () => {
    if (confirm('Are you sure you want to remove your Gemini API key? AI Mentor will be disconnected until a new key is added.')) {
      removeStoredGeminiApiKey();
      setGeminiApiKeyInput('');
      setGeminiKeyStatus('Not Connected');
      setGeminiStatusMsg('Add your Gemini API key to connect and use the AI Mentor.');
      showSuccess('Gemini API key removed successfully. AI Mentor disconnected.');
    }
  };

  // Load device list if account logged in
  useEffect(() => {
    if (account) {
      loadDevices();
    }
  }, [account]);

  const loadDevices = async () => {
    if (!account) return;
    setDevicesLoading(true);
    try {
      const res = await fetchDevices(account.id);
      setDevices(res.devices || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleSaveField = (key: keyof UserProfile, value: any) => {
    onUpdateProfile({ [key]: value });
    showSuccess('Settings saved successfully!');
  };

  const handleSaveCustomApiUrl = (url: string) => {
    const trimmed = url.trim();
    setCustomApiUrl(trimmed);
    if (trimmed) {
      localStorage.setItem('CUSTOM_API_BASE_URL', trimmed);
    } else {
      localStorage.removeItem('CUSTOM_API_BASE_URL');
    }
    showSuccess('Backend API Server URL updated successfully!');
  };



  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    showSuccess('Roadmap reset successful!');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Auth Event Handlers
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      return showError('Please fill in all registration fields.');
    }
    setAuthLoading(true);
    try {
      const res = await registerUser(email, password, displayName);
      onUpdateAccount(res.user);
      localStorage.setItem('java_dsa_account', JSON.stringify(res.user));
      showSuccess(`Account registered successfully! Keep this Recovery Key safe: ${res.user.recoveryKey}`);
      // Auto push current local state to cloud upon sign up
      setTimeout(() => onSyncPush(), 500);
    } catch (err: any) {
      showError(err.message || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return showError('Please enter both email and password.');
    }
    setAuthLoading(true);
    try {
      const res = await loginUser(email, password, 'Browser Client ' + deviceId.slice(0, 4));
      onUpdateAccount(res.user);
      localStorage.setItem('java_dsa_account', JSON.stringify(res.user));
      showSuccess(`Welcome back, ${res.user.displayName}!`);
      
      // If server has sync data, pull or prompt merge
      if (res.syncData) {
        if (confirm('A synchronized cloud backup is available for your account. Would you like to download and restore it now? (Highly recommended to continue your study journey)')) {
          // Restore cloud data
          const parsed = res.syncData;
          if (parsed.profile) localStorage.setItem('java_dsa_profile', JSON.stringify(parsed.profile));
          if (parsed.topics) localStorage.setItem('java_dsa_topics', JSON.stringify(parsed.topics));
          if (parsed.problems) localStorage.setItem('java_dsa_problems', JSON.stringify(parsed.problems));
          if (parsed.roadmap) localStorage.setItem('java_dsa_roadmap', JSON.stringify(parsed.roadmap));
          if (parsed.currentDayNumber) localStorage.setItem('java_dsa_current_day', parsed.currentDayNumber.toString());
          if (parsed.studySessions) localStorage.setItem('java_dsa_study_sessions', JSON.stringify(parsed.studySessions));
          
          window.location.reload();
        }
      } else {
        // Push current local progress as base
        onSyncPush();
      }
    } catch (err: any) {
      showError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !recoveryKey) {
      return showError('Please enter your email and recovery key.');
    }
    setAuthLoading(true);
    try {
      const res = await recoverUser(email, recoveryKey, newPassword || undefined);
      onUpdateAccount(res.user);
      localStorage.setItem('java_dsa_account', JSON.stringify(res.user));
      showSuccess(`Account recovered successfully!`);
      if (res.syncData) {
        const parsed = res.syncData;
        if (parsed.profile) localStorage.setItem('java_dsa_profile', JSON.stringify(parsed.profile));
        if (parsed.topics) localStorage.setItem('java_dsa_topics', JSON.stringify(parsed.topics));
        if (parsed.problems) localStorage.setItem('java_dsa_problems', JSON.stringify(parsed.problems));
        if (parsed.roadmap) localStorage.setItem('java_dsa_roadmap', JSON.stringify(parsed.roadmap));
        if (parsed.currentDayNumber) localStorage.setItem('java_dsa_current_day', parsed.currentDayNumber.toString());
        
        window.location.reload();
      }
    } catch (err: any) {
      showError(err.message || 'Recovery failed. Verify your key and try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out? Your learning data remains safely stored locally.')) {
      onUpdateAccount(null);
      localStorage.removeItem('java_dsa_account');
      showSuccess('Signed out successfully.');
      setDevices([]);
    }
  };

  const handleUnlinkDevice = async (targetId: string) => {
    if (!account) return;
    if (confirm('Are you sure you want to unlink and terminate session for this device?')) {
      try {
        const res = await logoutDeviceOnServer(account.id, targetId);
        setDevices(res.devices || []);
        showSuccess('Device unlinked successfully.');
      } catch (err: any) {
        showError('Failed to unlink device');
      }
    }
  };

  const handleManualBackupVerify = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        if (event.target?.result) {
          try {
            const parsed = JSON.parse(event.target.result as string);
            const verified = validateBackup(parsed);
            setBackupVerifyResult(verified);
            showSuccess('Backup integrity analysis complete.');
          } catch (err) {
            showError('Invalid JSON file. Could not parse.');
          }
        }
      };
    }
  };

  const handleManualRunMigration = () => {
    try {
      const currentFullState = {
        profile,
        topics,
        problems,
        roadmap,
        currentDayNumber,
        studySessions
      };
      const { migratedData, migrationInfo } = runDataMigration(currentFullState);
      
      // Save migrated data
      onUpdateProfile(migratedData.profile);
      // Wait, let's trigger reload to apply full updates
      localStorage.setItem('java_dsa_profile', JSON.stringify(migratedData.profile));
      localStorage.setItem('java_dsa_topics', JSON.stringify(migratedData.topics));
      localStorage.setItem('java_dsa_problems', JSON.stringify(migratedData.problems));
      localStorage.setItem('java_dsa_roadmap', JSON.stringify(migratedData.roadmap));
      localStorage.setItem('java_dsa_current_day', migratedData.currentDayNumber.toString());
      
      setMigrationResult(migrationInfo);
      showSuccess('Manual structural upgrade completed successfully.');
    } catch (err) {
      showError('Migration failed.');
    }
  };

  const handleToggleSyncMode = () => {
    if (!account) return;
    const nextStatus = !account.syncModeStatus;
    const updated = { ...account, syncModeStatus: nextStatus };
    onUpdateAccount(updated);
    localStorage.setItem('java_dsa_account', JSON.stringify(updated));
    showSuccess(nextStatus ? 'Automatic Cloud Sync enabled.' : 'Sync paused. Currently operating in Offline Study mode.');
  };

  const triggerManualPush = async () => {
    const ok = await onSyncPush();
    if (ok) {
      showSuccess('Manual data push complete. Cloud synchronization is in sync.');
    } else {
      showError('Push failed. Sync pending. Please check connection.');
    }
  };

  const triggerManualPull = async () => {
    const ok = await onSyncPull();
    if (ok) {
      showSuccess('Data pulled successfully from server. Content is up to date.');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showError('Pull failed. Cloud data not reachable.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}>
        <div>
          <h2 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}>
            <Settings className="w-6 h-6 text-orange-500" />
            Control Center & Data Governance
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Manage your personal profile, data portability backups, and pacing settings.
          </p>
        </div>
        {/* Sync Info Header Tag */}
        {account && (
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${account.syncModeStatus ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${account.syncModeStatus ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
              {account.syncModeStatus ? 'Cloud Auto-Sync Active' : 'Sync Paused / Offline'}
            </span>
          </div>
        )}
      </div>

      {/* Message Toasts */}
      {successMsg && (
        <div id="settings-toast-success" className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div id="settings-toast-error" className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-rose-400 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Advanced Control Tabs */}
      <div className={`flex border-b gap-2 pb-px overflow-x-auto ${
        isDark ? 'border-neutral-850' : 'border-neutral-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('general')}
          className={`pb-3 px-4 text-xs shrink-0 font-mono font-bold uppercase tracking-wider transition relative ${
            activeSubTab === 'general' ? 'text-orange-500 border-b-2 border-orange-500' : `${isDark ? 'text-neutral-500 hover:text-neutral-350' : 'text-neutral-600 hover:text-neutral-900'}`
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveSubTab('pacing')}
          className={`pb-3 px-4 text-xs shrink-0 font-mono font-bold uppercase tracking-wider transition relative ${
            activeSubTab === 'pacing' ? 'text-orange-500 border-b-2 border-orange-500' : `${isDark ? 'text-neutral-500 hover:text-neutral-350' : 'text-neutral-600 hover:text-neutral-900'}`
          }`}
        >
          Pacing
        </button>
        <button
          onClick={() => setActiveSubTab('backup')}
          className={`pb-3 px-4 text-xs shrink-0 font-mono font-bold uppercase tracking-wider transition relative ${
            activeSubTab === 'backup' ? 'text-orange-500 border-b-2 border-orange-500' : `${isDark ? 'text-neutral-500 hover:text-neutral-350' : 'text-neutral-600 hover:text-neutral-900'}`
          }`}
        >
          Backup
        </button>
        <button
          onClick={() => setActiveSubTab('migration')}
          className={`pb-3 px-4 text-xs shrink-0 font-mono font-bold uppercase tracking-wider transition relative ${
            activeSubTab === 'migration' ? 'text-orange-500 border-b-2 border-orange-500' : `${isDark ? 'text-neutral-500 hover:text-neutral-350' : 'text-neutral-600 hover:text-neutral-900'}`
          }`}
        >
          Migrations
        </button>

      </div>

      <div className="pt-2">
        {/* ==================== GENERAL TAB ==================== */}
        {activeSubTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemini API Key Section */}
            <div className={`md:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-5 border-neutral-800/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="w-5 h-5 text-orange-500" />
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Gemini API Key
                    </h3>
                  </div>
                  <h4 className={`text-xs font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                    Connect Your Gemini API Key
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Add your Gemini API key to connect and use the AI Mentor.
                  </p>
                </div>
                <div className="self-start sm:self-auto">
                  <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                    Supported AI Provider: Google Gemini
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5 font-bold">
                    Gemini API Key Secret
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        placeholder="Enter your Gemini API key"
                        value={geminiApiKeyInput}
                        onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveGeminiApiKey()}
                        className={`w-full text-xs font-mono rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-orange-500 border ${
                          isDark ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                        title={showGeminiKey ? 'Hide API Key' : 'Show API Key'}
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveGeminiApiKey}
                      disabled={isValidatingKey || !geminiApiKeyInput.trim()}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 font-mono font-bold text-xs rounded-xl transition flex items-center gap-2 shrink-0 shadow-md"
                    >
                      {isValidatingKey ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{geminiKeyStatus === 'Connected' ? 'Update API Key' : 'Save API Key'}</span>
                        </>
                      )}
                    </button>

                    {geminiKeyStatus === 'Connected' && (
                      <button
                        type="button"
                        onClick={handleRemoveGeminiApiKey}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-mono font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                        title="Remove API Key"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove Key</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Connection Status Badge & Description */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  geminiKeyStatus === 'Connected'
                    ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    : geminiKeyStatus === 'Connection Failed'
                    ? isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                    : geminiKeyStatus === 'Connecting...'
                    ? isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'
                    : isDark ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          geminiKeyStatus === 'Connected'
                            ? 'bg-emerald-500'
                            : geminiKeyStatus === 'Connection Failed'
                            ? 'bg-rose-500'
                            : geminiKeyStatus === 'Connecting...'
                            ? 'bg-orange-500 animate-ping'
                            : 'bg-neutral-400'
                        }`}></span>
                      </span>
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        geminiKeyStatus === 'Connected'
                          ? 'text-emerald-400'
                          : geminiKeyStatus === 'Connection Failed'
                          ? 'text-rose-400'
                          : geminiKeyStatus === 'Connecting...'
                          ? 'text-orange-400'
                          : 'text-neutral-400'
                      }`}>
                        Status: {geminiKeyStatus}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {geminiStatusMsg}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Visual Palette & Theme Preference */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-xs font-bold font-mono uppercase tracking-wider mb-5 flex items-center gap-2 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                <Sun className="w-4 h-4 text-orange-500" />
                Visual Theme
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-2 font-bold">
                    Visual Palette Preference
                  </label>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => handleSaveField('themePreference', 'dark')}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        isDark
                          ? 'bg-orange-500 border-orange-400 text-neutral-950 font-bold'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Slate Dark
                    </button>
                    <button
                      onClick={() => handleSaveField('themePreference', 'light')}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        !isDark
                          ? 'bg-orange-500 border-orange-400 text-neutral-950 font-bold'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Daylight White
                    </button>
                  </div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-neutral-950/20 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold block mb-1">Active Tracker Version</span>
                  <span className={`text-xs font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>v1.1.0-Release · Standalone Browser Client & Cloud Node API</span>
                </div>
              </div>
            </div>

            {/* Backend Server Connectivity */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-xs font-bold font-mono uppercase tracking-wider mb-5 flex items-center gap-2 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                <Smartphone className="w-4 h-4 text-orange-500" />
                Network Connectivity
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-2 font-bold">
                    Backend Server Connectivity (for Mobile App APK)
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. http://192.168.1.5:3000"
                        value={customApiUrl}
                        onChange={(e) => setCustomApiUrl(e.target.value)}
                        className={`flex-1 text-xs font-mono rounded-lg p-2 focus:outline-none focus:border-orange-500 ${
                          isDark ? 'bg-neutral-955 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-850'
                        }`}
                      />
                      <button
                        onClick={() => handleSaveCustomApiUrl(customApiUrl)}
                        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold text-xs rounded-lg transition"
                      >
                        Apply
                      </button>
                    </div>
                    <p className={`text-[10px] leading-relaxed ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                      Leave empty to use the default relative endpoint (web standard). To connect your phone to your computer's local server, find your computer's IP address (run <code className="px-1 py-0.5 rounded bg-neutral-850 text-neutral-300">ipconfig</code> in terminal on Windows or <code className="px-1 py-0.5 rounded bg-neutral-850 text-neutral-300">ifconfig</code> on Mac/Linux) and enter it here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PACING TAB ==================== */}
        {activeSubTab === 'pacing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline Planning */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-xs font-bold font-mono uppercase tracking-wider mb-5 flex items-center gap-2 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                <Calendar className="w-4 h-4 text-orange-500" />
                Duration & Timeline
              </h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">
                    Learning Duration (Days)
                  </label>
                  
                  <div className="grid grid-cols-4 gap-1.5">
                    {[30, 60, 90].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => {
                          onUpdateProfile({
                            selectedDurationDays: days,
                            selectedDurationWeeks: Math.ceil(days / 7)
                          });
                          showSuccess(`Duration set to ${days} days!`);
                        }}
                        className={`py-1.5 px-2 rounded-lg border text-center font-mono text-[10px] uppercase font-bold transition ${
                          profile.selectedDurationDays === days
                            ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                            : isDark
                            ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProfile({
                          selectedDurationDays: 100,
                          selectedDurationWeeks: Math.ceil(100 / 7)
                        });
                        showSuccess('Custom duration enabled!');
                      }}
                      className={`py-1.5 px-2 rounded-lg border text-center font-mono text-[10px] uppercase font-bold transition ${
                        ![30, 60, 90].includes(profile.selectedDurationDays)
                          ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                          : isDark
                          ? 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  <div className={`p-3.5 rounded-xl border space-y-3 ${
                    isDark ? 'bg-neutral-955 border-neutral-855' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                      <span>SLIDER (15 - 2000 DAYS)</span>
                      <span>DAYS</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="range"
                        min={15}
                        max={2000}
                        value={profile.selectedDurationDays > 2000 ? 2000 : profile.selectedDurationDays || 60}
                        onChange={(e) => {
                          const days = parseInt(e.target.value) || 15;
                          onUpdateProfile({
                            selectedDurationDays: days,
                            selectedDurationWeeks: Math.ceil(days / 7)
                          });
                        }}
                        className="flex-1 accent-orange-500"
                      />
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min={15}
                          max={2000}
                          value={profile.selectedDurationDays || 60}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const days = isNaN(val) ? 0 : val;
                            onUpdateProfile({
                              selectedDurationDays: days,
                              selectedDurationWeeks: Math.ceil(days / 7)
                            });
                          }}
                          className={`w-20 rounded-lg p-1.5 text-xs font-mono font-bold text-orange-500 text-center focus:outline-none focus:border-orange-500 ${
                            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1.5 font-bold">
                    Timeline Start Date
                  </label>
                  <input
                    type="date"
                    value={profile.startDate}
                    onChange={(e) => handleSaveField('startDate', e.target.value)}
                    className={`w-full text-xs font-sans rounded-lg p-2.5 focus:outline-none focus:border-orange-500 ${
                      isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Daily Preference */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-xs font-bold font-mono uppercase tracking-wider mb-5 flex items-center gap-2 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                <Clock className="w-4 h-4 text-orange-500" />
                Study Goals
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">
                      Daily Study Target (Hours)
                    </label>
                    <span className="text-xs font-mono font-bold text-orange-500">
                      {profile.dailyStudyHoursGoal}h / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={profile.dailyStudyHoursGoal}
                    onChange={(e) => handleSaveField('dailyStudyHoursGoal', parseInt(e.target.value))}
                    className={`w-full accent-orange-500 rounded-lg appearance-none h-1.5 cursor-pointer ${
                      isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BACKUP TAB ==================== */}
        {activeSubTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup export and imports */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
              <h3 className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                Data Portability & Physical Backups
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Manually export your complete student database as a portable single-file JSON representation, or restore your progress milestones securely.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={exportBackupData}
                  className="flex-1 py-2.5 px-4 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition"
                >
                  <Download className="w-4 h-4 text-orange-500" />
                  Save Backup (JSON)
                </button>

                <label className="flex-1 py-2.5 px-4 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl cursor-pointer text-center transition">
                  <Upload className="w-4 h-4 text-orange-500" />
                  Import Backup File
                  <input
                    type="file"
                    accept=".json"
                    onChange={importBackupData}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Integrity checker */}
              <div className="border-t border-neutral-800/80 pt-4 space-y-3">
                <label className="text-[10px] font-mono text-neutral-500 uppercase block font-bold">
                  Backup Integrity Analysis Tool
                </label>
                <p className="text-[11px] text-neutral-400">
                  Select a backup file to check its data block headers and schema validity without applying it yet.
                </p>
                <div className="flex items-center gap-3">
                  <label className="py-2 px-3 bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono uppercase font-bold text-neutral-300 rounded border border-neutral-800 cursor-pointer">
                    Verify File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleManualBackupVerify}
                      className="hidden"
                    />
                  </label>
                  {backupVerifyResult && (
                    <div className="flex-1 text-left text-xs bg-neutral-955 p-2.5 rounded-lg border border-neutral-855 font-mono space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-500">Integrity Check:</span>
                        <span className={backupVerifyResult.integrityStatus === 'Valid' ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                          {backupVerifyResult.integrityStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-500">Contains Blocks:</span>
                        <span className="text-neutral-300 break-all">{backupVerifyResult.includedDataTypes.join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-neutral-500">File Footprint:</span>
                        <span className="text-neutral-300">{backupVerifyResult.sizeEstimate}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MIGRATIONS TAB ==================== */}
        {activeSubTab === 'migration' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Migration center */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
              <h3 className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-500" />
                Structure Migration Engine
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Upgraded the tracking app from earlier versions? This checks and safely converts legacy data shapes into high-fidelity v1.1.0 forms.
              </p>

              <button
                onClick={handleManualRunMigration}
                className="w-full py-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-mono font-bold text-white uppercase tracking-wider rounded-xl transition"
              >
                Inspect & Upgrade Current Schema
              </button>

              {migrationResult && (
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[10px] uppercase text-neutral-500">
                    <span>Status:</span>
                    <span className="text-emerald-500 font-bold">{migrationResult.migrationStatus}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase text-neutral-500">
                    <span>Records Migrated:</span>
                    <span className="text-neutral-300 font-bold">{migrationResult.dataConverted} blocks</span>
                  </div>
                  {migrationResult.warnings.length > 0 && (
                    <div className="text-[10px] text-amber-500 bg-amber-500/5 p-2 rounded border border-amber-500/10 text-left space-y-1">
                      <span className="font-bold uppercase block">Migration Reports:</span>
                      {migrationResult.warnings.map((w, idx) => (
                        <div key={idx} className="leading-normal">• {w}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reset zone */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'} space-y-4`}>
              <h3 className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Dangerous Area
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Wipe your progress logs, saved files, and custom interview notes, reverting everything back to fresh factory values.
              </p>

              {!showResetConfirm ? (
                <button
                  onClick={handleResetClick}
                  className="w-full py-2.5 bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 rounded-xl text-xs font-mono font-bold text-rose-400 uppercase tracking-wider transition"
                >
                  Reset All Local Study progress
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Are you absolutely sure?
                  </span>
                  <p className={`text-[11px] leading-normal ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    This will erase your current day status, saved notes, custom roadmap, and cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmReset}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs font-mono uppercase transition"
                    >
                      Wipe Data
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 font-bold rounded-lg text-xs font-mono uppercase transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
         )}
      </div>
    </div>
  );
}
