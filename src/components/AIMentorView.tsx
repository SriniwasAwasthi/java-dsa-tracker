import React, { useState, useEffect, useRef } from 'react';

import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Code,
  Compass,
  ArrowRight,
  RefreshCw,
  Scale,
  Trash2,
  Key
} from 'lucide-react';
import { Topic, Problem } from '../types';
import { getApiUrl, getAiHeaders, getStoredGeminiApiKey } from '../lib/api';

interface AIMentorViewProps {
  theme: 'dark' | 'light';
  topics: Topic[];
  problems: Problem[];
  onNavigateToSettings?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// -------------------------------------------------------------------------
// CUSTOM ROBUST MARKDOWN & MATH RENDERING ENGINE (STRIps STRAY SYNTAX SYMBOLS)
// -------------------------------------------------------------------------
function parseMarkdownToReact(text: string, isDark: boolean, isUser: boolean = false): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = 'java';
  
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  // List grouping state to solve vertical gap issues and clean container syntax
  let activeListType: 'ul' | 'ol' | null = null;
  let activeListItems: React.ReactNode[] = [];
  let activeListKey: string = '';

  const textColor = isUser ? 'text-black font-bold' : isDark ? 'text-neutral-300' : 'text-neutral-700';

  const flushList = () => {
    if (!activeListType || activeListItems.length === 0) return;
    const key = activeListKey;
    if (activeListType === 'ul') {
      elements.push(
        <ul key={key} className={`list-disc pl-5 my-2.5 text-xs leading-relaxed space-y-1.5 ${textColor}`}>
          {activeListItems}
        </ul>
      );
    } else {
      elements.push(
        <ol key={key} className={`list-decimal pl-5 my-2.5 text-xs leading-relaxed space-y-1.5 ${textColor}`}>
          {activeListItems}
        </ol>
      );
    }
    activeListType = null;
    activeListItems = [];
  };
  
  const flushTable = (key: string | number) => {
    if (tableRows.length === 0 && tableHeader.length === 0) return null;
    const node = (
      <div key={key} className={`overflow-x-auto my-4 rounded-xl border ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <table className={`min-w-full divide-y text-left text-xs ${isDark ? 'divide-neutral-800' : 'divide-neutral-200'}`}>
          {tableHeader.length > 0 && (
            <thead className={`font-bold uppercase tracking-wider font-mono ${isDark ? 'bg-neutral-900 text-neutral-250' : 'bg-neutral-100 text-neutral-800'}`}>
              <tr>
                {tableHeader.map((cell, idx) => (
                  <th key={idx} className={`px-4 py-3 border-b ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={`divide-y ${isDark ? 'divide-neutral-800 bg-neutral-950/40 text-neutral-300' : 'divide-neutral-200 bg-white text-neutral-800'}`}>
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className={`transition-colors ${isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-neutral-50'}`}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2.5">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeader = [];
    tableRows = [];
    inTable = false;
    return node;
  };

  const renderInline = (inlineText: string): React.ReactNode => {
    let t = inlineText;

    // Replace LaTeX symbols with beautiful, highly readable clean math representations
    t = t.replace(/\\times/g, ' × ')
         .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, ' ($1) / ($2) ')
         .replace(/\\le/g, ' ≤ ')
         .replace(/\\ge/g, ' ≥ ')
         .replace(/\\cdot/g, ' · ')
         .replace(/\\dots/g, ' ... ')
         .replace(/\\approx/g, ' ≈ ')
         .replace(/\\theta/g, ' θ ')
         .replace(/\\in/g, ' ∈ ')
         .replace(/\^2/g, '²')
         .replace(/\^n/g, 'ⁿ')
         .replace(/\\le\s/g, ' ≤ ')
         .replace(/\\ge\s/g, ' ≥ ');

    // Match code backticks, bold, italic, and inline math dollar signs.
    const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g;
    const tokens = t.split(tokenRegex);

    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={i} className={`font-bold ${isUser ? 'text-black' : isDark ? 'text-white' : 'text-neutral-900'}`}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={i} className={`italic ${isUser ? 'text-black font-bold' : isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{token.slice(1, -1)}</em>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={i} className={`border text-orange-500 px-1.5 py-0.5 rounded font-mono text-[11px] select-all ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-200'}`}>
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('$') && token.endsWith('$')) {
        return (
          <span key={i} className={`font-mono text-xs font-bold italic px-0.5 ${isUser ? 'text-black' : isDark ? 'text-orange-300' : 'text-orange-650'}`}>
            {token.slice(1, -1)}
          </span>
        );
      }
      // Clean up stray double/single asterisks, hash marks, or dollar symbols in regular text elements
      let cleaned = token;
      cleaned = cleaned.replace(/\*\*/g, '')
                       .replace(/\*/g, '')
                       .replace(/`/g, '')
                       .replace(/\$/g, '')
                       .replace(/#/g, '')
                       .replace(/\\/g, '');
      return cleaned;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block handling
    if (trimmed.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        // End of code block
        const codeContent = codeLines.join('\n');
        const key = `code_${i}`;
        elements.push(
          <div key={key} className={`my-4 rounded-xl border overflow-hidden font-mono ${isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-neutral-50'}`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b text-[10px] ${isDark ? 'bg-neutral-900 border-neutral-800 text-neutral-450' : 'bg-neutral-100 border-neutral-200 text-neutral-500'}`}>
              <span className="uppercase text-orange-500 font-bold tracking-wider">{codeLang || 'java'}</span>
              <button
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-white transition flex items-center gap-1 active:text-green-500 text-[10px]"
              >
                Copy Code
              </button>
            </div>
            <pre className={`p-4 overflow-x-auto text-xs leading-relaxed select-all ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
              <code>{codeContent}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        codeLang = trimmed.slice(3).trim() || 'java';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // 2. Table handling
    if (trimmed.startsWith('|')) {
      flushList();
      if (!inTable) {
        inTable = true;
        const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        tableHeader = cells;
      } else {
        if (trimmed.includes('---')) {
          continue; 
        }
        const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) {
        const tableNode = flushTable(`table_${i}`);
        if (tableNode) elements.push(tableNode);
      }
    }

    // 3. Headers
    if (trimmed.startsWith('#')) {
      flushList();
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const textContent = match[2];
        const key = `h_${i}`;
        if (level === 1) {
          elements.push(<h1 key={key} className={`text-xl font-bold pb-2 mt-6 mb-3 font-sans border-b ${isUser ? 'text-black' : isDark ? 'text-white border-neutral-800' : 'text-neutral-900 border-neutral-200'}`}>{renderInline(textContent)}</h1>);
        } else if (level === 2) {
          elements.push(<h2 key={key} className={`text-lg font-bold mt-5 mb-2.5 font-sans border-l-4 border-orange-500 pl-2 ${isUser ? 'text-black' : isDark ? 'text-white' : 'text-neutral-900'}`}>{renderInline(textContent)}</h2>);
        } else if (level === 3) {
          elements.push(<h3 key={key} className={`text-sm font-bold mt-4 mb-2 font-mono uppercase tracking-wider ${isUser ? 'text-black' : isDark ? 'text-orange-400' : 'text-orange-650'}`}>{renderInline(textContent)}</h3>);
        } else {
          elements.push(<h4 key={key} className={`text-xs font-bold mt-3 mb-1.5 font-mono ${isUser ? 'text-black' : isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>{renderInline(textContent)}</h4>);
        }
        continue;
      }
    }

    // 4. Blockquotes
    if (trimmed.startsWith('>')) {
      flushList();
      const content = trimmed.slice(1).trim();
      const key = `quote_${i}`;
      elements.push(
        <blockquote key={key} className={`border-l-4 border-orange-500 px-4 py-3 my-3 text-xs italic rounded-r-xl ${isUser ? 'bg-orange-600/20 text-black font-bold' : isDark ? 'bg-neutral-900/40 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
          {renderInline(content)}
        </blockquote>
      );
      continue;
    }

    // 5. Lists (Unordered)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (activeListType !== 'ul') {
        flushList();
        activeListType = 'ul';
        activeListKey = `list_ul_${i}`;
      }
      const content = trimmed.slice(2).trim();
      activeListItems.push(
        <li key={`li_${i}`} className="list-disc pl-1 ml-4">{renderInline(content)}</li>
      );
      continue;
    }

    // 6. Lists (Ordered / Numbered)
    if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        if (activeListType !== 'ol') {
          flushList();
          activeListType = 'ol';
          activeListKey = `list_ol_${i}`;
        }
        const num = match[1];
        const content = match[2];
        activeListItems.push(
          <li key={`li_${i}`} value={parseInt(num)} className="list-decimal pl-1 ml-4">{renderInline(content)}</li>
        );
        continue;
      }
    }

    // If we hit any other kind of line, flush any active list first!
    flushList();

    // Empty space
    if (trimmed === '') {
      continue;
    }

    // LaTeX math block display $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
      const mathContent = trimmed.slice(2, -2).trim();
      const key = `math_${i}`;
      elements.push(
        <div key={key} className={`my-4 py-4 px-6 border text-center rounded-2xl ${isDark ? 'bg-orange-500/10 border-orange-500/30 shadow-inner' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
          <div className={`font-mono text-sm md:text-md italic ${isUser ? 'text-black font-bold' : isDark ? 'text-orange-400' : 'text-orange-750'}`}>
            {renderInline(mathContent)}
          </div>
        </div>
      );
      continue;
    }

    // Plain Paragraph
    const key = `p_${i}`;
    elements.push(
      <p key={key} className={`mb-2.5 last:mb-0 text-xs leading-relaxed ${textColor}`}>
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  if (inTable) {
    const tableNode = flushTable(`table_end`);
    if (tableNode) elements.push(tableNode);
  }

  return <div className="space-y-1">{elements}</div>;
}

// -------------------------------------------------------------------------
// REUSABLE SUB-TAB SPECIFIC CHATBOT SECTION
// -------------------------------------------------------------------------
interface FollowUpChatSectionProps {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isDark: boolean;
  placeholder: string;
  title: string;
  onClearHistory?: () => void;
}

function FollowUpChatSection({
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  bottomRef,
  isDark,
  placeholder,
  title,
  onClearHistory
}: FollowUpChatSectionProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    if (onClearHistory) {
      onClearHistory();
    }
    setConfirmClear(false);
  };

  return (
    <div className={`border rounded-2xl overflow-hidden mt-6 flex flex-col ${
      isDark ? 'bg-neutral-900/30 border-neutral-800' : 'bg-neutral-50/50 border-neutral-200'
    }`}>
      {/* Mini Chat Header */}
      <div className={`px-5 py-3 border-b flex items-center justify-between ${
        isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-100'
      }`}>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-orange-500 animate-pulse" />
          <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${
            isDark ? 'text-white' : 'text-neutral-800'
          }`}>{title}</h4>
        </div>
        <div className="flex items-center gap-3">
          {onClearHistory && (
            <button
              onClick={handleClearClick}
              className={`px-2 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider rounded border transition flex items-center gap-1 ${
                confirmClear
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : isDark
                  ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30'
                  : 'bg-white border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-250'
              }`}
            >
              <Trash2 className="w-2.5 h-2.5" />
              {confirmClear ? 'Confirm Delete?' : 'Delete History'}
            </button>
          )}
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Independent Bot</span>
        </div>
      </div>

      {/* Messages Scroll Box */}
      <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-neutral-500 text-xs italic">
            Ask any questions, seek clarifications, or query specific code here!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-orange-500 text-black border-orange-600 font-bold shadow-md'
                    : isDark
                    ? 'bg-neutral-950 border-neutral-850 text-neutral-250'
                    : 'bg-white border-neutral-200 text-neutral-850'
                }`}
              >
                {parseMarkdownToReact(msg.text, isDark, msg.role === 'user')}
                <span className={`text-[9px] font-mono block text-right mt-1.5 ${msg.role === 'user' ? 'text-black font-bold opacity-80' : 'opacity-50'}`}>
                  {(() => {
                    try {
                      const d = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                      return !isNaN(d.getTime()) ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    } catch (e) {
                      return '';
                    }
                  })()}
                </span>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-900/60 border border-neutral-850 rounded-2xl p-3 flex items-center gap-2.5">
              <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
              <span className="text-[11px] font-mono text-neutral-400">Bot is typing...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <div className={`p-3 border-t flex items-center gap-2 ${isDark ? 'border-neutral-800 bg-neutral-950/40' : 'border-neutral-200 bg-neutral-50/50'}`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder={placeholder}
          className={`flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-850 text-white placeholder-neutral-500' : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'}`}
        />
        <button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 transition-all flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// MAIN SUITE COMPONENT
// -------------------------------------------------------------------------
export default function AIMentorView({ theme, topics, problems, onNavigateToSettings }: AIMentorViewProps) {
  const isDark = theme === 'dark';
  const hasApiKey = Boolean(getStoredGeminiApiKey());
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'compare' | 'notes' | 'problems'>('chat');

  // --- Clear Histories Confirmations ---
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmClearChat, setConfirmClearChat] = useState(false);

  // --- 1. Conversational Chat States ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('java_dsa_mentor_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        }
      }
    } catch (e) {
      console.error('Failed parsing chat history', e);
    }
    return [
      {
        id: 'welcome',
        role: 'model',
        text: `### Welcome to your Java & DSA AI Mentor! 👋

I'm here to act as your personalized tutor for mastering Data Structures, Algorithms, and Core Java concepts. 

**Here's how I can help you today:**
* 🔍 **Break down complex theory**: Ask me to explain concepts like *Recursion*, *Graph Traversals*, or *Red-Black Trees* in simple terms.
* ☕ **Review Java internals**: Learn how the JVM manages memory, or the difference between heap and stack space.
* 🚀 **Walkthrough problems**: Share a problem title or pattern, and I'll guide you step-by-step from brute-force to the most optimal approach.
* 💡 **Code Reviews**: Ask for optimized Java code templates.

What would you like to study first?`,
        timestamp: new Date()
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- 2. Concept Comparer States ---
  const [concept1, setConcept1] = useState('ArrayList');
  const [concept2, setConcept2] = useState('LinkedList');
  const [comparisonResult, setComparisonResult] = useState(() => {
    return localStorage.getItem('java_dsa_comparison_result') || '';
  });
  const [isCompareLoading, setIsCompareLoading] = useState(false);

  // --- 3. Note Template States ---
  const [selectedNoteTopic, setSelectedNoteTopic] = useState(topics[0]?.name || 'Java Basics');
  const [noteTemplateResult, setNoteTemplateResult] = useState(() => {
    return localStorage.getItem('java_dsa_note_template_result') || '';
  });
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  // --- 4. Problem Assistant States ---
  const [selectedProblemTitle, setSelectedProblemTitle] = useState(problems[0]?.title || 'Two Sum');
  const [problemGuideResult, setProblemGuideResult] = useState(() => {
    return localStorage.getItem('java_dsa_problem_guide_result') || '';
  });
  const [isProblemLoading, setIsProblemLoading] = useState(false);

  // --- Sub-tab specific persistent chatbots ---
  const [compareMessages, setCompareMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('java_dsa_compare_chat');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [
      {
        id: 'comp_welcome',
        role: 'model',
        text: `### Technical Comparison Assistant ⚖️
I am your dedicated Comparison Chatbot.

Ask me anything about Java collection trade-offs, space-time complexities, JVM memory profiles, or garbage collection impacts! 

Select two concepts on the left and click **Analyze Differences** to compile a comprehensive report, or type your technical questions here!`,
        timestamp: new Date()
      }
    ];
  });
  const [compareInput, setCompareInput] = useState('');
  const [isCompareChatLoading, setIsCompareChatLoading] = useState(false);
  const compareChatBottomRef = useRef<HTMLDivElement>(null);

  const [notesMessages, setNotesMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('java_dsa_notes_chat');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [
      {
        id: 'notes_welcome',
        role: 'model',
        text: `### Note Architect & Study Planner 📝
I am your study notes builder and custom syllabus planner.

Ask me to draft highly structured notes, real-world analogies, code skeletons, or quiz checklists for any Java/DSA topic (like basic strings, hashing, trees, etc.). I will output beautiful study sheets immediately in the easiest format possible!`,
        timestamp: new Date()
      }
    ];
  });
  const [notesInput, setNotesInput] = useState('');
  const [isNotesChatLoading, setIsNotesChatLoading] = useState(false);
  const notesChatBottomRef = useRef<HTMLDivElement>(null);

  const [problemsMessages, setProblemsMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('java_dsa_problems_chat');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [
      {
        id: 'prob_welcome',
        role: 'model',
        text: `### Practice Guide Code Assistant 🚀
I am your interactive hints and compilable code companion.

Stuck on a problem or need some practice templates? Ask me!
* 💻 **Runnable Code**: I can provide complete, compilable, clean, and fully runnable Java code templates for any requested topic or problem.
* ⏱️ **Complexity Analysis**: I will supply precise, mathematical Big-O bounds for both Time and Space complexity.
* 💡 **Edge Cases**: I'll help you dry-run boundary parameters so you're ready for any test suite.`,
        timestamp: new Date()
      }
    ];
  });
  const [problemsInput, setProblemsInput] = useState('');
  const [isProblemsChatLoading, setIsProblemsChatLoading] = useState(false);
  const problemsChatBottomRef = useRef<HTMLDivElement>(null);

  // --- Clipboard Helper ---
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // --- Persistent Storage Sync Effects ---
  useEffect(() => {
    localStorage.setItem('java_dsa_mentor_chat', JSON.stringify(chatMessages));
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('java_dsa_compare_chat', JSON.stringify(compareMessages));
    if (compareChatBottomRef.current) {
      compareChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [compareMessages]);

  useEffect(() => {
    localStorage.setItem('java_dsa_notes_chat', JSON.stringify(notesMessages));
    if (notesChatBottomRef.current) {
      notesChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [notesMessages]);

  useEffect(() => {
    localStorage.setItem('java_dsa_problems_chat', JSON.stringify(problemsMessages));
    if (problemsChatBottomRef.current) {
      problemsChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [problemsMessages]);

  useEffect(() => {
    localStorage.setItem('java_dsa_comparison_result', comparisonResult);
  }, [comparisonResult]);

  useEffect(() => {
    localStorage.setItem('java_dsa_note_template_result', noteTemplateResult);
  }, [noteTemplateResult]);

  useEffect(() => {
    localStorage.setItem('java_dsa_problem_guide_result', problemGuideResult);
  }, [problemGuideResult]);

  // --- Clear Histories Handlers ---
  const handleClearAllHistories = () => {
    const freshChat: ChatMessage[] = [
      {
        id: 'welcome',
        role: 'model',
        text: `### Welcome to your Java & DSA AI Mentor! 👋

I'm here to act as your personalized tutor for mastering Data Structures, Algorithms, and Core Java concepts. 

**Here's how I can help you today:**
* 🔍 **Break down complex theory**: Ask me to explain concepts like *Recursion*, *Graph Traversals*, or *Red-Black Trees* in simple terms.
* ☕ **Review Java internals**: Learn how the JVM manages memory, or the difference between heap and stack space.
* 🚀 **Walkthrough problems**: Share a problem title or pattern, and I'll guide you step-by-step from brute-force to the most optimal approach.
* 💡 **Code Reviews**: Ask for optimized Java code templates.

What would you like to study first?`,
        timestamp: new Date()
      }
    ];

    const freshCompare: ChatMessage[] = [
      {
        id: 'comp_welcome',
        role: 'model',
        text: `### Technical Comparison Assistant ⚖️
I am your dedicated Comparison Chatbot.

Ask me anything about Java collection trade-offs, space-time complexities, JVM memory profiles, or garbage collection impacts! 

Select two concepts on the left and click **Analyze Differences** to compile a comprehensive report, or type your technical questions here!`,
        timestamp: new Date()
      }
    ];

    const freshNotes: ChatMessage[] = [
      {
        id: 'notes_welcome',
        role: 'model',
        text: `### Note Architect & Study Planner 📝
I am your study notes builder and custom syllabus planner.

Ask me to draft highly structured notes, real-world analogies, code skeletons, or quiz checklists for any Java/DSA topic (like basic strings, hashing, trees, etc.). I will output beautiful study sheets immediately in the easiest format possible!`,
        timestamp: new Date()
      }
    ];

    const freshProblems: ChatMessage[] = [
      {
        id: 'prob_welcome',
        role: 'model',
        text: `### Practice Guide Code Assistant 🚀
I am your interactive hints and compilable code companion.

Stuck on a problem or need some practice templates? Ask me!
* 💻 **Runnable Code**: I can provide complete, compilable, clean, and fully runnable Java code templates for any requested topic or problem.
* ⏱️ **Complexity Analysis**: I will supply precise, mathematical Big-O bounds for both Time and Space complexity.
* 💡 **Edge Cases**: I'll help you dry-run boundary parameters so you're ready for any test suite.`,
        timestamp: new Date()
      }
    ];

    setChatMessages(freshChat);
    setCompareMessages(freshCompare);
    setNotesMessages(freshNotes);
    setProblemsMessages(freshProblems);

    setComparisonResult('');
    setNoteTemplateResult('');
    setProblemGuideResult('');

    localStorage.removeItem('java_dsa_mentor_chat');
    localStorage.removeItem('java_dsa_compare_chat');
    localStorage.removeItem('java_dsa_notes_chat');
    localStorage.removeItem('java_dsa_problems_chat');
    localStorage.removeItem('java_dsa_comparison_result');
    localStorage.removeItem('java_dsa_note_template_result');
    localStorage.removeItem('java_dsa_problem_guide_result');
  };

  const handleClearChatHistory = () => {
    setChatMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `### Welcome to your Java & DSA AI Mentor! 👋

I'm here to act as your personalized tutor for mastering Data Structures, Algorithms, and Core Java concepts. 

**Here's how I can help you today:**
* 🔍 **Break down complex theory**: Ask me to explain concepts like *Recursion*, *Graph Traversals*, or *Red-Black Trees* in simple terms.
* ☕ **Review Java internals**: Learn how the JVM manages memory, or the difference between heap and stack space.
* 🚀 **Walkthrough problems**: Share a problem title or pattern, and I'll guide you step-by-step from brute-force to the most optimal approach.
* 💡 **Code Reviews**: Ask for optimized Java code templates.

What would you like to study first?`,
        timestamp: new Date()
      }
    ]);
    localStorage.removeItem('java_dsa_mentor_chat');
  };

  const handleClearCompareHistory = () => {
    setCompareMessages([
      {
        id: 'comp_welcome',
        role: 'model',
        text: `### Technical Comparison Assistant ⚖️
I am your dedicated Comparison Chatbot.

Ask me anything about Java collection trade-offs, space-time complexities, JVM memory profiles, or garbage collection impacts! 

Select two concepts on the left and click **Analyze Differences** to compile a comprehensive report, or type your technical questions here!`,
        timestamp: new Date()
      }
    ]);
    setComparisonResult('');
    localStorage.removeItem('java_dsa_compare_chat');
    localStorage.removeItem('java_dsa_comparison_result');
  };

  const handleClearNotesHistory = () => {
    setNotesMessages([
      {
        id: 'notes_welcome',
        role: 'model',
        text: `### Note Architect & Study Planner 📝
I am your study notes builder and custom syllabus planner.

Ask me to draft highly structured notes, real-world analogies, code skeletons, or quiz checklists for any Java/DSA topic (like basic strings, hashing, trees, etc.). I will output beautiful study sheets immediately in the easiest format possible!`,
        timestamp: new Date()
      }
    ]);
    setNoteTemplateResult('');
    localStorage.removeItem('java_dsa_notes_chat');
    localStorage.removeItem('java_dsa_note_template_result');
  };

  const handleClearProblemsHistory = () => {
    setProblemsMessages([
      {
        id: 'prob_welcome',
        role: 'model',
        text: `### Practice Guide Code Assistant 🚀
I am your interactive hints and compilable code companion.

Stuck on a problem or need some practice templates? Ask me!
* 💻 **Runnable Code**: I can provide complete, compilable, clean, and fully runnable Java code templates for any requested topic or problem.
* ⏱️ **Complexity Analysis**: I will supply precise, mathematical Big-O bounds for both Time and Space complexity.
* 💡 **Edge Cases**: I'll help you dry-run boundary parameters so you're ready for any test suite. \n`,
        timestamp: new Date()
      }
    ]);
    setProblemGuideResult('');
    localStorage.removeItem('java_dsa_problems_chat');
    localStorage.removeItem('java_dsa_problem_guide_result');
  };

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- Conversational Chat API ---
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsgText = chatInput.trim();
    const newUserMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      role: 'user',
      text: userMsgText,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          message: userMsgText,
          history: chatMessages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
          context: {
            topicsCount: topics.length,
            completedCount: topics.filter((t) => t.completionStatus === 'Completed').length,
            problemsCount: problems.length,
            solvedCount: problems.filter((p) => p.status === 'Solved').length
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            role: 'model',
            text: data.text,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'model',
          text: `⚠️ **Error communicating with the mentor server**: ${err.message}. Please check your connection or try again.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Concept Comparer API ---
  const handleCompareConcepts = async () => {
    if (isCompareLoading) return;
    setIsCompareLoading(true);
    setComparisonResult('');

    try {
      const response = await fetch(getApiUrl('/api/ai/compare'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({ concept1, concept2 })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setComparisonResult(data.text);
      } else {
        throw new Error(data.error || 'Failed to generate comparison.');
      }
    } catch (err: any) {
      setComparisonResult(`⚠️ **Failed to complete comparison**: ${err.message}`);
    } finally {
      setIsCompareLoading(false);
    }
  };

  const handleSendCompareChat = async () => {
    if (!compareInput.trim() || isCompareChatLoading) return;
    const text = compareInput.trim();
    const newUserMsg: ChatMessage = {
      id: `comp_user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date()
    };
    setCompareMessages(prev => [...prev, newUserMsg]);
    setCompareInput('');
    setIsCompareChatLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          message: text,
          history: compareMessages.slice(-10).map(m => ({ role: m.role, text: m.text })),
          context: {
            topicsCount: topics.length,
            problemsCount: problems.length,
            tabContext: `Concept Comparer Assistant. The user wants help with technical concepts: '${concept1}' and '${concept2}'. Current Report: ${comparisonResult.slice(0, 1500)}`,
            persona: `You are the Expert Concept Comparison Chatbot. Answer queries regarding technical trade-offs, space-time complexity, CPU cache friendliness, garbage collection pressure, and Java implementation details of '${concept1}' vs '${concept2}'. Be prepared to give code examples, analyze memory profiles, or discuss other related Java collections / DSA topics.`
          }
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setCompareMessages(prev => [...prev, {
          id: `comp_reply_${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setCompareMessages(prev => [...prev, {
        id: `comp_err_${Date.now()}`,
        role: 'model',
        text: `⚠️ **Error communicating with the compare chatbot**: ${err.message}. Please try again.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsCompareChatLoading(false);
    }
  };

  // --- Smart Notes API ---
  const handleGenerateNoteTemplate = async () => {
    if (isNotesLoading) return;
    setIsNotesLoading(true);
    setNoteTemplateResult('');

    try {
      const response = await fetch(getApiUrl('/api/ai/notes'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({ topicName: selectedNoteTopic })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setNoteTemplateResult(data.text);
      } else {
        throw new Error(data.error || 'Failed to generate notes.');
      }
    } catch (err: any) {
      setNoteTemplateResult(`⚠️ **Failed to build study notes**: ${err.message}`);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleSendNotesChat = async () => {
    if (!notesInput.trim() || isNotesChatLoading) return;
    const text = notesInput.trim();
    const newUserMsg: ChatMessage = {
      id: `notes_user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date()
    };
    setNotesMessages(prev => [...prev, newUserMsg]);
    setNotesInput('');
    setIsNotesChatLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          message: text,
          history: notesMessages.slice(-10).map(m => ({ role: m.role, text: m.text })),
          context: {
            topicsCount: topics.length,
            problemsCount: problems.length,
            tabContext: `Smart Notes Generator Assistant. Selected Topic: '${selectedNoteTopic}'. Current template notes: ${noteTemplateResult.slice(0, 1500)}`,
            persona: `You are the Note Architect & Study Planner Chatbot. The user wants to study or customize note templates for '${selectedNoteTopic}' or any other requested Java/DSA topic (like basic strings, hashing, trees, etc.). Answer questions about definitions, analogies, standard skeleton code, complexity bounds, or common mistakes. If they ask for notes or smart nodes of specific topics, generate complete, beautiful, highly structured notes instantly in the easiest format possible!`
          }
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setNotesMessages(prev => [...prev, {
          id: `notes_reply_${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setNotesMessages(prev => [...prev, {
        id: `notes_err_${Date.now()}`,
        role: 'model',
        text: `⚠️ **Error communicating with the note chatbot**: ${err.message}. Please try again.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsNotesChatLoading(false);
    }
  };

  // --- Problems Guide API ---
  const handleGenerateProblemGuide = async () => {
    if (isProblemLoading) return;
    setIsProblemLoading(true);
    setProblemGuideResult('');

    const matchingProb = problems.find((p) => p.title === selectedProblemTitle);

    try {
      const response = await fetch(getApiUrl('/api/ai/problem-guide'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          problemTitle: selectedProblemTitle,
          topicName: matchingProb ? matchingProb.topicName : 'Dynamic Programming',
          difficulty: matchingProb ? matchingProb.difficulty : 'Medium'
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setProblemGuideResult(data.text);
      } else {
        throw new Error(data.error || 'Failed to generate practice guide.');
      }
    } catch (err: any) {
      setProblemGuideResult(`⚠️ **Failed to generate hints**: ${err.message}`);
    } finally {
      setIsProblemLoading(false);
    }
  };

  const handleSendProblemsChat = async () => {
    if (!problemsInput.trim() || isProblemsChatLoading) return;
    const text = problemsInput.trim();
    const newUserMsg: ChatMessage = {
      id: `prob_user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date()
    };
    setProblemsMessages(prev => [...prev, newUserMsg]);
    setProblemsInput('');
    setIsProblemsChatLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: getAiHeaders(),
        body: JSON.stringify({
          message: text,
          history: problemsMessages.slice(-10).map(m => ({ role: m.role, text: m.text })),
          context: {
            topicsCount: topics.length,
            problemsCount: problems.length,
            tabContext: `Strategic Practice Guide. The user is practicing on problem: '${selectedProblemTitle}'. Current Clues: ${problemGuideResult.slice(0, 1500)}`,
            persona: `You are the Practice Guide Code Assistant Chatbot. The user wants step-by-step instructions, hints, complexity metrics, or fully runnable code for any Java DSA problem! IMPORTANT: If the user asks for runnable code templates or full programs (like addition, sum of natural numbers, multiplication, largest number, hash maps, linked lists, stacks, binary trees, etc.), you MUST provide fully complete, compilable, and runnable Java code with detailed comments, and explicitly state its Time and Space complexity. Be clear, precise, and highly detailed.`
          }
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setProblemsMessages(prev => [...prev, {
          id: `prob_reply_${Date.now()}`,
          role: 'model',
          text: data.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setProblemsMessages(prev => [...prev, {
        id: `prob_err_${Date.now()}`,
        role: 'model',
        text: `⚠️ **Error communicating with the practice chatbot**: ${err.message}. Please try again.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsProblemsChatLoading(false);
    }
  };

  const commonComparisons = [
    ['ArrayList', 'LinkedList'],
    ['Stack', 'Queue'],
    ['BFS', 'DFS'],
    ['HashMap', 'TreeMap'],
    ['Recursion', 'Iteration'],
    ['Greedy', 'Dynamic Programming']
  ];

  return (
    <div className="space-y-6">
        {/* Header Block */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
          isDark ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Brain className="w-5 h-5 text-orange-500 animate-pulse" />
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest font-bold">
                AI CS Mentoring Suite
              </span>
            </div>
            <h2 className={`text-2xl font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Java DSA Mentor Workspace
            </h2>
            <p className={`text-sm max-w-2xl mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Deepen your mastery of algorithms, structures, and JVM profiles using tailored assistants for conversational help, concept comparison, study notes, and code hints.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => {
                if (!confirmClearAll) {
                  setConfirmClearAll(true);
                  setTimeout(() => setConfirmClearAll(false), 4000);
                  return;
                }
                handleClearAllHistories();
                setConfirmClearAll(false);
              }}
              className={`px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition border flex items-center gap-2 ${
                confirmClearAll
                  ? 'bg-red-500 text-white border-red-500'
                  : isDark
                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {confirmClearAll ? 'Confirm Clear All?' : 'Clear All AI History'}
            </button>
          </div>
        </div>

        {/* Gemini API Key Notice Banner if not configured */}
        {!hasApiKey && (
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
            isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500 text-neutral-950 shrink-0 font-bold">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Gemini API Key Required
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Please connect your Gemini API key from Settings to use the AI Mentor.
                </p>
              </div>
            </div>
            {onNavigateToSettings && (
              <button
                onClick={onNavigateToSettings}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-mono font-bold text-xs rounded-xl transition shrink-0 flex items-center gap-2 shadow-md"
              >
                <Key className="w-3.5 h-3.5" />
                Go to Settings
              </button>
            )}
          </div>
        )}

        {/* Navigation Subtabs */}
        <div className={`flex flex-wrap gap-2 border-b pb-px ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
          {[
            { id: 'chat', label: 'Conversational Mentor', icon: Brain },
            { id: 'compare', label: 'Concept Comparer', icon: Scale },
            { id: 'notes', label: 'Smart Notes Generator', icon: BookOpen },
            { id: 'problems', label: 'Practice Guide & Hints', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider font-mono border-b-2 transition-all ${
                  isSelected
                    ? isDark
                      ? 'border-orange-500 text-white bg-neutral-800/20'
                      : 'border-orange-500 text-neutral-950 bg-neutral-100'
                    : isDark
                    ? 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/10'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="grid grid-cols-1 gap-6">
            {/* 1. CHAT PANEL */}
            {activeSubTab === 'chat' && (
              <div
                className={`border rounded-2xl overflow-hidden flex flex-col h-[650px] transition-all duration-200 ease-out ${
                  isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'
                }`}
              >
                {/* Chat Card Header */}
                <div className={`px-5 py-3 border-b flex items-center justify-between ${
                  isDark ? 'border-neutral-800 bg-neutral-900/40' : 'border-neutral-200 bg-neutral-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                      Conversational Mentor
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!confirmClearChat) {
                        setConfirmClearChat(true);
                        setTimeout(() => setConfirmClearChat(false), 4000);
                        return;
                      }
                      handleClearChatHistory();
                      setConfirmClearChat(false);
                    }}
                    className={`px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg border transition flex items-center gap-1.5 ${
                      confirmClearChat
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : isDark
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:text-red-600 hover:border-red-250'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                    {confirmClearChat ? 'Confirm Clear?' : 'Delete History'}
                  </button>
                </div>

                {/* Chat Scroll Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border ${
                          msg.role === 'user'
                            ? 'bg-orange-500 text-black border-orange-600 font-bold font-sans shadow-md'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-200'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-850'
                        }`}
                      >
                        <div className={`prose prose-xs max-w-none ${isDark && msg.role !== 'user' ? 'prose-invert' : ''}`}>
                          {parseMarkdownToReact(msg.text, isDark, msg.role === 'user')}
                        </div>
                        <span className={`text-[9px] font-mono block text-right mt-2 ${msg.role === 'user' ? 'text-black font-bold opacity-80' : 'opacity-60'}`}>
                          {(() => {
                            try {
                              const d = msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp);
                              return !isNaN(d.getTime()) ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                            } catch (e) {
                              return '';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                        <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />
                        <span className="text-xs font-mono text-neutral-400">Mentor is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input Bar */}
                <div className={`p-4 border-t flex items-center gap-3 ${isDark ? 'border-neutral-800 bg-neutral-900/40' : 'border-neutral-200 bg-neutral-50'}`}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Ask about arrays, graph traversals, space complexity, or LeetCode approaches..."
                    className={`flex-1 border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500' : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-450'}`}
                  />
                  <button
                    onClick={handleSendChatMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="p-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 transition-all flex items-center justify-center shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. CONCEPT COMPARER */}
            {activeSubTab === 'compare' && (
              <div className="space-y-6 transition-all duration-200 ease-out">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Parameter Panel */}
                  <div className={`p-6 rounded-2xl border space-y-4 h-fit ${isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Compare Structures
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Concept A</label>
                        <input
                          type="text"
                          value={concept1}
                          onChange={(e) => setConcept1(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                          placeholder="e.g. ArrayList"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Concept B</label>
                        <input
                          type="text"
                          value={concept2}
                          onChange={(e) => setConcept2(e.target.value)}
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                          placeholder="e.g. LinkedList"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCompareConcepts}
                      disabled={isCompareLoading}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      {isCompareLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Scale className="w-4 h-4" />
                      )}
                      Analyze Differences
                    </button>

                    <div className="pt-4 border-t border-neutral-800">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-2">Common Comparisons</span>
                      <div className="grid grid-cols-2 gap-2">
                        {commonComparisons.map(([c1, c2]) => (
                          <button
                            key={`${c1}-${c2}`}
                            onClick={() => {
                              setConcept1(c1);
                              setConcept2(c2);
                            }}
                            className={`p-2 text-[10px] hover:text-orange-500 border rounded-lg text-left transition truncate ${isDark ? 'text-neutral-400 bg-neutral-950 border-neutral-800' : 'text-neutral-600 bg-neutral-50 border-neutral-200'}`}
                          >
                            {c1} vs {c2}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Output Panel */}
                  <div className={`md:col-span-2 border p-6 rounded-2xl min-h-[400px] flex flex-col justify-between ${isDark ? 'bg-neutral-900/10 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                    <div className="space-y-4">
                      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                        <h3 className="text-xs font-bold text-neutral-450 font-mono uppercase tracking-wider">
                          Comparison Report
                        </h3>
                        {comparisonResult && (
                          <button
                            onClick={() => handleCopy(comparisonResult, 'compare')}
                            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                          >
                            {copiedText === 'compare' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Report
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {isCompareLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-3">
                          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                          <span className="text-xs font-mono text-neutral-450">Comparing memory layouts, JVM profiles, and runtime complexities...</span>
                        </div>
                      ) : comparisonResult ? (
                        <div className={`p-5 rounded-2xl border max-h-[350px] overflow-y-auto space-y-1 ${isDark ? 'bg-neutral-950/60 border-neutral-850' : 'bg-neutral-50 border-neutral-200 shadow-inner'}`}>
                          {parseMarkdownToReact(comparisonResult, isDark)}
                        </div>
                      ) : (
                        <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-neutral-800/60' : 'border-neutral-200'}`}>
                          <Scale className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                          <p className="text-xs text-neutral-450">Select two core Java or DSA concepts to compare memory overheads and execution traits.</p>
                        </div>
                      )}

                      {/* INDEPENDENT COMPARISON CHATBOT (RENDERED ALWAYS) */}
                      {!isCompareLoading && (
                        <FollowUpChatSection
                          messages={compareMessages}
                          input={compareInput}
                          setInput={setCompareInput}
                          onSend={handleSendCompareChat}
                          isLoading={isCompareChatLoading}
                          bottomRef={compareChatBottomRef}
                          isDark={isDark}
                          placeholder={`Ask questions about ${concept1} vs ${concept2}, definitions, applications, or request custom traversals...`}
                          title={`Chat with ${concept1} & ${concept2} Expert`}
                          onClearHistory={handleClearCompareHistory}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SMART NOTES GENERATOR */}
            {activeSubTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-200 ease-out">
                {/* Left Parameter Panel */}
                <div className={`p-6 rounded-2xl border space-y-4 h-fit ${isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <div className="space-y-1.5">
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Study Notes Blueprint
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Generate pristine layout templates (with analogies, Java boilerplate, complexities, and pitfalls) for any syllabus topic.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Select Topic</label>
                      <select
                        value={selectedNoteTopic}
                        onChange={(e) => setSelectedNoteTopic(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                      >
                        {topics.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleGenerateNoteTemplate}
                      disabled={isNotesLoading}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      {isNotesLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                      Build Template
                    </button>
                  </div>

                  <div className="pt-4 border-t border-neutral-850">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-2">Study Tips</span>
                    <ul className="text-[10px] text-neutral-450 space-y-1.5 list-disc pl-4">
                      <li>Ask the Chatbot to draft smart nodes for any customized topic directly!</li>
                      <li>Copy template skeletons directly to save note drafts</li>
                      <li>Use custom code blocks in notes to practice dry-running</li>
                    </ul>
                  </div>
                </div>

                {/* Right Output Panel */}
                <div className={`md:col-span-2 border p-6 rounded-2xl min-h-[400px] flex flex-col justify-between ${isDark ? 'bg-neutral-900/10 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                      <h3 className="text-xs font-bold text-neutral-450 font-mono uppercase tracking-wider">
                        Notes Template
                      </h3>
                      {noteTemplateResult && (
                        <button
                          onClick={() => handleCopy(noteTemplateResult, 'notes')}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                        >
                          {copiedText === 'notes' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Notes
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isNotesLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                        <span className="text-xs font-mono text-neutral-450">Architecting skeleton codes, memory models, and diagrams...</span>
                      </div>
                    ) : noteTemplateResult ? (
                      <div className={`p-6 rounded-2xl text-xs leading-relaxed max-h-[350px] overflow-y-auto space-y-1 border ${isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200 shadow-inner'}`}>
                        {parseMarkdownToReact(noteTemplateResult, isDark)}
                      </div>
                    ) : (
                      <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-neutral-800/60' : 'border-neutral-200'}`}>
                        <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                        <p className="text-xs text-neutral-400">Choose a syllabus topic on the left to lay down a study notes template, or chat directly below to draft custom nodes!</p>
                      </div>
                    )}

                    {/* INDEPENDENT NOTES CHATBOT (RENDERED ALWAYS) */}
                    {!isNotesLoading && (
                      <FollowUpChatSection
                        messages={notesMessages}
                        input={notesInput}
                        setInput={setNotesInput}
                        onSend={handleSendNotesChat}
                        isLoading={isNotesChatLoading}
                        bottomRef={notesChatBottomRef}
                        isDark={isDark}
                        placeholder={`Ask for smart nodes of custom topics, like Java basics, linked lists, stacks, hash maps, etc...`}
                        title="Chat with Note Architect & CS Planner"
                        onClearHistory={handleClearNotesHistory}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. PROBLEMS GUIDE AND HINTS */}
            {activeSubTab === 'problems' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-200 ease-out">
                {/* Left Parameter Panel */}
                <div className={`p-6 rounded-2xl border space-y-4 h-fit ${isDark ? 'bg-neutral-900/20 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <div className="space-y-1.5">
                    <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Strategic Practice Guide
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Stuck on a tricky practice arena problem? Select it to receive structured pattern analyses, progressive clues, and dry-run walkthroughs without spoilers.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Select Problem</label>
                      <select
                        value={selectedProblemTitle}
                        onChange={(e) => setSelectedProblemTitle(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-orange-500 ${isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'}`}
                      >
                        {problems.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleGenerateProblemGuide}
                      disabled={isProblemLoading}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-neutral-950 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition"
                    >
                      {isProblemLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <HelpCircle className="w-4 h-4" />
                      )}
                      Ask Hints
                    </button>
                  </div>

                  <div className="pt-4 border-t border-neutral-850">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-2">Practice Tips</span>
                    <ul className="text-[10px] text-neutral-450 space-y-1.5 list-disc pl-4">
                      <li>Ask the Chatbot below for runnable code (sum, search, trees, maps)!</li>
                      <li>Request detailed Big-O Complexity metrics for any solution</li>
                      <li>Inquire about testing boundary edge cases or dry-run steps</li>
                    </ul>
                  </div>
                </div>

                {/* Right Output Panel */}
                <div className={`md:col-span-2 border p-6 rounded-2xl min-h-[400px] flex flex-col justify-between ${isDark ? 'bg-neutral-900/10 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                      <h3 className="text-xs font-bold text-neutral-450 font-mono uppercase tracking-wider">
                        Strategy Guide & Clues
                      </h3>
                      {problemGuideResult && (
                        <button
                          onClick={() => handleCopy(problemGuideResult, 'problems')}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition flex items-center gap-1 text-[10px]"
                        >
                          {copiedText === 'problems' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Strategy
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {isProblemLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                        <span className="text-xs font-mono text-neutral-450">Parsing constraints, generating progressive hints, and planning dry-runs...</span>
                      </div>
                    ) : problemGuideResult ? (
                      <div className={`p-6 rounded-2xl text-xs leading-relaxed max-h-[350px] overflow-y-auto space-y-1 border ${isDark ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200 shadow-inner'}`}>
                        {parseMarkdownToReact(problemGuideResult, isDark)}
                      </div>
                    ) : (
                      <div className={`text-center py-12 border border-dashed rounded-2xl ${isDark ? 'border-neutral-800/60' : 'border-neutral-200'}`}>
                        <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                        <p className="text-xs text-neutral-450">Choose a practice problem on the left to obtain strategic deconstructions, or use the interactive chatbot below to ask for runnable solutions!</p>
                      </div>
                    )}

                    {/* INDEPENDENT PRACTICE CHATBOT (RENDERED ALWAYS) */}
                    {!isProblemLoading && (
                      <FollowUpChatSection
                        messages={problemsMessages}
                        input={problemsInput}
                        setInput={setProblemsInput}
                        onSend={handleSendProblemsChat}
                        isLoading={isProblemsChatLoading}
                        bottomRef={problemsChatBottomRef}
                        isDark={isDark}
                        placeholder="Request runnable Java code, custom programs, space-time complexities, or dry-runs..."
                        title={`Chat with ${selectedProblemTitle} solver`}
                        onClearHistory={handleClearProblemsHistory}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
    </div>
  );
}
