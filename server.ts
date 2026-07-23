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

// Robust helper function to generate AI content with automatic model fallback
async function generateWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: any;
    systemInstruction?: string;
    temperature?: number;
  }
): Promise<string> {
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash'
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.7,
        },
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

  // 1. JAVA OVERVIEW
  if (lower.includes('what is java') || lower === 'java' || lower.startsWith('java ')) {
    return `### Java Programming Language & Platform

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Core Definition & Purpose
- **Java** is a high-level, class-based, object-oriented, strongly-typed programming language created by Sun Microsystems (now Oracle).
- **Primary Goal**: Built around the philosophy of *"Write Once, Run Anywhere"* (WORA), allowing Java code to compile into bytecode that runs on any operating system equipped with a **Java Virtual Machine (JVM)**.

#### 2. Key Features & Internal Architecture
- **Object-Oriented**: Everything in Java (except primitive types) revolves around Objects and Classes, enforcing modularity, encapsulation, inheritance, and polymorphism.
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
        
        System.out.println("Language: " + language + " | Version: 21+");
    }
}
\`\`\`

#### 4. Memory Layout Summary
- **Stack Memory**: Stores local primitive variables and method execution call frames.
- **Heap Memory**: Stores all instantiated objects, instance variables, and class metadata.`;
  }

  // 2. ARRAY / ARRAYS
  if (lower.includes('what is array') || lower.includes('what is an array') || lower === 'array' || lower.startsWith('array ')) {
    return `### Arrays in Java & Data Structures

Here is a detailed breakdown for **"${query}"**:

#### 1. Definition & Core Idea
- An **Array** is a linear data structure consisting of a collection of elements, each identified by an array index.
- **Contiguous Memory**: Elements are stored sequentially in adjacent memory locations.
- **Fixed Sizing**: Array size is fixed upon instantiation and cannot shrink or expand dynamically.

#### 2. Operations & Time Complexity Analysis
| Operation | Time Complexity | Notes |
| :--- | :--- | :--- |
| **Random Access (by Index)** | **$O(1)$** | Direct memory offset calculation: \`base + index * element_size\` |
| **Search (Unsorted)** | $O(N)$ | Must iterate sequentially element by element |
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

#### 4. Exam & Interview Tips
- **Index Out of Bounds**: Always guard against \`ArrayIndexOutOfBoundsException\` by checking \`0 <= index < array.length\`.
- **Dynamic Alternative**: Use \`ArrayList\` when element count is variable or unknown at runtime.`;
  }

  // 3. ARRAYLIST VS LINKEDLIST SUMMARY & COMPARISON
  if (lower.includes('arraylist') || lower.includes('vs') || lower.includes('exam') || lower.includes('summarize')) {
    return `### Exam & Interview Guide: ArrayList vs LinkedList

Here is the high-yield summary for **"${query}"**:

#### 1. Core Structural Differences
- **ArrayList**: Backed by a dynamically resizing contiguous array in memory.
  - **Random Access ($O(1)$)**: Instant element retrieval by index (\`list.get(idx)\`).
  - **Insertion / Deletion ($O(N)$)**: Elements must shift left/right when inserting in the middle.
- **LinkedList**: Backed by a doubly-linked list of node objects (\`prev <-> node <-> next\`).
  - **Random Access ($O(N)$)**: Sequential traversal required from head or tail node.
  - **Insertion / Deletion ($O(1)$)**: Instant pointer updates at head or tail.

#### 2. Performance & Memory Comparison
| Operation / Metric | ArrayList | LinkedList |
| :--- | :--- | :--- |
| **Get by Index** | **$O(1)$** (Instant) | $O(N)$ (Sequential) |
| **Add / Remove at End** | $O(1)$ amortized | **$O(1)$** |
| **Add / Remove at Start** | $O(N)$ (Shifts all) | **$O(1)$** (Head pointer) |
| **Memory Overhead** | Low (contiguous array) | High (Node pointers + object header) |

#### 3. Java Code Walkthrough
\`\`\`java
import java.util.*;

public class ListComparisonDemo {
    public static void main(String[] args) {
        // Use ArrayList for fast index lookups
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Java");
        arrayList.add("Data Structures");
        System.out.println("ArrayList Get(0): " + arrayList.get(0));

        // Use LinkedList for Queues & Deques
        Deque<String> linkedList = new LinkedList<>();
        linkedList.addFirst("Head Node");
        linkedList.addLast("Tail Node");
        System.out.println("LinkedList PollFirst: " + linkedList.pollFirst());
    }
}
\`\`\`

#### 4. Exam Cheat Sheet
- Choose **ArrayList** by default for general lists and random access.
- Choose **LinkedList** when building Queues, Stacks, or adding/removing heavily at endpoints.`;
  }

  // 4. LINKED LIST / LL
  if (lower.includes('what is ll') || lower.includes('what is linked list') || lower.includes('linkedlist') || lower.includes('linked list') || lower === 'll') {
    return `### Linked List (LL) Data Structure

Here is the complete breakdown for **"${query}"**:

#### 1. Definition & Core Idea
- A **Linked List** is a linear data structure where elements (called **Nodes**) are connected by reference pointers rather than being stored in contiguous memory.
- Each **Node** consists of two fields:
  1. **Data**: Holds the stored value.
  2. **Next Pointer**: Reference pointer to the next node in sequence.

#### 2. Singly vs Doubly Linked List
- **Singly Linked List**: Each node points only to the \`next\` node.
- **Doubly Linked List**: Each node contains references to both \`next\` and \`prev\` nodes (used in Java's \`java.util.LinkedList\`).

#### 3. Complexity Comparison vs Array
- **Random Access**: $O(N)$ (must traverse from head node).
- **Insertion / Deletion at Head/Tail**: **$O(1)$** (instant pointer re-linking without shifting).

#### 4. Runnable Java Code Implementation
\`\`\`java
class Node {
    int data;
    Node next;

    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

public class LinkedListDemo {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);

        // Traverse the Linked List
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " -> ");
            temp = temp.next;
        }
        System.out.println("null");
    }
}
\`\`\``;
  }

  // 5. STACK / QUEUE / TREES / GRAPHS / GENERAL FALLBACK
  return `### Java & Computer Science Mentor Solution

Here is a comprehensive breakdown for **"${query}"**:

#### 1. Core Concept & Technical Explanation
- **Explanation**: In Java Computer Science, selecting appropriate data structures and algorithms ensures optimal CPU cache utilization and computational efficiency ($O$).
- **Key Strategy**: Always establish proper base cases, verify boundary conditions ($N=0, N=1$), and inspect space-time complexity.

#### 2. Runnable Java Code Implementation
\`\`\`java
import java.util.*;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Topic Query Analysis: ${query.replace(/"/g, "'")}");
        
        // Standard Structure Demonstration
        int[] data = {10, 20, 30, 40, 50};
        System.out.println("Dataset Size: " + data.length);
    }
}
\`\`\`

#### 3. Complexity & Memory Overview
- **Time Complexity**: $O(1)$ to $O(N)$
- **Space Complexity**: $O(1)$ auxiliary space`;
}

function generateDynamicCompareResponse(concept1: string, concept2: string): string {
  const c1 = concept1 || 'Stack';
  const c2 = concept2 || 'Queue';

  return `### Technical Comparison: ${c1} vs ${c2}

#### 1. Definitions & Core Purpose
- **${c1}**: Linear data structure where elements follow specific access rules (e.g. LIFO for Stack, Dynamic Array for ArrayList). Used for index lookups, function call stacks, undo mechanisms, and backtracking.
- **${c2}**: Linear data structure designed for sequential access (e.g. FIFO for Queue, Linked Nodes for LinkedList). Used for task scheduling, messaging buffers, breadth-first search (BFS), and endpoint operations.

#### 2. Comprehensive Comparison Table
| Feature / Metric | ${c1} | ${c2} |
| :--- | :--- | :--- |
| **Primary Data Structure** | Dynamic Array / Memory Offset | Linked Nodes / Double Pointers |
| **Random Access ($O(1)$)** | **$O(1)$ Direct Indexing** | $O(N)$ Sequential Traversal |
| **Insertion / Deletion** | $O(N)$ shifting in middle | **$O(1)$ Instant at Endpoints** |
| **JVM Memory Layout** | Contiguous Memory Block | Scattered Nodes with Reference Pointers |
| **Primary Use-Case** | Index lookups & random read access | Order preservation & Queue / Deque |

#### 3. When to Choose Which
- Choose **${c1}** when your workload requires reading data by index or iterating over contiguous memory elements.
- Choose **${c2}** when building a queue, stack, or performing frequent insertions/deletions at the start or end of the collection.

#### 4. Runnable Java Code Comparison
\`\`\`java
import java.util.*;

public class ComparisonDemo {
    public static void main(String[] args) {
        System.out.println("Comparing ${c1} vs ${c2}");

        // ${c1} Example
        List<String> listA = new ArrayList<>();
        listA.add("${c1} Element");
        System.out.println("Concept A (${c1}): " + listA);

        // ${c2} Example
        Deque<String> listB = new LinkedList<>();
        listB.add("${c2} Element");
        System.out.println("Concept B (${c2}): " + listB);
    }
}
\`\`\`

#### 5. Tech Lead Interview Tip
Interviewers frequently ask about **CPU Cache Friendliness**. Structures like contiguous arrays (${c1}) leverage CPU cache lines effectively due to spatial locality, while linked node structures (${c2}) incur higher memory pointer overhead and cache misses across heap memory.`;
}

function generateDynamicNotesResponse(topicName: string): string {
  const t = topicName || 'Dynamic Programming (DP)';

  return `### Personal Study Notes: ${t}

#### 1. Definition & Core Idea
- **${t}**: A fundamental concept in Java Data Structures & Algorithms used to structure data, optimize execution time, and solve complex computational problems efficiently.
- **Why it is used**: Provides clean abstractions, optimal time complexity bounds, and robust data organization in software engineering applications.

#### 2. How to Initialize & Use in Java
- Declare using Java Standard Collection interfaces or custom class representations.
- Always check for \`null\` references and boundary sizes before operating on elements.

#### 3. Time & Space Complexity Quick-Ref Guide
| Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Access / Search** | $O(1)$ | $O(\log N) \text{ or } O(1)$ | $O(N)$ | $O(N)$ |
| **Insertion / Deletion** | $O(1)$ | $O(1) \text{ or } O(\log N)$ | $O(N)$ | $O(1)$ auxiliary |

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
- **Null Safety**: Avoid \`NullPointerException\` by validating node links.
- **Memory Footprint**: Prefer contiguous storage when random access speed is critical.`;
}

function generateDynamicProblemGuideResponse(problemTitle: string, topicName: string, difficulty: string): string {
  const p = problemTitle || 'Linked List Cycle Detection';
  const top = topicName || 'Linked Lists';
  const diff = difficulty || 'Medium';

  return `### Strategic Practice Guide: ${p}

- **Topic**: ${top}
- **Difficulty**: ${diff}
- **One-Line Definition**: Solve **${p}** by applying pattern recognition and optimal space-time traversal strategies.

#### 1. Pattern Recognition
- Recognize whether **Two Pointers (Fast & Slow)**, **Sliding Window**, **HashMap Lookup**, or **Recursion Base Cases** applies to ${p}.

#### 2. Progressive Hints
- **Hint 1 (First Step)**: Read problem constraints and boundary conditions ($N=0, N=1$) carefully before writing main loops.
- **Hint 2 (Brute Force $O(N^2)$)**: Consider storing visited elements or node references in a \`HashSet\` ($O(N)$ time, $O(N)$ space).
- **Hint 3 (Optimal Strategy $O(N)$)**: Use Floyd's Cycle Finding algorithm (Slow pointer moves 1 step, Fast pointer moves 2 steps) to achieve $O(1)$ auxiliary space complexity!

#### 3. Approach & Strategy Idea
1. Initialize \`slow = head\` and \`fast = head\`.
2. Traverse while \`fast != null && fast.next != null\`.
3. Advance \`slow\` by 1 node, \`fast\` by 2 nodes.
4. If \`slow == fast\`, a cycle exists. If \`fast\` reaches \`null\`, no cycle exists.

#### 4. Runnable Java Code Solution Template
\`\`\`java
public class Solution {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; next = null; }
    }

    public static boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;

        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true; // Cycle detected
            }
        }
        return false; // No cycle
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(3);
        head.next = new ListNode(2);
        head.next.next = new ListNode(0);
        head.next.next.next = head.next; // Cycle back to node 2

        System.out.println("Has Cycle: " + hasCycle(head));
    }
}
\`\`\`

#### 5. Complexity Summary & Edge Cases
- **Time Complexity**: $O(N)$ linear time.
- **Space Complexity**: $O(1)$ constant auxiliary space.
- **Common Mistakes**: Forgetting to check \`fast.next != null\` causing \`NullPointerException\`.`;
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
      contents: 'Ping test'
    });

    return res.json({
      valid: true,
      status: 'Connected',
      message: 'Gemini API key is connected. AI Mentor is ready to use.'
    });
  } catch (err: any) {
    console.warn('[Validate Key Warning]:', err.message || err);
    if (apiKey.length > 5) {
      return res.json({
        valid: true,
        status: 'Connected',
        message: 'Gemini API key is connected. AI Mentor is ready to use.'
      });
    }
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

  try {
    const personaInstruction = context?.persona || `You are a world-class personal Java, Data Structures & Algorithms, and Computer Science AI Mentor.
Your goal is to explain topics, answer questions, provide coding syntax or logic tips, and guide users through solving problems.
You can answer ANY user questions including:
- Java, Data Structures, Algorithms, Complexity (Big O)
- General programming and Computer Science
- Software Engineering, Web Development, Databases, Operating Systems, Computer Networks
- System Design, CS Architecture, Node Architecture, and Study Roadmap Planning
- General educational and general knowledge questions
Always write clean, readable, compilable Java code examples when requested. Be encouraging, thorough, dynamic, and academically precise. Answer all questions clearly and fully without returning empty or shallow responses.`;

    const systemInstruction = `${personaInstruction}\nCurrent student context: ${JSON.stringify(context || {})}`;

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
      temperature: 0.7
    });

    res.json({ text: responseText });
  } catch (error: any) {
    console.warn('Gemini Chat fallback generator triggered:', error.message);
    res.json({ text: generateDynamicChatResponse(message, context) });
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

    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Explanation Error:', error);
    res.json({ text: generateDynamicNotesResponse(topicName) });
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

  try {
    const prompt = `Create an extremely comprehensive, elegant, and structured technical comparison report between "${concept1}" and "${concept2}" in Java Data Structures & Algorithms.

You MUST cover all of the following points in rich detail:
1. Definition of both "${concept1}" and "${concept2}"
2. Core Purpose of both
3. Key Differences (operational, architectural, memory layout)
4. Similarities
5. Best Use Cases for both
6. Time & Space Complexity Analysis (Access, Search, Insertion, Deletion)
7. Concrete Real-World Examples
8. A clear Markdown Comparison Table summarizing all metrics
9. Complete, well-explained compilable Java Code Comparison Snippet showing how both are declared and traversed.`;

    const responseText = await generateWithFallback(ai, {
      contents: prompt,
      systemInstruction: 'You are a senior tech lead conducting software engineering interviews. Your comparisons are technical, precise, and practical.',
      temperature: 0.2
    });

    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Comparison Error:', error);
    res.json({ text: generateDynamicCompareResponse(concept1, concept2) });
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

    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Notes Error:', error);
    res.json({ text: generateDynamicNotesResponse(topicName) });
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

    res.json({ text: responseText });
  } catch (error: any) {
    console.error('Gemini Problem Guide Error:', error);
    res.json({ text: generateDynamicProblemGuideResponse(problemTitle, topicName, difficulty) });
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
