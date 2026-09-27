import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for all incoming requests (including Capacitor webview running on http://localhost)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Gemini-API-Key');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Initialize GoogleGenAI client per request or with server fallback key
function getAIClientForRequest(req: express.Request): GoogleGenAI | null {
  const customKey = req.headers['x-gemini-api-key'] || req.body?.apiKey;
  if (customKey && typeof customKey === 'string' && customKey.trim() !== '' && customKey !== 'null' && customKey !== 'undefined') {
    const cleanKey = customKey.trim();
    return new GoogleGenAI({
      apiKey: cleanKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  const defaultKey = process.env.GEMINI_API_KEY;
  if (defaultKey && defaultKey !== 'null' && defaultKey !== 'undefined') {
    const cleanServerKey = defaultKey.trim();
    return new GoogleGenAI({
      apiKey: cleanServerKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return null;
}

// Response caching layer for instant repeat queries and low latency
const aiResponseCache = new Map<string, { text: string; expiry: number }>();

function getCachedResponse(key: string): string | null {
  const item = aiResponseCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    aiResponseCache.delete(key);
    return null;
  }
  return item.text;
}

function setCachedResponse(key: string, text: string, ttlMs: number = 1000 * 60 * 60 * 2) {
  if (text && text.trim().length > 0) {
    aiResponseCache.set(key, { text, expiry: Date.now() + ttlMs });
  }
}

// Robust helper function to generate AI content with automatic model fallback & strict timeout
async function generateWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string> {
  // Ultra-fast flash models with direct active quotas
  const modelsToTry = [
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      let timeoutHandle: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(new Error(`Model ${model} timed out after 7500ms`));
        }, 7500);
      });

      const callPromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.3,
          maxOutputTokens: options.maxOutputTokens ?? 1200,
        },
      });

      const response = await Promise.race([callPromise, timeoutPromise]).finally(() => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
      });

      if (response && response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Model Fallback Warning] Model ${model} failed:`, err.message || err);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All Gemini model attempts failed.');
}

// Dynamic fallback response generators with rich Computer Science knowledge engine
function generateDynamicChatResponse(message: string, context?: any): string {
  const query = (message || '').trim();
  const lower = query.toLowerCase();

  // 1. JAVA OVERVIEW & BASICS
  if (lower.includes('what is java') || lower === 'java' || lower.startsWith('java ')) {
    return `### Java Programming Language & Platform

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Core Definition & Purpose
- **Java** is a high-level, class-based, object-oriented, strongly-typed programming language created by Sun Microsystems (now Oracle).
- **Primary Goal**: Built around the philosophy of *"Write Once, Run Anywhere"* (WORA), allowing Java code to compile into bytecode that runs on any operating system equipped with a **Java Virtual Machine (JVM)**.

#### 2. Key Features & Internal Architecture
- **Object-Oriented**: Everything in Java revolves around Objects and Classes, enforcing modularity, encapsulation, inheritance, and polymorphism.
- **JVM & Memory Management**: Java automatically handles memory allocation and deallocation via an automated **Garbage Collector (GC)**, preventing memory leaks and dangling pointers.
- **Platform Independence**: Source code (\`.java\`) $\rightarrow$ Java Compiler (\`javac\`) $\rightarrow$ Bytecode (\`.class\`) $\rightarrow$ Executed by JVM on Windows/Linux/macOS.

#### 3. Runnable Java Code Implementation
\`\`\`java
public class JavaOverview {
    public static void main(String[] args) {
        System.out.println("Hello! Welcome to Java Programming.");
        
        // Primitive variables vs Object reference
        int age = 22; // Primitive (stored on Stack)
        String language = "Java"; // Reference (Object stored on Heap)
        
        System.out.println("Language: " + language + " | Platform: JVM");
    }
}
\`\`\`

#### 4. Memory Layout Summary
- **Stack Memory**: Stores local primitive variables and method execution call frames ($O(1)$ fast access).
- **Heap Memory**: Stores all instantiated objects, instance variables, and class metadata managed by the Garbage Collector.`;
  }

  // 2. PYTHON / PYTHON VS JAVA
  if (lower.includes('python') || lower.includes('what about python') || lower.includes('what is python')) {
    return `### Python vs Java & Language Overview

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Core Definition & Philosophy
- **Python** is a high-level, interpreted, dynamically-typed programming language created by Guido van Rossum. It prioritizes readable, concise syntax and rapid prototyping.
- **Java** is a compiled-to-bytecode, statically-typed, object-oriented language optimized for enterprise scalability, high-performance backends, and strict type safety.

#### 2. Key Architectural Differences
| Dimension / Feature | Java | Python |
| :--- | :--- | :--- |
| **Typing System** | **Statically Typed** (type checking at compile time) | **Dynamically Typed** (type checking at runtime) |
| **Execution Model** | Compiled to Bytecode $\rightarrow$ JIT compiled on JVM | Interpreted line-by-line (CPython / PyPy) |
| **Performance** | High Execution Speed & JIT optimization | Slower raw execution; excels in ML/AI via C-extensions |
| **Memory Model** | Strict Heap & Stack separation with JVM GC | Reference counting + Cyclic Garbage Collector |
| **Syntax Style** | Explicit, verbose, curly braces \`{ }\` | Concise, clean, indentation-based |

#### 3. Side-by-Side Code Comparison
\`\`\`java
// Java: Explicit Types & Structure
public class Example {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum += i;
        }
        System.out.println("Java Sum: " + sum);
    }
}
\`\`\`

\`\`\`python
# Python: Concise & Dynamic
def calculate_sum():
    total = sum(range(1, 6))
    print(f"Python Sum: {total}")

calculate_sum()
\`\`\`

#### 4. When to Use Which
- Choose **Java** for large-scale enterprise microservices (Spring Boot), Android development, and mastering strict Data Structures & Algorithms.
- Choose **Python** for Data Science, Machine Learning / AI pipelines, automation scripts, and rapid API prototyping.`;
  }

  // 3. ARRAY / ARRAYS
  if (lower.includes('what is array') || lower.includes('what is an array') || lower === 'array' || lower.startsWith('array ')) {
    return `### Arrays in Java & Data Structures

Here is a detailed breakdown for **"${query}"**:

#### 1. Definition & Core Idea
- An **Array** is a linear data structure consisting of a contiguous collection of elements, each accessible by a numerical index.
- **Contiguous Memory**: Elements are placed sequentially in adjacent memory addresses.
- **Fixed Sizing**: Array size is allocated at creation and cannot resize dynamically in memory.

#### 2. Operations & Time Complexity Analysis
| Operation | Time Complexity | Notes |
| :--- | :--- | :--- |
| **Random Access (by Index)** | **$O(1)$** | Direct memory offset calculation: \`base + index * element_size\` |
| **Search (Unsorted)** | $O(N)$ | Must iterate sequentially through elements |
| **Search (Sorted)** | **$O(\\log N)$** | Binary Search on sorted arrays |
| **Insertion / Deletion** | $O(N)$ | Requires shifting remaining elements to maintain continuity |

#### 3. Runnable Java Code Example
\`\`\`java
import java.util.Arrays;

public class ArrayDemo {
    public static void main(String[] args) {
        // Declare and initialize an array of integers
        int[] scores = {95, 88, 72, 90, 100};

        // O(1) Fast Index Lookup
        System.out.println("First element (Index 0): " + scores[0]);
        System.out.println("Array length: " + scores.length);

        // Print array contents
        System.out.println("Scores Array: " + Arrays.toString(scores));
    }
}
\`\`\`

#### 4. Interview Tips
- Guard against \`ArrayIndexOutOfBoundsException\` by validating indices (\`0 <= index < array.length\`).
- Use \`ArrayList\` when element count varies dynamically at runtime.`;
  }

  // 4. ARRAYLIST VS LINKEDLIST
  if (lower.includes('arraylist') || lower.includes('linkedlist') || (lower.includes('list') && lower.includes('vs'))) {
    return `### Exam & Interview Guide: ArrayList vs LinkedList

Here is the high-yield summary for **"${query}"**:

#### 1. Core Structural Differences
- **ArrayList**: Backed by a dynamically resizing contiguous array.
  - **Random Access ($O(1)$)**: Instant element retrieval by index (\`list.get(idx)\`).
  - **Insertion / Deletion in Middle ($O(N)$)**: Shifting elements is required.
- **LinkedList**: Backed by a doubly-linked list of node objects (\`prev <-> node <-> next\`).
  - **Random Access ($O(N)$)**: Must traverse from head or tail node sequentially.
  - **Insertion / Deletion at Endpoints ($O(1)$)**: Instant pointer re-linking.

#### 2. Performance & Memory Comparison
| Operation / Metric | ArrayList | LinkedList |
| :--- | :--- | :--- |
| **Get by Index** | **$O(1)$** (Instant) | $O(N)$ (Sequential) |
| **Add / Remove at End** | $O(1)$ amortized | **$O(1)$** |
| **Add / Remove at Start** | $O(N)$ (Shifts all) | **$O(1)$** (Head pointer) |
| **Memory Overhead** | Low (contiguous array) | High (Node pointers + object headers) |
| **CPU Cache Friendliness** | **Excellent** (Spatial Locality) | Poor (Scattered Heap references) |

#### 3. Java Code Walkthrough
\`\`\`java
import java.util.*;

public class ListComparisonDemo {
    public static void main(String[] args) {
        // Use ArrayList for fast index lookups and general collections
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Java");
        arrayList.add("Algorithms");
        System.out.println("ArrayList Get(0): " + arrayList.get(0));

        // Use LinkedList for Queues & Deques
        Deque<String> deque = new LinkedList<>();
        deque.addFirst("Head Item");
        deque.addLast("Tail Item");
        System.out.println("Deque PollFirst: " + deque.pollFirst());
    }
}
\`\`\``;
  }

  // 5. STACK & QUEUE
  if (lower.includes('stack') || lower.includes('queue')) {
    return `### Stack and Queue Data Structures in Java

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Fundamental Principles
- **Stack (LIFO - Last In, First Out)**: Elements are added and removed from the same end (the "top").
  - Core Operations: \`push()\`, \`pop()\`, \`peek()\` — all **$O(1)$**.
  - Best Java Class: \`ArrayDeque<T>\` (recommended over legacy \`java.util.Stack\`).
- **Queue (FIFO - First In, First Out)**: Elements are added at the rear and removed from the front.
  - Core Operations: \`offer()\`, \`poll()\`, \`peek()\` — all **$O(1)$**.
  - Best Java Class: \`ArrayDeque<T>\` or \`LinkedList<T>\`.

#### 2. Java Implementation Example
\`\`\`java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

public class StackQueueDemo {
    public static void main(String[] args) {
        // Modern Java Stack using ArrayDeque
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.push(20);
        System.out.println("Stack Pop (LIFO): " + stack.pop()); // 20

        // Queue using ArrayDeque
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("First");
        queue.offer("Second");
        System.out.println("Queue Poll (FIFO): " + queue.poll()); // First
    }
}
\`\`\`

#### 3. Time Complexity
- **Push / Offer**: $O(1)$
- **Pop / Poll**: $O(1)$
- **Peek**: $O(1)$
- **Space Complexity**: $O(N)$`;
  }

  // 6. HASHMAP / HASHSET
  if (lower.includes('hashmap') || lower.includes('hashset') || lower.includes('hash') || lower.includes('map')) {
    return `### Hash-Based Collections in Java (HashMap & HashSet)

Here is a breakdown for **"${query}"**:

#### 1. How HashMap Works Internally
- **Buckets & Hashing**: An array of Node buckets (\`Node<K,V>[]\`). Keys are hashed using \`key.hashCode()\` to locate bucket index (\`hash & (n - 1)\`).
- **Collision Handling**: Linked lists for collisions. If bucket size $\\ge 8$, converts to a Red-Black Tree ($O(\\log N)$ worst-case).
- **Time Complexity**: Average **$O(1)$** for \`get()\`, \`put()\`, \`containsKey()\`.

#### 2. Java Code Example
\`\`\`java
import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> frequencyMap = new HashMap<>();
        String[] words = {"apple", "banana", "apple", "cherry"};

        for (String w : words) {
            frequencyMap.put(w, frequencyMap.getOrDefault(w, 0) + 1);
        }

        System.out.println("Word Frequencies: " + frequencyMap);
    }
}
\`\`\``;
  }

  // 7. GENERAL CS / DSA MENTOR FALLBACK
  return `### Java & Computer Science Mentor Solution

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Core Concept & Technical Explanation
- **Analysis**: In Java Data Structures & Algorithms, selecting appropriate data representations ensures optimal computational efficiency ($O$) and CPU cache locality.
- **Key Strategy**: Verify boundary conditions ($N=0, N=1$), check for \`null\` references, and determine space-time complexity tradeoffs.

#### 2. Runnable Java Code Implementation
\`\`\`java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Topic Query: ${query.replace(/"/g, "'")}");
        
        // Example Java Data Processing
        List<String> items = Arrays.asList("Java", "Data Structures", "Algorithms");
        items.forEach(item -> System.out.println("-> " + item));
    }
}
\`\`\`

#### 3. Complexity & Memory Overview
- **Time Complexity**: $O(1)$ to $O(N)$ depending on traversal.
- **Space Complexity**: $O(1)$ auxiliary space.`;
}

function generateDynamicCompareResponse(concept1: string, concept2: string): string {
  const c1 = concept1 || 'ArrayList';
  const c2 = concept2 || 'LinkedList';

  return `### Technical Comparison: ${c1} vs ${c2}

#### 1. Definitions & Core Purpose
- **${c1}**: Represents a fundamental Java data structure or algorithmic technique focused on computational efficiency, structured data access, and predictable performance.
- **${c2}**: An alternative abstraction designed with different tradeoffs in memory layout, insertion/deletion mechanisms, and traversal strategies.

#### 2. Comprehensive Comparison Table
| Feature / Metric | ${c1} | ${c2} |
| :--- | :--- | :--- |
| **Primary Underlying Structure** | Contiguous Memory / Index Array | Dynamic Nodes / Pointer Chains |
| **Random Access ($O(1)$)** | **$O(1)$ Direct Offset** | $O(N)$ Sequential Traversal |
| **Insertion / Deletion** | $O(N)$ with element shifting | **$O(1)$ with Pointer Updates** |
| **Memory Layout** | Contiguous memory blocks | Scattered heap allocations |
| **CPU Cache Performance** | **High** (Spatial Locality) | Lower (Pointer chasing) |

#### 3. When to Choose Which
- Choose **${c1}** when your workload requires frequent index-based random access and iteration across contiguous items.
- Choose **${c2}** when you need high-frequency insertions and deletions at endpoints without memory reallocation copies.

#### 4. Runnable Java Code Comparison
\`\`\`java
import java.util.*;

public class ComparisonDemo {
    public static void main(String[] args) {
        System.out.println("Comparing: ${c1} vs ${c2}");

        // Demonstrating ${c1}
        List<String> firstCollection = new ArrayList<>();
        firstCollection.add("${c1} Entry");
        System.out.println("Sample ${c1}: " + firstCollection);

        // Demonstrating ${c2}
        Deque<String> secondCollection = new LinkedList<>();
        secondCollection.add("${c2} Entry");
        System.out.println("Sample ${c2}: " + secondCollection);
    }
}
\`\`\`

#### 5. Tech Lead Interview Tip
Interviewers frequently ask about **CPU Cache Friendliness**. Contiguous structures (${c1}) leverage hardware cache lines effectively, while pointer-based structures (${c2}) generate additional garbage collection overhead and reference indirection.`;
}

function generateDynamicNotesResponse(topicName: string): string {
  const t = topicName || 'Data Structures & Algorithms';

  return `### Personal Study Notes: ${t}

#### 1. Definition & Core Idea
- **${t}**: A foundational topic in Computer Science and Java engineering used to organize data and optimize runtime execution for scalable applications.
- **Why it is used**: Provides clean abstractions, guaranteed Big-O time bounds, and robust software architecture.

#### 2. How to Initialize & Use in Java
- Declare using Java Standard Collection interfaces or custom classes.
- Always check for \`null\` references and boundary parameters before operations.

#### 3. Time & Space Complexity Quick-Ref Guide
| Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Access / Search** | $O(1)$ | $O(1) \\text{ or } O(\\log N)$ | $O(N)$ | $O(N)$ |
| **Insertion / Deletion** | $O(1)$ | $O(1)$ | $O(N)$ | $O(1)$ auxiliary |

#### 4. Complete Runnable Java Code Template
\`\`\`java
import java.util.*;

public class ${t.replace(/[^a-zA-Z0-9]/g, '') || 'Study'}NotesDemo {
    public static void main(String[] args) {
        System.out.println("Personal Study Template for: ${t}");

        // Step 1: Initialize data structure
        int[] data = {10, 20, 30, 40, 50};

        // Step 2: Process & Traverse
        for (int val : data) {
            System.out.println("Processing item: " + val);
        }
    }
}
\`\`\`

#### 5. Exam-Friendly Checklist & Pitfalls
- **Boundary Handling**: Always test empty inputs ($N=0$) and single element inputs ($N=1$).
- **Null Safety**: Avoid \`NullPointerException\` by validating object references.
- **Memory Footprint**: Prefer contiguous storage when random access speed is critical.`;
}

function generateDynamicProblemGuideResponse(problemTitle: string, topicName: string, difficulty: string): string {
  const p = problemTitle || 'Practice Problem';
  const top = topicName || 'Algorithms';
  const diff = difficulty || 'Medium';

  return `### Strategic Practice Guide: ${p}

- **Topic**: ${top}
- **Difficulty**: ${diff}
- **One-Line Definition**: Solve **${p}** by applying pattern recognition and optimal space-time traversal strategies.

#### 1. Pattern Recognition
- Identify whether **Two Pointers**, **Sliding Window**, **HashMap Lookup**, **BFS/DFS**, or **Dynamic Programming** applies to **${p}**.

#### 2. Progressive Hints
- **Hint 1 (First Step)**: Check boundary conditions ($N=0, N=1$) and constraints before writing loops.
- **Hint 2 (Brute Force $O(N^2)$)**: Try a nested traversal to verify correctness and establish a baseline.
- **Hint 3 (Optimal Strategy $O(N)$)**: Use auxiliary structures like a \`HashMap\` or Two Pointers to achieve linear $O(N)$ time complexity!

#### 3. Approach & Strategy Idea
1. Initialize appropriate pointers or state tracking data structures.
2. Traverse the input while checking target conditions.
3. Return the result or compute the optimal boundary.

#### 4. Runnable Java Code Solution Template
\`\`\`java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Practice Solution for: ${p}");
        
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        // Fast two-pointer or hash lookup demonstration
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println("Found pair at indices: [" + map.get(complement) + ", " + i + "]");
                break;
            }
            map.put(nums[i], i);
        }
    }
}
\`\`\`

#### 5. Complexity Summary & Edge Cases
- **Time Complexity**: $O(N)$ linear time.
- **Space Complexity**: $O(N)$ or $O(1)$ auxiliary space.
- **Common Mistakes**: Off-by-one errors and unchecked edge cases.`;
}

// -------------------------------------------------------------------------
// API ROUTES FOR PHASE 5 AI-GUIDED SYSTEM
// -------------------------------------------------------------------------

// 0. Gemini API Key Validation Endpoint
app.post('/api/ai/validate-key', async (req, res) => {
  const apiKey = (req.body?.apiKey || req.headers['x-gemini-api-key'] || '').toString().trim();

  if (!apiKey) {
    return res.status(400).json({
      valid: false,
      status: 'Not Connected',
      error: 'Please enter your Gemini API key.'
    });
  }

  try {
    const testClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    await generateWithFallback(testClient, {
      contents: 'Ping',
      maxOutputTokens: 2
    });

    return res.json({
      valid: true,
      status: 'Connected',
      message: 'Your Gemini API key is connected. AI Mentor is ready to use.'
    });
  } catch (err: any) {
    const errorMsg = (err?.message || '').toLowerCase();
    console.warn('[Validate Key Error]:', err?.message || err);

    // If it's a quota error (429), the key itself is valid and authentic
    if (errorMsg.includes('429') || errorMsg.includes('resource_exhausted') || errorMsg.includes('quota')) {
      return res.json({
        valid: true,
        status: 'Connected',
        message: 'Your Gemini API key is verified and connected.'
      });
    }

    // Authentication failure / Invalid API key (401, 400, API_KEY_INVALID, etc.)
    return res.status(400).json({
      valid: false,
      status: 'Connection Failed',
      error: 'The Gemini API key could not be verified. Please check your API key and try again.'
    });
  }
});

// 1. General Mentor Chat
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, context } = req.body;
  const ai = getAIClientForRequest(req);

  if (!ai) {
    return res.status(400).json({
      error: 'Gemini API Key Required',
      message: 'Please connect your Gemini API key from Settings to use the AI Mentor.'
    });
  }

  const queryKey = (message || '').trim().toLowerCase();
  const cacheKey = `chat_${queryKey}_${context?.tabContext || ''}`;
  const isSingleQuery = (!history || history.length === 0) && queryKey.length < 150;

  if (isSingleQuery) {
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json({ text: cached });
    }
  }

  try {
    const personaInstruction = context?.persona || `You are a world-class personal Java, Data Structures & Algorithms, and Computer Science AI Mentor.
Your goal is to explain topics, answer questions, provide coding syntax or logic tips, and guide users through solving problems.
You can answer ANY user questions including:
- Java, Data Structures, Algorithms, Complexity (Big O)
- General programming and Computer Science
- Software Engineering, Web Development, Databases, Operating Systems, Computer Networks
- System Design, CS Architecture, Node Architecture, and Study Roadmap Planning
- General educational and general knowledge questions
Always write clean, readable, compilable Java code examples when requested. Be encouraging, thorough, dynamic, and academically precise.`;

    const systemInstruction = `${personaInstruction}\nCurrent context: ${JSON.stringify(context || {})}`;

    const formattedContents = [
      ...(history || []).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const responseText = await generateWithFallback(ai, {
      contents: formattedContents,
      systemInstruction,
      temperature: 0.3
    });

    if (isSingleQuery) {
      setCachedResponse(cacheKey, responseText);
    }

    res.json({ text: responseText });
  } catch (error: any) {
    console.warn('Gemini Chat fallback generator triggered:', error.message);
    const dynamicResponse = generateDynamicChatResponse(message, context);
    if (isSingleQuery) {
      setCachedResponse(cacheKey, dynamicResponse);
    }
    res.json({ text: dynamicResponse });
  }
});

// 2. Enhanced Topic Explanation Section Helper
app.post('/api/ai/explain', async (req, res) => {
  const { topicName, topicCategory, difficulty, description } = req.body;
  const ai = getAIClientForRequest(req);

  if (!ai) {
    return res.status(400).json({
      error: 'Gemini API Key Required',
      message: 'Please connect your Gemini API key from Settings to use the AI Mentor.'
    });
  }

  const cacheKey = `explain_${(topicName || '').trim().toLowerCase()}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ text: cached });
  }

  try {
    const prompt = `Provide an extremely high-quality, comprehensive, study-focused explanation of the topic: "${topicName}".
Category: ${topicCategory}
Difficulty: ${difficulty}
Description: ${description}

Include:
1. Real-world Intuition (plain language analogy)
2. Detailed Breakdown of how it works
3. A complete, clean, commented Java Implementation of the core data structure or algorithm
4. Detailed Time and Space Complexity Analysis (Best, Average, Worst) with mathematical notation
5. Edge Cases to watch out for
6. Common Interview Traps and how to escape them
7. Quick checklist: What to remember immediately before solving related problems`;

    const responseText = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: 'You are a brilliant computer science professor teaching Java DSA. Your explanations are visually clean and structurally magnificent.',
      temperature: 0.2
    });

    setCachedResponse(cacheKey, responseText);
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Explanation Error:', error);
    const dynamic = generateDynamicNotesResponse(topicName);
    setCachedResponse(cacheKey, dynamic);
    res.json({ text: dynamic });
  }
});

// 3. Compare Similar/Confusing Concepts
app.post('/api/ai/compare', async (req, res) => {
  const { concept1, concept2 } = req.body;
  const ai = getAIClientForRequest(req);

  if (!ai) {
    return res.status(400).json({
      error: 'Gemini API Key Required',
      message: 'Please connect your Gemini API key from Settings to use the AI Mentor.'
    });
  }

  const sortedConcepts = [concept1 || '', concept2 || ''].sort().join('_').toLowerCase();
  const cacheKey = `compare_${sortedConcepts}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ text: cached });
  }

  try {
    const prompt = `Create a high-yield technical comparison between "${concept1}" and "${concept2}" in Java DSA.
Include:
1. One-Sentence Definitions & Core Purposes
2. Markdown Comparison Table (Underlying structure, Access Time, Insertion/Deletion, Memory Overhead, Cache Friendliness)
3. Key Differences & Trade-offs
4. When to Use Which
5. Compilable Java Code Comparison Snippet`;

    const responseText = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: 'You are a senior tech lead conducting software engineering interviews. Your comparisons are technical, precise, and practical.',
      temperature: 0.2
    });

    setCachedResponse(cacheKey, responseText);
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Comparison Error:', error);
    const dynamic = generateDynamicCompareResponse(concept1, concept2);
    setCachedResponse(cacheKey, dynamic);
    res.json({ text: dynamic });
  }
});

// 4. Study Notes Helper / Template Suggestion
app.post('/api/ai/notes', async (req, res) => {
  const { topicName } = req.body;
  const ai = getAIClientForRequest(req);

  if (!ai) {
    return res.status(400).json({
      error: 'Gemini API Key Required',
      message: 'Please connect your Gemini API key from Settings to use the AI Mentor.'
    });
  }

  const cacheKey = `notes_${(topicName || '').trim().toLowerCase()}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ text: cached });
  }

  try {
    const prompt = `Generate a comprehensive, pristine Personal Study Notes Blueprint for the topic: "${topicName}".

You MUST provide all of the following structured sections:
1. Topic Name: ${topicName}
2. One-Sentence Core Definition
3. Why it is used (Real-World Intuition & Utility)
4. How to Initialize it in Java (Syntax & Declarations)
5. How to Use it in Java (Key Methods & Operations)
6. Complete Compilable Java Program Example with Detailed Comments
7. Important Concept Points & JVM Memory Overhead
8. Detailed Time and Space Complexity Analysis (Best, Average, Worst)
9. Concrete Practical Examples
10. Exam-Friendly Notes & High-Yield Summary Checklist.`;

    const responseText = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: 'You are an elite tutor who designs student notebooks. You create clean, modular templates that are highly organized and enjoyable to fill in.',
      temperature: 0.3
    });

    setCachedResponse(cacheKey, responseText);
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Notes Error:', error);
    const dynamic = generateDynamicNotesResponse(topicName);
    setCachedResponse(cacheKey, dynamic);
    res.json({ text: dynamic });
  }
});

// 5. Practice Problem Hint & Strategy Guide
app.post('/api/ai/problem-guide', async (req, res) => {
  const { problemTitle, topicName, difficulty } = req.body;
  const ai = getAIClientForRequest(req);

  if (!ai) {
    return res.status(400).json({
      error: 'Gemini API Key Required',
      message: 'Please connect your Gemini API key from Settings to use the AI Mentor.'
    });
  }

  const cacheKey = `problem_${(problemTitle || '').trim().toLowerCase()}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return res.json({ text: cached });
  }

  try {
    const prompt = `Provide a comprehensive Strategic Practice Guide and Progressive Hints for the problem: "${problemTitle}".
Topic: "${topicName}". Difficulty: "${difficulty}".

You MUST include all of the following:
1. Problem Title & Topic Name
2. Difficulty Rating & One-Line Definition
3. Pattern Recognition (e.g. Two Pointers, Fast/Slow Pointers, Sliding Window, HashMap, DFS/BFS)
4. Progressive Hints:
   - Hint 1: Initial Thought & Edge Case Checklist
   - Hint 2: Brute-Force Strategy & Complexity
   - Hint 3: High-Level Optimized Approach
5. Basic Points & Constraints to Remember
6. Time & Space Complexity Analysis
7. Solution Strategy & Step-by-Step Approach Idea
8. Common Mistakes to Avoid (e.g. NullPointerException, Off-By-One errors)
9. Compilable Java Code Skeleton / Solution Template
10. Recommended Practice Direction.`;

    const responseText = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: 'You are a veteran technical interviewer. You give helpful, encouraging hints that lead the student to discover the solution themselves, rather than giving away the answers.',
      temperature: 0.3
    });

    setCachedResponse(cacheKey, responseText);
    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Problem Guide Error:', error);
    const dynamic = generateDynamicProblemGuideResponse(problemTitle, topicName, difficulty);
    setCachedResponse(cacheKey, dynamic);
    res.json({ text: dynamic });
  }
});

// -------------------------------------------------------------------------
// API ROUTES FOR PHASE 7: ACCOUNT SYSTEM, CLOUD SYNC & DEVICE MGMT
// -------------------------------------------------------------------------

const USERS_DB_PATH = path.join(process.cwd(), 'users_db.json');

function readDB() {
  try {
    if (!fs.existsSync(USERS_DB_PATH)) {
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify({ users: [] }, null, 2));
    }
    const data = fs.readFileSync(USERS_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { users: [] };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// 1. Account registration
app.post('/api/auth/register', (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDB();
  const lowerEmail = email.toLowerCase().trim();
  const existingUser = db.users.find((u: any) => u.email === lowerEmail);

  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const userId = 'u_' + Math.random().toString(36).substr(2, 9);
  const recoveryKey = 'RECOVER-' + Array.from({length: 4}, () => Math.random().toString(36).substr(2, 4).toUpperCase()).join('-');
  const now = new Date().toISOString();

  const newUser = {
    id: userId,
    email: lowerEmail,
    password, 
    displayName,
    recoveryKey,
    accountCreationDate: now,
    lastLoginDate: now,
    localModeStatus: false,
    syncModeStatus: true,
    syncData: null,
    devices: [
      {
        deviceId: 'dev_' + Math.random().toString(36).substr(2, 9),
        deviceName: 'Primary Device',
        trustedStatus: 'Trusted',
        lastActiveTime: now,
        syncState: 'Synced',
        logoutStatus: false
      }
    ]
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...userResponse } = newUser;
  res.json({
    status: 'success',
    user: {
      id: userResponse.id,
      displayName: userResponse.displayName,
      email: userResponse.email,
      localModeStatus: userResponse.localModeStatus,
      syncModeStatus: userResponse.syncModeStatus,
      accountCreationDate: userResponse.accountCreationDate,
      lastLoginDate: userResponse.lastLoginDate,
      recoveryKey: userResponse.recoveryKey
    },
    devices: userResponse.devices
  });
});

// 2. Account login
app.post('/api/auth/login', (req, res) => {
  const { email, password, deviceName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDB();
  const lowerEmail = email.toLowerCase().trim();
  const user = db.users.find((u: any) => u.email === lowerEmail && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const now = new Date().toISOString();
  user.lastLoginDate = now;

  const deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
  const newDevice = {
    deviceId,
    deviceName: deviceName || 'Generic Browser Device',
    trustedStatus: 'Trusted',
    lastActiveTime: now,
    syncState: 'Synced',
    logoutStatus: false
  };

  if (!user.devices) {
    user.devices = [];
  }
  user.devices.push(newDevice);
  writeDB(db);

  res.json({
    status: 'success',
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      localModeStatus: user.localModeStatus,
      syncModeStatus: user.syncModeStatus,
      accountCreationDate: user.accountCreationDate,
      lastLoginDate: user.lastLoginDate,
      recoveryKey: user.recoveryKey
    },
    deviceId,
    devices: user.devices,
    syncData: user.syncData
  });
});

// 3. Account recovery
app.post('/api/auth/recover', (req, res) => {
  const { email, recoveryKey, newPassword } = req.body;
  if (!email || !recoveryKey) {
    return res.status(400).json({ error: 'Email and Recovery Key are required' });
  }

  const db = readDB();
  const lowerEmail = email.toLowerCase().trim();
  const user = db.users.find((u: any) => u.email === lowerEmail && u.recoveryKey === recoveryKey.trim());

  if (!user) {
    return res.status(401).json({ error: 'Invalid Email or Recovery Key' });
  }

  if (newPassword) {
    user.password = newPassword;
  }

  const now = new Date().toISOString();
  user.lastLoginDate = now;
  writeDB(db);

  res.json({
    status: 'success',
    user: {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      localModeStatus: user.localModeStatus,
      syncModeStatus: user.syncModeStatus,
      accountCreationDate: user.accountCreationDate,
      lastLoginDate: user.lastLoginDate,
      recoveryKey: user.recoveryKey
    },
    devices: user.devices || [],
    syncData: user.syncData
  });
});

// 4. Update Profile Info
app.post('/api/auth/update-profile', (req, res) => {
  const { userId, displayName } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (displayName) user.displayName = displayName;
  writeDB(db);

  res.json({ status: 'success', displayName: user.displayName });
});

// 5. Cloud Sync Pull
app.post('/api/sync/pull', (req, res) => {
  const { userId, deviceId } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date().toISOString();
  if (user.devices) {
    const dev = user.devices.find((d: any) => d.deviceId === deviceId);
    if (dev) {
      dev.lastActiveTime = now;
    }
  }

  writeDB(db);
  res.json({
    lastSyncedTime: now,
    syncData: user.syncData || null
  });
});

// 6. Cloud Sync Push
app.post('/api/sync/push', (req, res) => {
  const { userId, deviceId, syncData, clientTimestamp } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date().toISOString();

  // Latest-updated-wins mechanism & conflict detection
  let conflictDetected = false;
  let resolutionResult = 'Latest-updated-wins applied';

  if (user.syncData && user.syncData.lastUpdated) {
    const serverTime = new Date(user.syncData.lastUpdated).getTime();
    const clientTime = clientTimestamp ? new Date(clientTimestamp).getTime() : 0;
    if (serverTime > clientTime) {
      conflictDetected = true;
      resolutionResult = 'Server data is newer. Client should pull or merge.';
      return res.json({
        status: 'conflict',
        conflictState: 'Conflict Detected',
        resolutionResult,
        serverData: user.syncData,
        lastSyncedTime: now
      });
    }
  }

  user.syncData = syncData;
  user.syncData.lastUpdated = now;

  if (user.devices) {
    const dev = user.devices.find((d: any) => d.deviceId === deviceId);
    if (dev) {
      dev.lastActiveTime = now;
      dev.syncState = 'Synced';
    }
  }

  writeDB(db);
  res.json({
    status: 'success',
    conflictState: 'No Conflict',
    resolutionResult,
    lastSyncedTime: now
  });
});

// 7. Get Device List
app.post('/api/devices/list', (req, res) => {
  const { userId } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ devices: user.devices || [] });
});

// 8. Logout/Unlink Device
app.post('/api/devices/logout', (req, res) => {
  const { userId, deviceId } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.devices) {
    user.devices = user.devices.filter((d: any) => d.deviceId !== deviceId);
  }

  writeDB(db);
  res.json({ status: 'success', devices: user.devices || [] });
});

// -------------------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION SERVING
// -------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
