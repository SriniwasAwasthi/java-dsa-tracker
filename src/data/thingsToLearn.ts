export const THINGS_TO_LEARN: Record<string, string[]> = {
  'java-basics': [
    'Variables and Constants',
    'Primitive & Reference Data Types',
    'Arithmetic, Relational & Logical Operators',
    'Conditionals (if-else statements)',
    'Loops (for, while, do-while)',
    'Switch Statements and modern Switch Expressions',
    'Basic Input/Output operations (Scanner & System.out)'
  ],
  'java-oop': [
    'Classes and Objects structure',
    'Constructors and initialization',
    'Inheritance (extends keyword)',
    'Polymorphism (Method Overloading & Method Overriding)',
    'Encapsulation (Getters, Setters, Access Modifiers)',
    'Abstraction (Abstract Classes & Interfaces)'
  ],
  'java-collections': [
    'List interface (ArrayList, LinkedList)',
    'Set interface (HashSet, LinkedHashSet, TreeSet)',
    'Map interface (HashMap, LinkedHashMap, TreeMap)',
    'Iterator and ListIterator',
    'Comparable and Comparator interfaces for sorting'
  ],
  'recursion': [
    'Call Stack visualization and mechanics',
    'Base conditions and preventing StackOverflowError',
    'Recurrence Relations derivation',
    'Subset and combination generation patterns',
    'Divide and conquer base theory'
  ],
  'arrays': [
    'Static arrays memory structure',
    'Dynamic sizing and ArrayList emulation',
    'Insertion, deletion, and search operations',
    'Array rotations and shifting algorithms',
    'Multi-Dimensional Arrays (2D/3D grids)',
    'Sub-array algorithms (Kadane\'s, Sliding Window)'
  ],
  'strings': [
    'String immutability and memory optimization',
    'String Constant Pool (SCP) workings',
    'StringBuilder & StringBuffer classes',
    'Pattern matching algorithms',
    'Anagram and Palindrome checks'
  ],
  'searching': [
    'Linear Search algorithm and complexity',
    'Binary Search on sorted 1D arrays',
    'Binary Search in sorted rotated arrays',
    'Lower bound and upper bound calculations'
  ],
  'sorting': [
    'Comparison-based sorts (Bubble, Selection, Insertion)',
    'Divide and Conquer sorts (Merge Sort, Quick Sort)',
    'Heap Sort using binary heaps',
    'Time and space complexity tradeoffs'
  ],
  'linked-list': [
    'Singly Linked Lists node representation',
    'Doubly Linked Lists node representation',
    'Circular Linked Lists structure',
    'Slow-Fast Pointer technique (Floyd\'s Cycle Finding)',
    'Node insertion, deletion, and reversal algorithms'
  ],
  'stack': [
    'LIFO (Last-In-First-Out) principle',
    'Stack implementation via Arrays & Linked Lists',
    'Custom Stack class design',
    'Infix, Prefix, and Postfix expression evaluation'
  ],
  'queue': [
    'FIFO (First-In-First-Out) principle',
    'Circular Queue structure',
    'Double-Ended Queue (Deque) operations',
    'Priority Queue operations and applications',
    'Queue implementation using Stacks & vice versa'
  ],
  'trees': [
    'Node structures for Binary Trees',
    'DFS Traversals (Pre-order, In-order, Post-order)',
    'BFS Traversal (Level-order traversal)',
    'Height, depth, and diameter calculations',
    'Tree properties and views (Left, Right, Top, Bottom)'
  ],
  'bst': [
    'Binary Search Tree properties and validation',
    'Insertion, deletion, and lookup algorithms',
    'Floor and Ceil computation',
    'Self-balancing tree concepts (AVL, Red-Black Trees)'
  ],
  'heap': [
    'Binary Heap structure (array representation)',
    'Min-Heap & Max-Heap properties',
    'Heapify up/down operations',
    'Priority Queue implementation and applications'
  ],
  'hashing': [
    'Hash functions and index generation',
    'Collision resolution (Chaining, Open Addressing)',
    'HashMap & HashSet internal storage mechanics',
    'Custom Hash Keys and overriding hashCode()/equals()'
  ],
  'graph': [
    'Graph representations (Adjacency List & Matrix)',
    'Breadth-First Search (BFS) traversal',
    'Depth-First Search (DFS) traversal',
    'Cycle detection in directed & undirected graphs',
    'Topological Sorting (Kahn\'s Algorithm & DFS-based)'
  ],
  'dp': [
    'Overlapping subproblems identification',
    'Optimal substructure verification',
    'Memoization (Top-Down) vs Tabulation (Bottom-Up)',
    '1D and 2D DP state transitions',
    'Classic problems (Knapsack, Longest Common Subsequence)'
  ],
  'greedy': [
    'Greedy Choice property and proving correctness',
    'Activity Selection / Interval Scheduling',
    'Fractional Knapsack problem',
    'Huffman Coding prefix codes'
  ],
  'backtracking': [
    'Decision trees and recursive state exploration',
    'State space pruning using constraint checks',
    'N-Queens puzzle solution',
    'Sudoku Solver algorithm'
  ],
  'bit-manipulation': [
    'Bitwise operators (&, |, ^, ~, <<, >>, >>>)',
    'Checking, setting, and clearing specific bits',
    'Power of two verification',
    'Finding the single non-repeating number'
  ],
  'trie': [
    'TrieNode structure (children array or map)',
    'Insert, search, and startsWith operations',
    'Prefix-based autocompletion mechanics'
  ],
  'advanced-topics': [
    'Segment Trees range queries and point updates',
    'Fenwick Trees / Binary Indexed Trees (BIT)',
    'Disjoint Set Union (DSU) with Path Compression',
    'KMP String pattern matching algorithm'
  ]
};
