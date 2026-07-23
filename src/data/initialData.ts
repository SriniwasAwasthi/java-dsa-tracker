/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Topic, Problem, UserProfile, TopicCategory, RoadmapDay } from '../types';

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'java-basics',
    name: 'Java Basics',
    category: 'Java Basics',
    difficulty: 'Easy',
    prerequisites: [],
    estimatedHours: 6,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Variables, data types, operators, conditional loops, switch-case, and basic input/output operations in Java.'
  },
  {
    id: 'java-oop',
    name: 'Object-Oriented Programming (OOP)',
    category: 'OOP',
    difficulty: 'Easy',
    prerequisites: ['Java Basics'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Classes, objects, inheritance, polymorphism, encapsulation, abstraction, interfaces, and abstract classes.'
  },
  {
    id: 'java-collections',
    name: 'Java Collections Framework',
    category: 'Collections',
    difficulty: 'Easy',
    prerequisites: ['java-oop'],
    estimatedHours: 6,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'List, Set, Map interfaces, ArrayList, LinkedList, HashSet, HashMap, Iterator, and Comparable/Comparator.'
  },
  {
    id: 'recursion',
    name: 'Recursion & Mathematical Induction',
    category: 'Basic DSA',
    difficulty: 'Medium',
    prerequisites: ['Java Basics'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Call stack, base condition, recurrence relations, subset generation, and divide & conquer base theory.'
  },
  {
    id: 'arrays',
    name: 'Arrays & Multi-Dimensional Arrays',
    category: 'Basic DSA',
    difficulty: 'Easy',
    prerequisites: ['Java Basics'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Static arrays, dynamic sizing, insertion, deletion, rotation, multi-dimensional grid traversals, and sub-array algorithms.'
  },
  {
    id: 'strings',
    name: 'Strings & String Builders',
    category: 'Basic DSA',
    difficulty: 'Easy',
    prerequisites: ['Arrays'],
    estimatedHours: 6,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'String immutability, constant pool, StringBuilder/StringBuffer, pattern matching, and anagram/palindrome checks.'
  },
  {
    id: 'searching',
    name: 'Searching Algorithms',
    category: 'Basic DSA',
    difficulty: 'Easy',
    prerequisites: ['Arrays'],
    estimatedHours: 6,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Linear search, binary search, searching in sorted rotated arrays, and lower/upper bound calculations.'
  },
  {
    id: 'sorting',
    name: 'Sorting Algorithms',
    category: 'Basic DSA',
    difficulty: 'Medium',
    prerequisites: ['Searching'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Comparison based sorts (Bubble, Selection, Insertion) and O(N log N) sorts (Merge Sort, Quick Sort, Heap Sort).'
  },
  {
    id: 'linked-list',
    name: 'Linked Lists',
    category: 'Linear DSA',
    difficulty: 'Medium',
    prerequisites: ['java-oop'],
    estimatedHours: 10,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Singly linked lists, doubly linked lists, circular linked lists, slow-fast pointer approach, and node manipulation.'
  },
  {
    id: 'stack',
    name: 'Stacks',
    category: 'Linear DSA',
    difficulty: 'Medium',
    prerequisites: ['linked-list'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'LIFO principle, array/list implementations, custom stack class, and prefix/infix/postfix expression evaluations.'
  },
  {
    id: 'queue',
    name: 'Queues & Deques',
    category: 'Linear DSA',
    difficulty: 'Medium',
    prerequisites: ['linked-list'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'FIFO principle, circular queues, deques, priority queues, and queue implementations using stacks & vice versa.'
  },
  {
    id: 'trees',
    name: 'Binary Trees',
    category: 'Non-Linear DSA',
    difficulty: 'Hard',
    prerequisites: ['recursion'],
    estimatedHours: 12,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Node structures, tree traversals (pre-order, in-order, post-order, level-order), tree height, and view properties.'
  },
  {
    id: 'bst',
    name: 'Binary Search Trees (BST)',
    category: 'Non-Linear DSA',
    difficulty: 'Medium',
    prerequisites: ['trees'],
    estimatedHours: 10,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'BST properties, insertion, deletion, lookup algorithms, floor/ceil calculation, and self-balancing tree concepts.'
  },
  {
    id: 'heap',
    name: 'Heaps & Priority Queues',
    category: 'Non-Linear DSA',
    difficulty: 'Medium',
    prerequisites: ['trees'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Binary Heap, max-heap, min-heap properties, heapify operation, priority queues, and k-way merging.'
  },
  {
    id: 'hashing',
    name: 'Hashing & HashMaps',
    category: 'Non-Linear DSA',
    difficulty: 'Easy',
    prerequisites: ['java-collections'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Hash functions, collision handling, HashMap/HashSet internal working, custom hash keys, and bucket sorting.'
  },
  {
    id: 'graph',
    name: 'Graphs & Graph Traversals',
    category: 'Non-Linear DSA',
    difficulty: 'Hard',
    prerequisites: ['trees', 'hashing'],
    estimatedHours: 14,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Adjacency list/matrix, Breadth-First Search (BFS), Depth-First Search (DFS), cycle detection, and topological sorting.'
  },
  {
    id: 'dp',
    name: 'Dynamic Programming (DP)',
    category: 'Algorithms',
    difficulty: 'Hard',
    prerequisites: ['recursion', 'arrays'],
    estimatedHours: 16,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Overlapping subproblems, optimal substructure, memoization vs tabulation, 1D/2D states, knapsack, and LCS.'
  },
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    category: 'Algorithms',
    difficulty: 'Medium',
    prerequisites: ['sorting'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Local optimization, interval scheduling, fractional knapsack, Huffman coding, and activity selection.'
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    category: 'Algorithms',
    difficulty: 'Hard',
    prerequisites: ['recursion'],
    estimatedHours: 10,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'State space tree, pruning, N-Queens problem, Sudoku solver, subset sum, and permutation/combination generation.'
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    category: 'Algorithms',
    difficulty: 'Medium',
    prerequisites: ['Java Basics'],
    estimatedHours: 6,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Bitwise operators (AND, OR, XOR, NOT, shifts), setting/clearing/toggling bits, masking, and counting set bits.'
  },
  {
    id: 'trie',
    name: 'Tries (Prefix Trees)',
    category: 'Advanced DSA',
    difficulty: 'Hard',
    prerequisites: ['trees', 'hashing'],
    estimatedHours: 8,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Prefix key matching, insertion, search, prefix lookup, character array children, and auto-complete search engines.'
  },
  {
    id: 'advanced-topics',
    name: 'Advanced Topics',
    category: 'Advanced DSA',
    difficulty: 'Hard',
    prerequisites: ['graph'],
    estimatedHours: 12,
    completionStatus: 'Not Started',
    isRevisionDue: false,
    description: 'Disjoint Set Union (DSU), Segment Trees, Range Queries, and Fenwick Trees.'
  }
];


export const INITIAL_PROBLEMS: Problem[] = [

  // ─── Java Basics (7 problems) ──────────────────────────────────────────────
  { id: 'p-basics-1', title: 'Sum of First N Natural Numbers', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://www.geeksforgeeks.org/problems/sum-of-series0115/1', hints: ['Use formula N*(N+1)/2 for O(1)', 'Or a simple for-loop accumulator'] },
  { id: 'p-basics-2', title: 'Print Multiplication Table', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Use a for-loop from 1 to 10', 'System.out.printf for formatting'] },
  { id: 'p-basics-3', title: 'Check Even or Odd', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://www.geeksforgeeks.org/problems/odd-or-even3618/1', hints: ['Use modulo operator %', 'n % 2 == 0 means even'] },
  { id: 'p-basics-4', title: 'Reverse a Number using Loops', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Extract last digit with n%10', 'Build reversed number by multiplying by 10'] },
  { id: 'p-basics-5', title: 'Palindrome Number', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/palindrome-number/', hints: ['Reverse the number', 'Compare reversed with original'] },
  { id: 'p-basics-6', title: 'Factorial of a Number', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Use a for-loop multiplying 1..n', 'Handle edge case: 0! = 1'] },
  { id: 'p-basics-7', title: 'FizzBuzz', topicId: 'java-basics', topicName: 'Java Basics', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/fizz-buzz/', hints: ['Check divisibility by 15 first', 'Then by 3, then by 5'] },

  // ─── OOP (7 problems) ──────────────────────────────────────────────────────
  { id: 'p-oop-1', title: 'Design a Custom Book Class & Inheritance', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Define fields: title, author, price', 'Create subclass EBook with downloadSize field'] },
  { id: 'p-oop-2', title: 'Implement Interface for Payment Gateways', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Define Payable interface with pay(amount)', 'Implement CreditCard and UPI classes'] },
  { id: 'p-oop-3', title: 'Bank Account with Encapsulation', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Private balance field', 'Public deposit() and withdraw() with validation'] },
  { id: 'p-oop-4', title: 'Method Overloading – Area Calculator', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Same method name area() with different params', 'circle(r), rectangle(l,w), triangle(b,h)'] },
  { id: 'p-oop-5', title: 'Abstract Shape & Polymorphism', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Create abstract class Shape with abstract area()', 'Circle and Square override area()'] },
  { id: 'p-oop-6', title: 'Singleton Design Pattern', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Private constructor', 'Static getInstance() method'] },
  { id: 'p-oop-7', title: 'Builder Pattern – Order Builder', topicId: 'java-oop', topicName: 'Object-Oriented Programming (OOP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Separate Order and OrderBuilder classes', 'Method chaining in builder'] },

  // ─── Java Collections (6 problems) ────────────────────────────────────────
  { id: 'p-collections-1', title: 'Custom Student Sort using Comparator', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Collections.sort(list, comparator)', 'Lambda: (a, b) -> a.marks - b.marks'] },
  { id: 'p-collections-2', title: 'Remove Duplicates from List preserving Order', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Use LinkedHashSet to preserve insertion order', 'Convert List -> Set -> back to List'] },
  { id: 'p-collections-3', title: 'Word Frequency Counter using HashMap', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Iterate words, use map.getOrDefault(word,0)+1', 'Print map entries'] },
  { id: 'p-collections-4', title: 'Stack using Deque', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Use ArrayDeque instead of Stack class', 'push() and pop() operations'] },
  { id: 'p-collections-5', title: 'Priority Queue – Top K Elements', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', hints: ['Use a min-heap of size k', 'If heap.size() > k, poll()'] },
  { id: 'p-collections-6', title: 'Invert a Map (Value to Key)', topicId: 'java-collections', topicName: 'Java Collections Framework', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Iterate entrySet()', 'inverted.put(entry.getValue(), entry.getKey())'] },

  // ─── Recursion (7 problems) ────────────────────────────────────────────────
  { id: 'p-rec-1', title: 'Fibonacci Number', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/fibonacci-number/', hints: ['Base cases: f(0)=0, f(1)=1', 'f(n) = f(n-1) + f(n-2)'] },
  { id: 'p-rec-2', title: 'Tower of Hanoi', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, hints: ['Move n-1 disks from src to aux', 'Move nth disk to dest, then move n-1 from aux to dest'] },
  { id: 'p-rec-3', title: 'Power of Two (Recursive)', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/power-of-two/', hints: ['Base: n==1 -> true, n==0 -> false', 'Recurse: isPow2(n/2) if n%2==0'] },
  { id: 'p-rec-4', title: 'Generate All Subsets (Power Set)', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/subsets/', hints: ['At each index: include or exclude', 'Base: when index == arr.length, add to result'] },
  { id: 'p-rec-5', title: 'Reverse a String using Recursion', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['Base: empty or single char', 'reverse(s) = last char + reverse(s[0..n-2])'] },
  { id: 'p-rec-6', title: 'Count Occurrences using Recursion', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, hints: ['If arr[n-1] == target, return 1 + count(arr, n-1, target)', 'Base: n==0 -> return 0'] },
  { id: 'p-rec-7', title: 'Flood Fill', topicId: 'recursion', topicName: 'Recursion & Mathematical Induction', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/flood-fill/', hints: ['4-directional DFS recursion', 'Mark visited by changing color before recursing'] },

  // ─── Arrays (7 problems) ───────────────────────────────────────────────────
  { id: 'p-arr-1', title: 'Two Sum', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/two-sum/', hints: ['HashMap: store complement', 'For each num, check if target-num exists in map'] },
  { id: 'p-arr-2', title: "Kadane's Algorithm – Max Subarray Sum", topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/maximum-subarray/', hints: ['Track currentMax and globalMax', 'currentMax = max(num, currentMax+num)'] },
  { id: 'p-arr-3', title: 'Rotate Image / 2D Matrix', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/rotate-image/', hints: ['Transpose the matrix first', 'Then reverse each row'] },
  { id: 'p-arr-4', title: 'Best Time to Buy and Sell Stock', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', hints: ['Track minimum price seen so far', 'profit = price - minPrice'] },
  { id: 'p-arr-5', title: 'Move Zeroes to End', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/move-zeroes/', hints: ['Two-pointer: slow ptr for next write position', 'When fast ptr finds non-zero, write to slow'] },
  { id: 'p-arr-6', title: 'Container With Most Water', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/container-with-most-water/', hints: ['Two pointers from both ends', 'Move the pointer with smaller height'] },
  { id: 'p-arr-7', title: 'Find Missing Number', topicId: 'arrays', topicName: 'Arrays & Multi-Dimensional Arrays', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/missing-number/', hints: ['Expected sum = n*(n+1)/2', 'Missing = expected - actual sum'] },

  // ─── Strings (7 problems) ──────────────────────────────────────────────────
  { id: 'p-str-1', title: 'Valid Anagram', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/valid-anagram/', hints: ['Sort both strings and compare', 'Or use frequency array of size 26'] },
  { id: 'p-str-2', title: 'Longest Palindromic Substring', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-palindromic-substring/', hints: ['Expand around center for each index', 'Check both odd and even length palindromes'] },
  { id: 'p-str-3', title: 'Reverse Words in a String', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/reverse-words-in-a-string/', hints: ['Split by spaces, filter empty, reverse array', 'Join with single space'] },
  { id: 'p-str-4', title: 'First Unique Character', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/first-unique-character-in-a-string/', hints: ['Frequency array of 26 chars', 'Second pass: return first index with freq==1'] },
  { id: 'p-str-5', title: 'String Compression', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/string-compression/', hints: ['Use StringBuilder, count consecutive same chars', 'Append count only if > 1'] },
  { id: 'p-str-6', title: 'Implement strStr() / Needle in Haystack', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', hints: ['Brute: check each starting position', 'Advanced: KMP algorithm'] },
  { id: 'p-str-7', title: 'Count and Say', topicId: 'strings', topicName: 'Strings & String Builders', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/count-and-say/', hints: ['Simulate each sequence step by step', 'Use StringBuilder to build next term'] },

  // ─── Searching (6 problems) ────────────────────────────────────────────────
  { id: 'p-search-1', title: 'Binary Search', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/binary-search/', hints: ['mid = lo + (hi-lo)/2', 'If arr[mid]==target return mid, else narrow half'] },
  { id: 'p-search-2', title: 'Search in Rotated Sorted Array', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', hints: ['Identify which half is sorted', 'Check if target lies in sorted half'] },
  { id: 'p-search-3', title: 'Find Peak Element', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/find-peak-element/', hints: ['Binary search: if arr[mid] < arr[mid+1], peak is on right', 'Otherwise peak is on left or at mid'] },
  { id: 'p-search-4', title: 'First Bad Version', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/first-bad-version/', hints: ['Binary search on version numbers', 'If isBadVersion(mid) go left else go right'] },
  { id: 'p-search-5', title: 'Square Root of X (Floor)', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/sqrtx/', hints: ['Binary search between 1 and x/2', 'ans = mid if mid*mid <= x'] },
  { id: 'p-search-6', title: 'Search a 2D Matrix', topicId: 'searching', topicName: 'Searching Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/search-a-2d-matrix/', hints: ['Treat matrix as flattened 1D sorted array', 'row = mid/cols, col = mid%cols'] },

  // ─── Sorting (7 problems) ──────────────────────────────────────────────────
  { id: 'p-sort-1', title: 'Merge Sorted Array', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/merge-sorted-array/', hints: ['Fill from the back using two pointers', 'Compare nums1[m-1] and nums2[n-1]'] },
  { id: 'p-sort-2', title: 'Kth Largest Element', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', hints: ['Sort descending, return index k-1', 'Or use Min-Heap of size k'] },
  { id: 'p-sort-3', title: 'Sort Colors (Dutch National Flag)', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/sort-colors/', hints: ['Three pointers: lo, mid, hi', 'Partition into 0s, 1s, 2s in one pass'] },
  { id: 'p-sort-4', title: 'Merge Intervals', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/merge-intervals/', hints: ['Sort by start time', 'Merge if current.start <= prev.end'] },
  { id: 'p-sort-5', title: 'Largest Number (Custom Sort)', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/largest-number/', hints: ['Custom comparator: compare (b+a) vs (a+b) as strings', 'Join sorted array'] },
  { id: 'p-sort-6', title: 'Minimum Arrows to Burst Balloons', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', hints: ['Sort by end', 'Arrow at balloon end; skip all that overlap'] },
  { id: 'p-sort-7', title: 'Insertion Sort Linked List', topicId: 'sorting', topicName: 'Sorting Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/insertion-sort-list/', hints: ['Dummy head helps', 'Find correct position for each node in sorted portion'] },

  // ─── Linked List (7 problems) ──────────────────────────────────────────────
  { id: 'p-ll-1', title: 'Reverse Linked List', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/reverse-linked-list/', hints: ['Three pointers: prev, curr, next', 'Iteratively reverse next pointers'] },
  { id: 'p-ll-2', title: 'Linked List Cycle Detection', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/linked-list-cycle/', hints: ["Floyd's slow-fast pointer algorithm", 'If slow==fast, cycle exists'] },
  { id: 'p-ll-3', title: 'Merge Two Sorted Lists', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/merge-two-sorted-lists/', hints: ['Dummy head node simplifies edge cases', 'Compare heads, pick smaller, advance that pointer'] },
  { id: 'p-ll-4', title: 'Remove Nth Node From End', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', hints: ['Two pointers: move fast n+1 steps ahead', 'Then move both until fast is null'] },
  { id: 'p-ll-5', title: 'Middle of the Linked List', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/middle-of-the-linked-list/', hints: ['Slow-fast pointer: slow moves 1, fast moves 2', 'When fast==null, slow is at middle'] },
  { id: 'p-ll-6', title: 'Palindrome Linked List', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/palindrome-linked-list/', hints: ['Find middle, reverse second half', 'Compare first and reversed second half'] },
  { id: 'p-ll-7', title: 'Intersection of Two Linked Lists', topicId: 'linked-list', topicName: 'Linked Lists', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', hints: ['Switch pointers when one reaches null', 'They meet at intersection after same total distance'] },

  // ─── Stack (6 problems) ────────────────────────────────────────────────────
  { id: 'p-stack-1', title: 'Valid Parentheses', topicId: 'stack', topicName: 'Stacks', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/valid-parentheses/', hints: ['Push open brackets; on close, check top matches', 'Stack must be empty at end'] },
  { id: 'p-stack-2', title: 'Largest Rectangle in Histogram', topicId: 'stack', topicName: 'Stacks', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', hints: ['Monotonic increasing stack of indices', 'Pop when current bar < stack top, calculate area'] },
  { id: 'p-stack-3', title: 'Daily Temperatures', topicId: 'stack', topicName: 'Stacks', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/daily-temperatures/', hints: ['Monotonic decreasing stack of indices', 'When warmer day found, pop and compute gap'] },
  { id: 'p-stack-4', title: 'Min Stack', topicId: 'stack', topicName: 'Stacks', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/min-stack/', hints: ['Use two stacks: one normal, one for minimums', 'Push to min stack only when new element <= current min'] },
  { id: 'p-stack-5', title: 'Evaluate Reverse Polish Notation', topicId: 'stack', topicName: 'Stacks', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', hints: ['Push numbers; on operator, pop two, compute, push result', 'Order matters: second popped is left operand'] },
  { id: 'p-stack-6', title: 'Next Greater Element I', topicId: 'stack', topicName: 'Stacks', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/next-greater-element-i/', hints: ['Monotonic stack on nums2, store in HashMap', 'Look up each nums1 element in the map'] },

  // ─── Queue (6 problems) ────────────────────────────────────────────────────
  { id: 'p-queue-1', title: 'Implement Queue using Stacks', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/implement-queue-using-stacks/', hints: ['Lazy transfer: only move to outStack when outStack is empty', 'push to inStack, peek/pop from outStack'] },
  { id: 'p-queue-2', title: 'Sliding Window Maximum', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/sliding-window-maximum/', hints: ['Monotonic deque: remove elements smaller than current from back', 'Front of deque always has max of current window'] },
  { id: 'p-queue-3', title: 'Design Circular Queue', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/design-circular-queue/', hints: ['Use fixed-size array with head/tail pointers', 'tail = (tail+1) % capacity for wrap-around'] },
  { id: 'p-queue-4', title: 'Binary Tree Level Order Traversal (BFS)', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', hints: ['BFS using a Queue', 'For each level, process all nodes currently in queue'] },
  { id: 'p-queue-5', title: 'First Negative in Every Window of Size K', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://www.geeksforgeeks.org/problems/first-negative-integer-in-every-window-of-size-k3345/1', hints: ['Use deque to store indices of negatives', 'Remove from front if index is out of window'] },
  { id: 'p-queue-6', title: 'Task Scheduler', topicId: 'queue', topicName: 'Queues & Deques', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/task-scheduler/', hints: ['Count frequencies, place most frequent task first', 'Idle slots = (maxFreq-1) * cooldown'] },

  // ─── Binary Trees (7 problems) ─────────────────────────────────────────────
  { id: 'p-trees-1', title: 'Maximum Depth of Binary Tree', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', hints: ['maxDepth(node) = 1 + max(left, right)', 'Base: null node returns 0'] },
  { id: 'p-trees-2', title: 'Binary Tree Level Order Traversal', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', hints: ['BFS with Queue', 'Process all nodes at each level before going deeper'] },
  { id: 'p-trees-3', title: 'Invert Binary Tree', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/invert-binary-tree/', hints: ['Swap left and right children recursively', 'invert(node.left); invert(node.right); swap'] },
  { id: 'p-trees-4', title: 'Symmetric Tree', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/symmetric-tree/', hints: ['Compare left.left with right.right', 'Compare left.right with right.left'] },
  { id: 'p-trees-5', title: 'Path Sum', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/path-sum/', hints: ['Subtract node value from target as you go down', 'Base: leaf node with remaining == 0'] },
  { id: 'p-trees-6', title: 'Lowest Common Ancestor of Binary Tree', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', hints: ['If root is p or q, return root', 'LCA is root if p found in one subtree and q in another'] },
  { id: 'p-trees-7', title: 'Binary Tree Right Side View', topicId: 'trees', topicName: 'Binary Trees', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/binary-tree-right-side-view/', hints: ['Level order BFS', 'Take the last element of each level'] },

  // ─── BST (6 problems) ──────────────────────────────────────────────────────
  { id: 'p-bst-1', title: 'Validate Binary Search Tree', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/validate-binary-search-tree/', hints: ['Pass min/max bounds recursively', 'Left subtree: max = current node value'] },
  { id: 'p-bst-2', title: 'Convert Sorted Array to BST', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', hints: ['Mid element becomes root', 'Recursively build left (0..mid-1) and right (mid+1..end)'] },
  { id: 'p-bst-3', title: 'Kth Smallest Element in BST', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', hints: ['Inorder traversal gives sorted order', 'Return the kth element visited'] },
  { id: 'p-bst-4', title: 'Lowest Common Ancestor of BST', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', hints: ['If both p,q < root go left', 'If both p,q > root go right; else root is LCA'] },
  { id: 'p-bst-5', title: 'Search in BST', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', hints: ['If target < root.val go left', 'If target > root.val go right'] },
  { id: 'p-bst-6', title: 'Inorder Successor in BST', topicId: 'bst', topicName: 'Binary Search Trees (BST)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/inorder-successor-in-bst/', hints: ['If p.val < root.val, successor could be root or in left subtree', 'Go right if p.val >= root.val'] },

  // ─── Heap / Priority Queue (6 problems) ────────────────────────────────────
  { id: 'p-heap-1', title: 'Merge K Sorted Lists', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/merge-k-sorted-lists/', hints: ['Min-heap of (value, listIndex, nodeIndex)', 'Poll min, add its next node to heap'] },
  { id: 'p-heap-2', title: 'Find Median from Data Stream', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/find-median-from-data-stream/', hints: ['MaxHeap for lower half, MinHeap for upper half', 'Balance sizes so sizes differ by at most 1'] },
  { id: 'p-heap-3', title: 'Top K Frequent Elements', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/top-k-frequent-elements/', hints: ['Count frequencies with HashMap', 'Use MinHeap of size k, poll when size>k'] },
  { id: 'p-heap-4', title: 'K Closest Points to Origin', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/k-closest-points-to-origin/', hints: ['MaxHeap of size k by distance', 'Poll when size>k, remaining are k closest'] },
  { id: 'p-heap-5', title: 'Last Stone Weight', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/last-stone-weight/', hints: ['Max-heap: repeatedly smash two heaviest', 'If unequal sizes, push the difference back'] },
  { id: 'p-heap-6', title: 'Reorganize String using Heap', topicId: 'heap', topicName: 'Heaps & Priority Queues', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/reorganize-string/', hints: ['MaxHeap by frequency', 'Alternately pick top two most frequent chars'] },

  // ─── Hashing (6 problems) ──────────────────────────────────────────────────
  { id: 'p-hash-1', title: 'Group Anagrams', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/group-anagrams/', hints: ['Sort each word as HashMap key', 'Group words with same sorted key'] },
  { id: 'p-hash-2', title: 'Longest Consecutive Sequence', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-consecutive-sequence/', hints: ['Store all numbers in HashSet', 'Only start sequence from numbers with no n-1 in set'] },
  { id: 'p-hash-3', title: 'Two Sum with HashMap', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/two-sum/', hints: ['Map: num to index', 'For each num, check if target-num is in map'] },
  { id: 'p-hash-4', title: 'Subarray Sum Equals K', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/subarray-sum-equals-k/', hints: ['Prefix sum + HashMap', 'Count how many times (prefixSum - k) has appeared'] },
  { id: 'p-hash-5', title: 'Isomorphic Strings', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/isomorphic-strings/', hints: ['Two maps: s to t and t to s', 'Check consistent mapping in both directions'] },
  { id: 'p-hash-6', title: '4Sum II', topicId: 'hashing', topicName: 'Hashing & HashMaps', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/4sum-ii/', hints: ['Store all sums of nums1[i]+nums2[j] in HashMap', 'Count complementary sums in nums3+nums4'] },

  // ─── Graphs (7 problems) ───────────────────────────────────────────────────
  { id: 'p-graph-1', title: 'Number of Islands', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/number-of-islands/', hints: ['DFS/BFS from each unvisited land cell', 'Mark visited by changing 1 to 0'] },
  { id: 'p-graph-2', title: 'Clone Graph', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/clone-graph/', hints: ['HashMap: original to clone node', 'DFS: clone node, then clone its neighbors'] },
  { id: 'p-graph-3', title: 'Course Schedule (Cycle Detection)', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/course-schedule/', hints: ['Model prerequisites as directed graph', 'Topological sort or DFS cycle detection'] },
  { id: 'p-graph-4', title: 'Rotting Oranges (Multi-source BFS)', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/rotting-oranges/', hints: ['Add all initially rotten to BFS queue', 'BFS spreads rot layer by layer (each layer = 1 minute)'] },
  { id: 'p-graph-5', title: 'Bipartite Graph Check', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/is-graph-bipartite/', hints: ['2-color BFS/DFS', 'If neighbor has same color, not bipartite'] },
  { id: 'p-graph-6', title: 'Find the Town Judge', topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/find-the-town-judge/', hints: ['In-degree == n-1 and out-degree == 0', 'Use two arrays: trust[i] and trusted[i]'] },
  { id: 'p-graph-7', title: "Dijkstra's Shortest Path (Network Delay)", topicId: 'graph', topicName: 'Graphs & Graph Traversals', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/network-delay-time/', hints: ['Min-heap on (distance, node)', 'Relax edges greedily; skip if already finalized'] },

  // ─── Dynamic Programming (7 problems) ─────────────────────────────────────
  { id: 'p-dp-1', title: 'Climbing Stairs', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/climbing-stairs/', hints: ['dp[i] = dp[i-1] + dp[i-2]', 'Base: dp[1]=1, dp[2]=2'] },
  { id: 'p-dp-2', title: '0-1 Knapsack Problem', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem3549/1', hints: ['dp[i][w] = max(include item i, exclude item i)', 'Include only if w >= weight[i]'] },
  { id: 'p-dp-3', title: 'Longest Common Subsequence', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-common-subsequence/', hints: ['dp[i][j] = dp[i-1][j-1]+1 if chars match', 'Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])'] },
  { id: 'p-dp-4', title: 'Coin Change', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/coin-change/', hints: ['dp[i] = min coins to make amount i', 'dp[i] = min(dp[i], dp[i-coin]+1) for each coin'] },
  { id: 'p-dp-5', title: 'Longest Increasing Subsequence', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-increasing-subsequence/', hints: ['dp[i] = LIS ending at index i', 'dp[i] = max(dp[j]+1) for j<i if arr[j]<arr[i]'] },
  { id: 'p-dp-6', title: 'House Robber', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/house-robber/', hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'Either rob current house or skip it'] },
  { id: 'p-dp-7', title: 'Edit Distance (Levenshtein)', topicId: 'dp', topicName: 'Dynamic Programming (DP)', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/edit-distance/', hints: ['dp[i][j] = 0 if chars match', 'Else 1 + min(insert, delete, replace)'] },

  // ─── Greedy (6 problems) ───────────────────────────────────────────────────
  { id: 'p-greedy-1', title: 'Gas Station', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/gas-station/', hints: ['If total gas >= total cost, a solution exists', 'Start from index where running sum first drops to 0'] },
  { id: 'p-greedy-2', title: 'Jump Game', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/jump-game/', hints: ['Track max reachable index', 'If current index > maxReach, return false'] },
  { id: 'p-greedy-3', title: 'Assign Cookies', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/assign-cookies/', hints: ['Sort both greed and cookie arrays', 'Two pointer: give smallest sufficient cookie'] },
  { id: 'p-greedy-4', title: 'Non-overlapping Intervals', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/non-overlapping-intervals/', hints: ['Sort by end time', 'Greedily keep intervals with earliest end'] },
  { id: 'p-greedy-5', title: 'Lemonade Change', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/lemonade-change/', hints: ['Track count of $5 and $10 bills', 'For $20: prefer giving $10+$5 over three $5s'] },
  { id: 'p-greedy-6', title: 'Minimum Platforms (Train Station)', topicId: 'greedy', topicName: 'Greedy Algorithms', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1', hints: ['Sort arrivals and departures separately', 'Two pointers: increment platforms on arrival, decrement on departure'] },

  // ─── Backtracking (6 problems) ─────────────────────────────────────────────
  { id: 'p-back-1', title: 'N-Queens', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/n-queens/', hints: ['Place queen row by row', 'Check column, diagonal, anti-diagonal conflicts'] },
  { id: 'p-back-2', title: 'Permutations', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/permutations/', hints: ['Swap current index with all ahead, recurse, then swap back', 'Or use a visited boolean array'] },
  { id: 'p-back-3', title: 'Combination Sum', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/combination-sum/', hints: ['Try each candidate; subtract from target', 'Allow reuse: do not increment index when recursing'] },
  { id: 'p-back-4', title: 'Word Search in Grid', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/word-search/', hints: ['DFS 4 directions with visited marking', 'Restore cell after backtracking'] },
  { id: 'p-back-5', title: 'Sudoku Solver', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/sudoku-solver/', hints: ['Find empty cell, try 1-9', 'If valid, place and recurse; undo on failure'] },
  { id: 'p-back-6', title: 'Letter Combinations of Phone Number', topicId: 'backtracking', topicName: 'Backtracking', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', hints: ['Map digits to letters', 'Recursively build combinations'] },

  // ─── Bit Manipulation (6 problems) ─────────────────────────────────────────
  { id: 'p-bit-1', title: 'Number of 1 Bits (Hamming Weight)', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/number-of-1-bits/', hints: ['n & (n-1) removes the lowest set bit', 'Count iterations until n==0'] },
  { id: 'p-bit-2', title: 'Single Number', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/single-number/', hints: ['XOR all numbers', 'Pairs cancel out, leaving the single'] },
  { id: 'p-bit-3', title: 'Power of Two using Bit Trick', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/power-of-two/', hints: ['n > 0 && (n & (n-1)) == 0', 'Power of two has exactly one set bit'] },
  { id: 'p-bit-4', title: 'Reverse Bits', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/reverse-bits/', hints: ['Shift result left, OR with (n & 1)', 'Shift n right each iteration, repeat 32 times'] },
  { id: 'p-bit-5', title: 'Missing Number using XOR', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/missing-number/', hints: ['XOR all numbers from 0..n with all array elements', 'Result is the missing number'] },
  { id: 'p-bit-6', title: 'Sum of Two Integers Without + Operator', topicId: 'bit-manipulation', topicName: 'Bit Manipulation', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/sum-of-two-integers/', hints: ['XOR gives sum without carry', 'AND << 1 gives carry; repeat until carry is 0'] },

  // ─── Trie (6 problems) ─────────────────────────────────────────────────────
  { id: 'p-trie-1', title: 'Implement Trie (Prefix Tree)', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', hints: ['TrieNode has children[26] and isEndOfWord', 'insert, search, startsWith traverse char by char'] },
  { id: 'p-trie-2', title: 'Word Search II (Trie + DFS)', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/word-search-ii/', hints: ['Build Trie from word list', 'DFS on grid while traversing Trie simultaneously'] },
  { id: 'p-trie-3', title: 'Replace Words with Root (Trie)', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/replace-words/', hints: ['Insert all roots into Trie', 'For each word, replace with shortest matching root'] },
  { id: 'p-trie-4', title: 'Design Add and Search Words', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', hints: ['Dot matches any character; try all children', 'Standard Trie traversal for non-dot chars'] },
  { id: 'p-trie-5', title: 'Longest Word in Dictionary', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-word-in-dictionary/', hints: ['Insert all words into Trie', 'BFS/DFS: only go deeper if current node is end of a word'] },
  { id: 'p-trie-6', title: 'Count Words with Given Prefix', topicId: 'trie', topicName: 'Tries (Prefix Trees)', difficulty: 'Easy', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/counting-words-with-a-given-prefix/', hints: ['String.startsWith() is simplest', 'Trie-based: traverse to end of prefix, count all words in subtree'] },

  // ─── Advanced Topics (6 problems) ──────────────────────────────────────────
  { id: 'p-adv-1', title: 'Range Sum Query – Mutable (Segment Tree)', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/range-sum-query-mutable/', hints: ['Build segment tree with size 4*n', 'Update and query in O(log n)'] },
  { id: 'p-adv-2', title: 'Number of Connected Components (DSU)', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', hints: ['Union-Find with path compression', 'Count distinct roots after all unions'] },
  { id: 'p-adv-3', title: 'Longest Substring Without Repeating Characters', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', hints: ['Sliding window + HashSet', 'Expand right, shrink left when duplicate found'] },
  { id: 'p-adv-4', title: 'Count of Smaller Numbers After Self (BIT)', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', hints: ['Process right to left', 'BIT (Fenwick Tree) query for count of smaller elements'] },
  { id: 'p-adv-5', title: 'Redundant Connection (DSU Cycle)', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Medium', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/redundant-connection/', hints: ['Add edges one by one with Union-Find', 'First edge where both endpoints have same root is redundant'] },
  { id: 'p-adv-6', title: 'Min Cost to Connect All Points (MST)', topicId: 'advanced-topics', topicName: 'Advanced Topics', difficulty: 'Hard', status: 'Unsolved', attemptCount: 0, url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', hints: ["Sort edges by weight, use DSU (Kruskal)", "Add edge if it doesn't form a cycle"] },
];


export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  preferredLanguageTrack: 'Java',
  selectedDurationWeeks: 8,
  selectedDurationDays: 60,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dailyStudyHoursGoal: 2,
  currentLevel: 'Beginner',
  targetGoal: 'Placements',
  learningPace: 'Balanced',
  themePreference: 'dark',
  onboarded: false, // Start as false so the OnboardingWizard will display on first load
  progressPercentage: 0
};

/**
 * Robustly generates a day-by-day roadmap based on start date, total days, current level, goal, and pace.
 * Distributes all 22 topics in logical prerequisite order, along with their associated problems.
 * Integrates weekly revision days and balanced workloads.
 */
export function generateRoadmap(
  topics: Topic[],
  problems: Problem[],
  profile: UserProfile
): RoadmapDay[] {
  const numDays = profile.selectedDurationDays || (profile.selectedDurationWeeks * 7);
  const roadmap: RoadmapDay[] = [];
  const startDateObj = new Date(profile.startDate);

  // 1. Determine relative weights for topics based on difficulty and level
  const getTopicWeight = (topic: Topic) => {
    let baseWeight = 1.0;
    if (topic.difficulty === 'Easy') baseWeight = 1.0;
    if (topic.difficulty === 'Medium') baseWeight = 1.8;
    if (topic.difficulty === 'Hard') baseWeight = 2.8;

    // Adjust by user level
    if (profile.currentLevel === 'Complete Beginner') {
      if (topic.category === 'Java Basics' || topic.category === 'OOP' || topic.category === 'Collections') {
        baseWeight *= 2.0; // Give significantly more days to basics
      } else {
        baseWeight *= 0.6; // Compress advanced topics slightly
      }
    } else if (profile.currentLevel === 'Intermediate') {
      if (topic.category === 'Java Basics' || topic.category === 'OOP' || topic.category === 'Collections') {
        baseWeight *= 0.3; // Fast track basics
      } else {
        baseWeight *= 1.4; // More time on trees, graphs, DP
      }
    }

    // Adjust by learning pace
    if (profile.learningPace === 'Light') {
      baseWeight *= 1.2; // Spreads things out
    } else if (profile.learningPace === 'Intensive') {
      baseWeight *= 0.8; // Denser content
    }

    return baseWeight;
  };

  // 2. We want to reserve every 7th day as a Revision Day.
  const revisionInterval = 7;

  const topicWeights = topics.map(t => ({ topic: t, weight: getTopicWeight(t) }));
  const totalWeight = topicWeights.reduce((sum, item) => sum + item.weight, 0);

  // Calculate actual teaching days
  let teachingDaysCount = 0;
  for (let d = 1; d <= numDays; d++) {
    if (d % revisionInterval !== 0) {
      teachingDaysCount++;
    }
  }

  // Allocate teaching days to topics proportionally
  const daysPerWeight = teachingDaysCount / totalWeight;
  const topicAllocations = topicWeights.map(item => {
    const allocatedDays = Math.max(1, Math.round(item.weight * daysPerWeight));
    return {
      topicId: item.topic.id,
      days: allocatedDays
    };
  });

  // Re-adjust allocations to perfectly fit teachingDaysCount
  let allocatedSum = topicAllocations.reduce((sum, item) => sum + item.days, 0);
  let attempts = 0;
  while (allocatedSum !== teachingDaysCount && attempts < 100) {
    attempts++;
    if (allocatedSum < teachingDaysCount) {
      // Find topic with maximum days and add a day
      const sorted = [...topicAllocations].sort((a, b) => b.days - a.days);
      const target = topicAllocations.find(item => item.topicId === sorted[0].topicId);
      if (target) {
        target.days++;
        allocatedSum++;
      }
    } else {
      // Find topic with more than 1 day and subtract a day
      const eligible = topicAllocations.filter(item => item.days > 1);
      if (eligible.length > 0) {
        const sorted = [...eligible].sort((a, b) => b.days - a.days);
        const target = topicAllocations.find(item => item.topicId === sorted[0].topicId);
        if (target) {
          target.days--;
          allocatedSum--;
        }
      } else {
        break;
      }
    }
  }

  // Map each teaching day index to its corresponding topic
  const dayToTopicIdMap: { [dayIndex: number]: string } = {};
  let currentDayIndex = 0;
  topicAllocations.forEach(alloc => {
    for (let i = 0; i < alloc.days; i++) {
      dayToTopicIdMap[currentDayIndex] = alloc.topicId;
      currentDayIndex++;
    }
  });

  // Now construct the roadmap day by day
  let teachingDayCounter = 0;
  for (let dayIdx = 0; dayIdx < numDays; dayIdx++) {
    const currentDate = new Date(startDateObj);
    currentDate.setDate(startDateObj.getDate() + dayIdx);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayNumber = dayIdx + 1;

    const isRevisionDay = (dayNumber % revisionInterval === 0);

    let assignedTopicIds: string[] = [];
    let assignedProblemIds: string[] = [];
    let estHours = profile.dailyStudyHoursGoal;

    if (isRevisionDay) {
      // Revision / practice Day: Recap previous week's topics
      const lastWeekStartDay = Math.max(1, dayNumber - 6);
      const prevTopicsSet = new Set<string>();
      for (let prevD = lastWeekStartDay; prevD < dayNumber; prevD++) {
        const prevDayData = roadmap.find(d => d.dayNumber === prevD);
        if (prevDayData) {
          prevDayData.assignedTopicIds.forEach(tid => prevTopicsSet.add(tid));
        }
      }
      const prevTopics = Array.from(prevTopicsSet);
      const recProblems = problems.filter(p => prevTopics.includes(p.topicId));
      // Assign up to 2 key revision problems
      assignedProblemIds = recProblems.slice(0, 2).map(p => p.id);
      estHours = Math.max(1, Math.round(profile.dailyStudyHoursGoal * 0.7));
    } else {
      // Normal teaching day
      const topicId = dayToTopicIdMap[teachingDayCounter];
      teachingDayCounter++;

      if (topicId) {
        assignedTopicIds.push(topicId);

        const topicAlloc = topicAllocations.find(a => a.topicId === topicId);
        const totalTopicDays = topicAlloc ? topicAlloc.days : 1;

        let pastTopicDaysCount = 0;
        for (let prevDayIdx = 0; prevDayIdx < dayIdx; prevDayIdx++) {
          if (roadmap[prevDayIdx] && roadmap[prevDayIdx].assignedTopicIds.includes(topicId)) {
            pastTopicDaysCount++;
          }
        }

        const topicProblems = problems.filter(p => p.topicId === topicId);
        if (topicProblems.length > 0) {
          const problemsPerDay = Math.ceil(topicProblems.length / totalTopicDays);
          const startIdx = pastTopicDaysCount * problemsPerDay;
          const assignedProbs = topicProblems.slice(startIdx, startIdx + problemsPerDay);
          assignedProblemIds = assignedProbs.map(p => p.id);
        }

        const topicObj = topics.find(t => t.id === topicId);
        if (topicObj) {
          if (topicObj.difficulty === 'Easy') {
            estHours = Math.max(1, Math.round(profile.dailyStudyHoursGoal * 0.8));
          } else if (topicObj.difficulty === 'Hard') {
            estHours = Math.max(2, Math.round(profile.dailyStudyHoursGoal * 1.3));
          }
        }
      }
    }

    roadmap.push({
      dayNumber,
      date: dateStr,
      assignedTopicIds,
      assignedProblemIds,
      estimatedHours: estHours,
      status: 'Pending',
      carryForwardTopicIds: []
    });
  }

  return roadmap;
}
