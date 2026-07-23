/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubtopicDetail {
  title: string;
  definition: string;
  syntax?: string;
  approach?: string;
  dryRun?: string;
  codeSnippet: string;
  complexity: string;
  commonMistakes: string[];
  interviewQuestions: string[];
}

export interface TopicContent {
  introduction: string;
  conceptBreakdown: string;
  subtopics: SubtopicDetail[];
  relevance: string;
  externalLinks: { title: string; url: string }[];
}

export const SYLLABUS_CONTENT: Record<string, TopicContent> = {
  'java-basics': {
    introduction: 'Java is a robust, class-based, object-oriented programming language designed to have as few implementation dependencies as possible. It runs on the Write Once, Run Anywhere (WORA) principle, using the Java Virtual Machine (JVM).',
    conceptBreakdown: 'To start programming in Java, you must understand the basic structure of a class, the main method entry point, primitive data types, operators, dynamic input scanner, and how conditional loops steer execution flow.',
    relevance: 'Foundational for all software development in Java, including enterprise engineering, Android app development, and coding challenge solutions.',
    externalLinks: [
      { title: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/' },
      { title: 'GeeksforGeeks Java Basics', url: 'https://www.geeksforgeeks.org/java/' }
    ],
    subtopics: [
      {
        title: 'Java Setup, JRE, JDK & JVM Architecture',
        definition: 'JDK (Java Development Kit) provides the environment to write and run programs. JRE (Java Runtime Environment) is the package containing the libraries and JVM required to run Java bytecode. JVM (Java Virtual Machine) executes bytecode line-by-line via the JIT compiler.',
        syntax: 'javac HelloWorld.java\njava HelloWorld',
        approach: 'Compile the Java source code to bytecode using "javac" which creates a .class file. Execute the bytecode using "java" which invokes the JVM interpreter.',
        dryRun: 'JDK installs compiler + runtime. Code -> javac compiles -> JVM interprets bytecode -> machine instructions executed.',
        codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("JDK, JRE & JVM successfully configured!");
    }
}`,
        complexity: 'Compile time: O(1), Run time: O(1) for startup.',
        commonMistakes: [
          'Confusing JDK (needed for compile/dev) with JRE (only runs existing programs).',
          'Not setting environmental variables (JAVA_HOME and PATH) correctly.'
        ],
        interviewQuestions: [
          'What is the difference between JDK, JRE, and JVM?',
          'Why is Java platform independent but JVM is platform dependent?'
        ]
      },
      {
        title: 'Variables, Data Types & Operators',
        definition: 'Variables are memory containers. Java is strongly-typed, supporting primitives (int, byte, short, long, float, double, char, boolean) and reference types (objects, arrays). Operators include arithmetic, logical, bitwise, relational, and ternary variants.',
        syntax: 'int variableName = defaultValue;\nboolean flag = true;',
        approach: 'Define a variable with an explicit type before using. Primitives store values on the Stack, references point to Objects on the Heap.',
        dryRun: 'int x = 10; float y = x / 3f; // x is widened to float, y becomes 3.3333333',
        codeSnippet: `public class Primitives {
    public static void main(String[] args) {
        int age = 22;
        double gpa = 3.91;
        char firstLetter = 'S';
        boolean isMaster = true;
        
        // Ternary operator
        String status = (gpa >= 3.5) ? "Honors" : "Regular";
        System.out.println("Student: " + status + " (" + firstLetter + ")");
    }
}`,
        complexity: 'Memory utilization: Primitives take fixed space (int = 4 bytes, double = 8 bytes, char = 2 bytes). O(1) operations.',
        commonMistakes: [
          'Using double for monetary calculations (leads to precision errors; use BigDecimal instead).',
          'Forgetting float literals require a trailing \'f\' or \'F\'.'
        ],
        interviewQuestions: [
          'Why does Java not support global variables?',
          'What is type casting? Differentiate implicit widening from explicit narrowing.'
        ]
      },
      {
        title: 'Conditionals and Switch Expressions',
        definition: 'Conditionals control programmatic decision making. Java supports standard if, else-if, else statements, and the modern Switch Expressions (Java 12+) which support yield values and multiple case matches.',
        syntax: 'if (condition) { ... } else { ... }\nswitch(val) { case A -> expression; }',
        codeSnippet: `public class Conditionals {
    public static void assessScore(int score) {
        // Modern switch expression (Java 12+)
        String grade = switch (score / 10) {
            case 10, 9 -> "A";
            case 8 -> "B";
            case 7 -> "C";
            default -> "D/F";
        };
        System.out.println("Assigned Grade: " + grade);
    }
}`,
        complexity: 'O(1) time complexity per condition evaluation.',
        commonMistakes: [
          'Forgetting break statements in traditional switch-case blocks, leading to "fall-through".',
          'Using == to compare Strings instead of .equals() inside conditions.'
        ],
        interviewQuestions: [
          'What is the difference between a traditional switch and a switch expression in Java 14?',
          'Explain short-circuit evaluation of logical AND (&&) and logical OR (||).'
        ]
      },
      {
        title: 'Loops, Flow Control, and Break/Continue',
        definition: 'Loops repeat statements. Java provides three main loops: for, while, and do-while. Labelled loops allow control flow to break or continue outer structures during nested iterations.',
        syntax: 'for (int i = 0; i < n; i++) { ... }\nwhile (condition) { ... }',
        approach: 'Ensure the loop variant progresses towards a termination criterion to avoid infinite runtime loops.',
        dryRun: 'For i = 0 to 2: step 1, print 0; step 2, print 1; step 3, termination check triggers exit.',
        codeSnippet: `public class LoopControl {
    public static void main(String[] args) {
        outer: // Labelled loop
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    break outer; // Breaks out of the outer loop!
                }
                System.out.println("i=" + i + ", j=" + j);
            }
        }
    }
}`,
        complexity: 'O(N) for linear loops, O(N^2) for nested grids.',
        commonMistakes: [
          'Infinite loops due to updating variables incorrectly inside while conditions.',
          'Off-by-one errors in loop boundaries (using <= instead of <).'
        ],
        interviewQuestions: [
          'What are labelled break and continue statements in Java?',
          'When is a do-while loop preferred over a standard while loop?'
        ]
      }
    ]
  },
  'java-oop': {
    introduction: 'Object-Oriented Programming (OOP) is a paradigm centered around objects rather than logic. It enables structured code, dry architecture, inheritance hierarchies, and clean interface designs.',
    conceptBreakdown: 'Core OOP includes classes/objects, constructors, polymorphism (overloading/overriding), inheritance, abstraction (abstract classes/interfaces), encapsulation (getters/setters), access modifiers, and custom packages.',
    relevance: 'The key building block of all enterprise software, software engineering design patterns, and systemic Java systems.',
    externalLinks: [
      { title: 'Oracle OOP Concepts', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' }
    ],
    subtopics: [
      {
        title: 'Classes, Objects, and Constructors',
        definition: 'A Class is a blueprint that defines state and behavior. An Object is an instance of a class. Constructors initialize state, supporting default, parameterized, and copy constructors.',
        syntax: 'public class Car { public Car() { ... } }',
        codeSnippet: `public class Student {
    private String name;
    private int id;
    
    // Parameterized Constructor
    public Student(String name, int id) {
        this.name = name; // 'this' differentiates instance fields
        this.id = id;
    }
    
    public void display() {
        System.out.println("Student: " + name + ", ID: " + id);
    }
}`,
        complexity: 'Instantiation takes O(1) heap allocation time.',
        commonMistakes: [
          'Adding a return type to a constructor signature (turns it into a regular method).',
          'Not providing a default constructor when a parameterized constructor exists, causing compile issues elsewhere.'
        ],
        interviewQuestions: [
          'What is the difference between a class and an object?',
          'What is constructor overloading, and can a constructor be private?'
        ]
      },
      {
        title: 'The four pillars: Inheritance & Polymorphism',
        definition: 'Inheritance lets child classes acquire parent attributes (using extends). Polymorphism allows methods to take multiple forms: Static (Overloading) or Dynamic (Overriding via @Override).',
        syntax: 'class Dog extends Animal { @Override void sound() { ... } }',
        approach: 'Use polymorphism to write generic handlers that operate on base references, but execute subclass implementations dynamically.',
        codeSnippet: `class Animal {
    public void makeSound() {
        System.out.println("Generic animal sound");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow!");
    }
}

public class OOPDemo {
    public static void triggerSound(Animal a) {
        a.makeSound(); // Polymorphic invocation
    }
}`,
        complexity: 'Resolution of dynamic methods: O(1) via virtual method table (vtable).',
        commonMistakes: [
          'Attempting multiple inheritance in Java (Java only supports single inheritance for classes to prevent the diamond problem).',
          'Using static methods dynamically (static methods cannot be polymorphic/overridden).'
        ],
        interviewQuestions: [
          'What is runtime polymorphism, and how does the JVM resolve it?',
          'Why does Java not support multiple inheritance with classes but supports it with interfaces?'
        ]
      },
      {
        title: 'Abstraction & Interfaces',
        definition: 'Abstraction hides internal implementation, exposing only clean endpoints. Accomplished using Abstract Classes (can have instance states and method bodies) or Interfaces (pure contracts, supports multiple implements, static & default methods).',
        syntax: 'public interface Swimmable { void swim(); }',
        codeSnippet: `abstract class DatabaseConnector {
    protected String connectionString;
    public abstract void connect(); // Abstract method
    
    public void logConnection() {
        System.out.println("Attempting link on " + connectionString);
    }
}

interface CloudSync {
    void pushBackup(); // Interface method
    
    // Default method (Java 8+)
    default void statusAlert() {
        System.out.println("Cloud health: OK");
    }
}`,
        complexity: 'No performance overhead compared to basic dynamic overriding.',
        commonMistakes: [
          'Declaring fields in an interface expecting them to be variable instance fields (interface variables are implicitly public, static, and final).',
          'Instantiating abstract classes or interfaces directly using "new AbstractClass()".'
        ],
        interviewQuestions: [
          'Differentiate between abstract classes and interfaces (especially in Java 8 and 9+).',
          'What are functional interfaces, and what is their role in Lambda Expressions?'
        ]
      }
    ]
  },
  'java-collections': {
    introduction: 'The Java Collections Framework provides an architecture to store and manipulate a group of objects. It includes list, sets, queues, and map interfaces, alongside custom utilities.',
    conceptBreakdown: 'Understand List (ArrayList, LinkedList), Set (HashSet, LinkedHashSet, TreeSet), Map (HashMap, LinkedHashMap, TreeMap), Queue interfaces, Comparator/Comparable, and the modern Generics framework.',
    relevance: 'Essential for data manipulation, standard library usage, and building complex custom data storage modules.',
    externalLinks: [
      { title: 'Oracle Collections Trail', url: 'https://docs.oracle.com/javase/tutorial/collections/' }
    ],
    subtopics: [
      {
        title: 'List Interface & Custom Sorting',
        definition: 'Lists represent ordered sequences. ArrayList implements a dynamically resizable array. LinkedList is a doubly-linked list. Sorting lists is done using Comparable (internal, default sort) or Comparator (external, customizable sorting rules).',
        syntax: 'List<Integer> list = new ArrayList<>();\nCollections.sort(list, comparator);',
        codeSnippet: `import java.util.*;

class Employee implements Comparable<Employee> {
    String name;
    int salary;
    
    Employee(String n, int s) { this.name = n; this.salary = s; }
    
    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.salary, other.salary); // Ascending order
    }
}

public class SortingDemo {
    public static void main(String[] args) {
        List<Employee> list = new ArrayList<>();
        list.add(new Employee("Alice", 95000));
        list.add(new Employee("Bob", 82000));
        
        // Sorting using custom Comparator (lambda format)
        list.sort((e1, e2) -> e1.name.compareTo(e2.name));
    }
}`,
        complexity: 'ArrayList lookup: O(1). ArrayList insert/delete: O(N) average. Collections.sort() uses TimSort: O(N log N).',
        commonMistakes: [
          'Using raw list types (e.g. ArrayList list = new ArrayList()) instead of type-safe generics.',
          'Assuming LinkedList is always faster than ArrayList (ArrayList is often faster due to contiguous memory, cache locality, and lack of node allocation).'
        ],
        interviewQuestions: [
          'Differentiate between ArrayList and LinkedList. When would you choose which?',
          'What is the difference between Comparable and Comparator interfaces?'
        ]
      },
      {
        title: 'Set, Map and Internal Collisions',
        definition: 'Set prevents duplicate elements. Map maps keys to values. HashMap uses hashing algorithms to place keys into buckets, resolving bucket collisions using Linked Lists and Red-Black Trees (Java 8+).',
        syntax: 'Map<String, Integer> map = new HashMap<>();',
        approach: 'Put key-value: hash key -> retrieve bucket index -> place node. Get key: search bucket chain via key.equals().',
        dryRun: 'Put "Apple" and "Banana". If they have identical hashcode, they form a linked list inside that hash slot. If the slot exceeds 8 items, Java 8 converts it to a Red-Black Tree to optimize search to O(log N).',
        codeSnippet: `import java.util.*;

public class MapCollisionDemo {
    public static void main(String[] args) {
        Map<String, String> dict = new HashMap<>();
        dict.put("DSA", "Data Structures & Algorithms");
        dict.put("OOP", "Object-Oriented Programming");
        
        for (Map.Entry<String, String> entry : dict.entrySet()) {
            System.out.println(entry.getKey() + " maps to " + entry.getValue());
        }
    }
}`,
        complexity: 'HashMap Search/Insert: O(1) average, O(N) worst case (O(log N) in Java 8+ due to treeification).',
        commonMistakes: [
          'Overriding .equals() but forgetting to override .hashCode(), which breaks HashMaps.',
          'Modifying an object while it is acting as a key in a HashMap (corrupts lookup).'
        ],
        interviewQuestions: [
          'How does a HashMap work internally in Java? What is treeification?',
          'What is the difference between HashMap, LinkedHashMap, and TreeMap?'
        ]
      }
    ]
  },
  'arrays': {
    introduction: 'Arrays are linear data structures storing homogeneous items in contiguous memory slots. They support random access through index calculations.',
    conceptBreakdown: 'Master array storage, multi-dimensional grids, prefix sums, two-pointer techniques, and sliding window patterns.',
    relevance: 'The base for all algorithmic problem solving, sorting, searching, and linear data representations.',
    externalLinks: [
      { title: 'LeetCode Array Category', url: 'https://leetcode.com/tag/array/' }
    ],
    subtopics: [
      {
        title: 'Prefix Sums, Two Pointers & Sliding Window',
        definition: 'Prefix Sum stores precalculated cumulative sums. Two-Pointers scan arrays from boundaries inwards or together. Sliding Window maintains a dynamic contiguous subset of the array to solve sub-array problems.',
        syntax: 'prefix[i] = prefix[i-1] + arr[i];',
        approach: 'For prefix sum, construct a running sum array to answer range sum queries in constant time. For sliding window, expand right boundary to include items, contract left boundary to enforce limits.',
        dryRun: 'Query sum from index 1 to 3 of [2, 4, 1, 5]. Prefix: [2, 6, 7, 12]. Sum = Prefix[3] - Prefix[0] = 12 - 2 = 10.',
        codeSnippet: `public class RangeSum {
    private int[] prefix;

    public RangeSum(int[] arr) {
        prefix = new int[arr.length];
        prefix[0] = arr[0];
        for (int i = 1; i < arr.length; i++) {
            prefix[i] = prefix[i - 1] + arr[i];
        }
    }

    public int query(int L, int R) {
        if (L == 0) return prefix[R];
        return prefix[R] - prefix[L - 1];
    }
}`,
        complexity: 'Range Sum Construction: O(N) time, O(N) space. Range Sum Query: O(1) time.',
        commonMistakes: [
          'ArrayIndexOutOfBoundsException due to boundary checks in loops.',
          'Off-by-one index arithmetic during range queries.'
        ],
        interviewQuestions: [
          'How does the Sliding Window pattern reduce nested loops from O(N^2) to O(N)?',
          'Explain the Two-Pointer technique for finding a pair that sums to a target in a sorted array.'
        ]
      }
    ]
  },
  'linked-list': {
    introduction: 'A Linked List is a linear data structure where elements are not stored in contiguous memory. Instead, each element (node) contains a data field and a reference pointer to the next node.',
    conceptBreakdown: 'Covers singly, doubly, and circular linked lists, pointer reversal techniques, cycle detection, and merging/sorting nodes.',
    relevance: 'Extremely popular in interviews due to pointers, reference mutations, and structure rewrites.',
    externalLinks: [
      { title: 'LeetCode Linked List Category', url: 'https://leetcode.com/tag/linked-list/' }
    ],
    subtopics: [
      {
        title: 'Linked List Reversal & Fast-Slow Pointer approach',
        definition: 'Reversal modifies reference directions iteratively or recursively. Fast-Slow Pointers (Floyd\'s Cycle Finding Algorithm) utilizes two references moving at speeds 2 and 1 respectively to locate list cycles or midpoints.',
        syntax: 'ListNode nextNode = curr.next; curr.next = prev; prev = curr; curr = nextNode;',
        approach: 'To reverse, walk node by node, cache the original next node, point next backward, update previous. To detect cycle, loop while fast and fast.next are non-null; if fast equals slow, a cycle exists.',
        dryRun: 'List: 1 -> 2 -> 3. Iteration 1: temp=2, 1.next=null, prev=1, curr=2. Iteration 2: temp=3, 2.next=1, prev=2, curr=3. Result: 3 -> 2 -> 1.',
        codeSnippet: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LLUtils {
    public static ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode temp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = temp;
        }
        return prev;
    }
    
    public static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
        complexity: 'Reversal: O(N) time, O(1) auxiliary space. Cycle detection: O(N) time, O(1) space.',
        commonMistakes: [
          'Losing reference links during node deletions or pointer redirects (NullPointerException).',
          'Not handling edge cases with empty lists or single nodes.'
        ],
        interviewQuestions: [
          'Why is Floyd\'s cycle detection algorithm mathematically guaranteed to meet inside cycles?',
          'How do you locate the start of a cycle in a linked list?'
        ]
      }
    ]
  },
  'dp': {
    introduction: 'Dynamic Programming is a paradigm that solves complex optimization problems by breaking them down into simpler subproblems, solving each subproblem once, and storing their solutions.',
    conceptBreakdown: 'Covers overlapping subproblems, optimal substructure, Memoization (Top-down) vs Tabulation (Bottom-up), knapsack models, edit distance, and longest common subsequence.',
    relevance: 'The pinnacle of advanced algorithmic interview questions for FAANG/MANG software placements.',
    externalLinks: [
      { title: 'LeetCode DP Category', url: 'https://leetcode.com/tag/dynamic-programming/' }
    ],
    subtopics: [
      {
        title: 'Memoization (Top-Down) vs Tabulation (Bottom-Up)',
        definition: 'Memoization is recursive and stores solutions in arrays/hashmaps before returning. Tabulation is iterative and populates tables bottom-up.',
        syntax: 'dp[i] = dp[i-1] + dp[i-2];',
        approach: '1. Define DP state. 2. Establish base cases. 3. Formulate the state transition. 4. Code recursively with memo table or iteratively using tab table.',
        dryRun: 'Fibonacci 4 memoized: fib(4)->fib(3)+fib(2). Cache is hit for subsequent subproblems like fib(2). Avoids computing redundant branches.',
        codeSnippet: `public class FibonacciDP {
    // Tabulation approach (O(N) time, O(1) space)
    public static int getFib(int n) {
        if (n <= 1) return n;
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev2 + prev1;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
    
    // Memoization approach
    public static int fibMemo(int n, int[] memo) {
        if (n <= 1) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    }
}`,
        complexity: 'Naive: O(2^N) time. DP: O(N) time, O(1) space for optimized bottom-up.',
        commonMistakes: [
          'Forgetting to initialize DP base cases correctly.',
          'Creating excessively large memory structures leading to OutOfMemory issues.'
        ],
        interviewQuestions: [
          'Explain the concept of Overlapping Subproblems and Optimal Substructure.',
          'Describe the transition formula and DP state configuration of the 0/1 Knapsack Problem.'
        ]
      }
    ]
  },
  'recursion': {
    introduction: 'Recursion is a programming technique where a method calls itself directly or indirectly to solve a problem. It solves problems by decomposing them into identical smaller instances.',
    conceptBreakdown: 'Covers execution call stack, base conditions, recurrence relations, dynamic heap allocations, and call stack overflows.',
    relevance: 'Foundational for trees, graph traversals, and dynamic backtracking models.',
    externalLinks: [
      { title: 'GeeksforGeeks Recursion', url: 'https://www.geeksforgeeks.org/recursion/' }
    ],
    subtopics: [
      {
        title: 'Recurrence Relations, Call Stack, & StackOverflowError',
        definition: 'A base condition terminates recursion. The call stack tracks active scopes. StackOverflowError occurs when the execution stack exceeds limit (usually due to missing base cases).',
        syntax: 'public void rec(int n) { if (n == 0) return; rec(n-1); }',
        approach: 'Always establish base cases first. Every step must reduce the problem size closer to the base criteria.',
        dryRun: 'Call factorial(3) -> waits on 3 * factorial(2) -> waits on 2 * factorial(1) -> returns 1. Resolves up: 3 * (2 * 1) = 6.',
        codeSnippet: `public class RecursionBase {
    public static int factorial(int n) {
        // 1. Base Condition
        if (n <= 1) return 1;
        
        // 2. Recursive Call & Relation
        return n * factorial(n - 1);
    }
}`,
        complexity: 'Time complexity maps to recurrence relation (e.g. T(N) = T(N-1) + O(1) => O(N)). Space complexity is O(N) auxiliary due to execution frames.',
        commonMistakes: [
          'Missing base case which leads to endless loops and StackOverflowError.',
          'Passing unmodified variables to recursive calls, resulting in identical call values.'
        ],
        interviewQuestions: [
          'What is tail-call optimization, and does Java support it natively?',
          'What are the memory implications of recursive calls compared to standard iteration?'
        ]
      }
    ]
  },
  'searching': {
    introduction: 'Searching is the algorithmic task of finding a key value inside a collection of items.',
    conceptBreakdown: 'Covers Linear Search, Binary Search, bound calculations, and searching rotated structures.',
    relevance: 'An extremely foundational area for optimization problems and data lookups.',
    externalLinks: [
      { title: 'LeetCode Binary Search Tag', url: 'https://leetcode.com/tag/binary-search/' }
    ],
    subtopics: [
      {
        title: 'Binary Search on Sorted Ranges & Rotated Arrays',
        definition: 'Binary Search is a divide-and-conquer strategy that repeatedly cuts search spaces in half to locate keys in logarithmic runtime.',
        syntax: 'int mid = low + (high - low) / 2;\nif (arr[mid] == target) return mid;',
        approach: 'Establish boundaries. Calculate safe midpoint to avoid integer overflow. Check matching, else shift bounds left or right depending on sorted side comparison.',
        dryRun: 'Search 6 in [1, 3, 6, 8, 12]. Low=0, High=4. Mid=2, arr[2]=6. Match found on first check!',
        codeSnippet: `public class SearchUtils {
    public static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            // Avoid overflow compared to (low + high) / 2
            int mid = low + (high - low) / 2;
            
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
        complexity: 'O(log N) time complexity, O(1) space.',
        commonMistakes: [
          'Using "low + high / 2" which can cause overflow when sum of indices exceeds Integer.MAX_VALUE.',
          'Incorrect loop boundary termination (using < instead of <=).'
        ],
        interviewQuestions: [
          'Why does Binary Search require arrays to be sorted? How can we search rotated sorted arrays?',
          'Explain lower bound and upper bound operations using Binary Search.'
        ]
      }
    ]
  },
  'sorting': {
    introduction: 'Sorting is the process of arranging data elements in a particular order (ascending or descending).',
    conceptBreakdown: 'Comparison of O(N^2) sorts (Bubble, Selection, Insertion) vs O(N log N) sorts (Merge Sort, Quick Sort, Heap Sort).',
    relevance: 'Foundational for array algorithms, searching prep, and custom object ordering.',
    externalLinks: [
      { title: 'Sorting Algorithms Visualized', url: 'https://visualgo.net/en/sorting' }
    ],
    subtopics: [
      {
        title: 'Merge Sort and Quick Sort Algorithms',
        definition: 'Merge Sort is a stable, divide-and-conquer sort that splits arrays, sorts sub-parts, and merges them. Quick Sort is an unstable sort that selects a pivot node and partitions elements around it.',
        syntax: 'mergeSort(arr, low, mid);\nmergeSort(arr, mid+1, high);\nmerge(arr, low, mid, high);',
        codeSnippet: `public class SortUtils {
    public static void mergeSort(int[] arr, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
    
    private static void merge(int[] arr, int l, int m, int r) {
        int[] temp = new int[r - l + 1];
        int i = l, j = m + 1, k = 0;
        while (i <= m && j <= r) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= m) temp[k++] = arr[i++];
        while (j <= r) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, l, temp.length);
    }
}`,
        complexity: 'Merge Sort: O(N log N) all cases. Quick Sort: O(N log N) average, O(N^2) worst case.',
        commonMistakes: [
          'Forgetting Quick Sort worst case occurs with sorted arrays when picking boundary pivots.',
          'Merge Sort requires auxiliary O(N) space, which can be an issue for highly constrained platforms.'
        ],
        interviewQuestions: [
          'What is the difference between stable and unstable sorting algorithms?',
          'How do you optimize Quick Sort to guarantee O(N log N) worst-case performance?'
        ]
      }
    ]
  },
  'stack': {
    introduction: 'A Stack is a linear data structure that follows the LIFO (Last In First Out) principle. It supports push, pop, and peek operations.',
    conceptBreakdown: 'Covers expression parsing, parentheses matching, monotonic stack patterns, and stack design using arrays or nodes.',
    relevance: 'Foundational for compiler parsing, bracket syntax validators, and sliding array windows.',
    externalLinks: [
      { title: 'LeetCode Stack Category', url: 'https://leetcode.com/tag/stack/' }
    ],
    subtopics: [
      {
        title: 'Monotonic Stacks & Valid Bracket Parsing',
        definition: 'A Monotonic Stack maintains elements in strictly increasing or decreasing orders. Valid parenthesizing uses stack frames to track pending closing brackets.',
        syntax: 'Stack<Character> stack = new Stack<>();\nstack.push(c);\nchar top = stack.pop();',
        codeSnippet: `import java.util.Stack;

public class StackValidator {
    public static boolean isValid(String s) {
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
}`,
        complexity: 'Bracket Parsing: O(N) time complexity, O(N) space.',
        commonMistakes: [
          'Checking stack.pop() without calling stack.isEmpty() first, causing EmptyStackException.',
          'Not validating if the stack is completely empty at the end of the scan.'
        ],
        interviewQuestions: [
          'Explain the Monotonic Stack pattern and how it solves the Next Greater Element problem in O(N).',
          'How do you implement a Stack that returns the minimum element in O(1) time?'
        ]
      }
    ]
  },
  'queue': {
    introduction: 'A Queue is a linear structure following the FIFO (First In First Out) principle. Deques are double-ended queues supporting inputs and outputs at both boundaries.',
    conceptBreakdown: 'Covers queue implementations, sliding window aggregators, circular queues, and queue designs using Stacks.',
    relevance: 'Essential for BFS graph sweeps, thread pool schedulers, and sliding maximum values.',
    externalLinks: [
      { title: 'LeetCode Queue Tag', url: 'https://leetcode.com/tag/queue/' }
    ],
    subtopics: [
      {
        title: 'Sliding Window Maximum & Double Ended Queues',
        definition: 'A Deque (Double Ended Queue) permits insertions and deletions at both rear and front locations.',
        syntax: 'Deque<Integer> dq = new LinkedList<>();\ndq.addLast(val);\ndq.pollFirst();',
        codeSnippet: `import java.util.*;

public class SlidingMax {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || nums.length == 0) return new int[0];
        int n = nums.length;
        int[] result = new int[n - k + 1];
        int ri = 0;
        // Store indices in Deque
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            // Remove numbers out of range k
            if (!q.isEmpty() && q.peek() < i - k + 1) {
                q.poll();
            }
            // Remove smaller elements in range k
            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) {
                q.pollLast();
            }
            q.offer(i);
            if (i >= k - 1) {
                result[ri++] = nums[q.peek()];
            }
        }
        return result;
    }
}`,
        complexity: 'Sliding Window Maximum: O(N) time (each index is added and popped at most once), O(K) space.',
        commonMistakes: [
          'Using general Stack vectors when a highly performant ArrayDeque is preferred.',
          'Confusing poll() with peek() which unexpectedly drops queue elements.'
        ],
        interviewQuestions: [
          'Explain how to implement a Queue using two Stacks.',
          'Explain why ArrayDeque is generally preferred over LinkedList for standard Stack/Queue tasks.'
        ]
      }
    ]
  },
  'trees': {
    introduction: 'A Binary Tree is a non-linear data structure where each node has at most two children, referred to as left and right children.',
    conceptBreakdown: 'Node structures, depth-first traversals (pre, in, post order), breath-first traversals (level order), tree height, and tree properties.',
    relevance: 'Extremely popular FAANG coding challenge category due to recursion and node referencing.',
    externalLinks: [
      { title: 'LeetCode Tree Tag', url: 'https://leetcode.com/tag/tree/' }
    ],
    subtopics: [
      {
        title: 'Tree Traversals (DFS & BFS Level Order)',
        definition: 'DFS visits deep nodes recursively first (preorder, inorder, postorder). BFS visits nodes level-by-level using a tracking Queue.',
        syntax: 'void traverse(TreeNode root) { if (root == null) return; traverse(root.left); System.out.print(root.val); traverse(root.right); }',
        codeSnippet: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}

public class TreeUtils {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int levelSize = q.size();
            List<Integer> levelList = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode curr = q.poll();
                levelList.add(curr.val);
                if (curr.left != null) q.add(curr.left);
                if (curr.right != null) q.add(curr.right);
            }
            res.add(levelList);
        }
        return res;
    }
}`,
        complexity: 'DFS/BFS: O(N) time, O(W) space where W is the maximum width of the tree.',
        commonMistakes: [
          'Null pointer crashes during child node traversal (forgetting to verify if(root == null)).',
          'Confusing Inorder (LNR), Preorder (NLR), and Postorder (LRN) traversal sequences.'
        ],
        interviewQuestions: [
          'How do you calculate the maximum depth of a binary tree recursively?',
          'What is the difference between a binary tree and a binary search tree?'
        ]
      }
    ]
  },
  'bst': {
    introduction: 'A Binary Search Tree (BST) is a binary tree where left child node values are strictly less than parent nodes, and right child node values are strictly greater than parent nodes.',
    conceptBreakdown: 'BST lookups, insertion, deletion algorithms, floor/ceiling calculations, and self-balancing tree structures (AVL, Red-Black Trees).',
    relevance: 'Essential for log-time lookups, relational indexing databases, and range bounds searches.',
    externalLinks: [
      { title: 'LeetCode BST Tag', url: 'https://leetcode.com/tag/binary-search-tree/' }
    ],
    subtopics: [
      {
        title: 'BST Insertion, Lookup & Validation',
        definition: 'Lookups leverage BST properties to run in logarithmic time. Validation ensures all descendants respect upper and lower node value boundaries.',
        syntax: 'if (root.val < key) return search(root.right, key);',
        codeSnippet: `public class BSTUtils {
    public static boolean isValidBST(TreeNode root, long min, long max) {
        if (root == null) return true;
        if (root.val <= min || root.val >= max) return false;
        return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
    }
    
    public static TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insert(root.left, val);
        else root.right = insert(root.right, val);
        return root;
    }
}`,
        complexity: 'BST lookups: O(log N) average, O(N) worst case (skewed trees). Self-balancing guarantees O(log N).',
        commonMistakes: [
          'Validating BST only by comparing parent directly to left and right children (fails if a grandchild violates grandparent bounds).',
          'Failing to handle duplicate node values correctly.'
        ],
        interviewQuestions: [
          'How do you validate if a Binary Tree is a valid Binary Search Tree?',
          'Explain how BST deletion handles nodes with two child nodes.'
        ]
      }
    ]
  },
  'heap': {
    introduction: 'A Heap is a complete binary tree that satisfies the heap invariant: in a min-heap, keys of parent nodes are less than or equal to child node keys. In a max-heap, keys of parent nodes are greater than or equal to child keys.',
    conceptBreakdown: 'Binary Heap structures, max/min heaps, heapify operations, and standard heap-sort patterns.',
    relevance: 'Critical for Priority Queue operations, k-way lists merging, and streaming median finders.',
    externalLinks: [
      { title: 'LeetCode Heap Category', url: 'https://leetcode.com/tag/heap-priority-queue/' }
    ],
    subtopics: [
      {
        title: 'Heaps & Priority Queue Stream Processing',
        definition: 'PriorityQueue uses a binary heap to retrieve min/max elements in constant runtime.',
        syntax: 'PriorityQueue<Integer> pq = new PriorityQueue<>((a,b) -> b - a); // Max Heap',
        codeSnippet: `import java.util.PriorityQueue;

public class HeapKStream {
    public static int findKthLargest(int[] nums, int k) {
        // Min Heap
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int val : nums) {
            pq.add(val);
            if (pq.size() > k) {
                pq.poll(); // Evict smallest element
            }
        }
        return pq.peek();
    }
}`,
        complexity: 'Enqueue/Dequeue: O(log N). Peek: O(1). Find K-th Largest: O(N log K) time, O(K) space.',
        commonMistakes: [
          'Iterating through PriorityQueue directly using foreach loops expecting sorted order (PriorityQueue only guarantees sorted order on poll() extraction).',
          'Not writing custom comparators when inserting customized Object references.'
        ],
        interviewQuestions: [
          'Explain the Heapify operation and how to build a Heap from an array in O(N).',
          'Describe the algorithm for finding the median dynamically from a stream of numbers using Min and Max Heaps.'
        ]
      }
    ]
  },
  'hashing': {
    introduction: 'Hashing is a technique to map a large range of keys into a fixed size array of values using a hash function, facilitating instant data lookups.',
    conceptBreakdown: 'Hashcodes, equals/hashcode contracts, collision mitigations (chaining, open addressing), and sliding window subsets tracker.',
    relevance: 'Extremely popular for anagram checks, unique counting, and target pairs lookups.',
    externalLinks: [
      { title: 'LeetCode Hash Table Tag', url: 'https://leetcode.com/tag/hash-table/' }
    ],
    subtopics: [
      {
        title: 'Collision Resolution & Hashing Contracts',
        definition: 'Hashing maps keys. Collision occurs when different keys produce identical bucket indices, solved via Linked Lists or Open Addressing.',
        syntax: 'int bucketIndex = key.hashCode() % bucketCount;',
        codeSnippet: `import java.util.*;

public class HashContracts {
    static class Key {
        int id;
        String name;
        Key(int i, String n) { this.id = i; this.name = n; }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Key)) return false;
            Key other = (Key) o;
            return this.id == other.id && Objects.equals(this.name, other.name);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(id, name);
        }
    }
}`,
        complexity: 'Search/Insertion: O(1) average runtime, O(N) worst case.',
        commonMistakes: [
          'Overriding .equals() but not .hashCode(), causing key lookup mismatches in HashMaps.',
          'Using non-immutable fields inside hashCode computations (breaks index location if values edit).'
        ],
        interviewQuestions: [
          'What happens when two unequal keys return identical hashcode values in a Java HashMap?',
          'What is the contract between equals() and hashCode() in Java?'
        ]
      }
    ]
  },
  'graph': {
    introduction: 'A Graph is a non-linear data structure consisting of nodes (vertices) connected by edges. Graphs can be directed, undirected, weighted, or unweighted.',
    conceptBreakdown: 'Adjacency list/matrix, graph traversal (BFS, DFS), topological sorting, shortest path algorithms (Dijkstra, Bellman-Ford), and Minimum Spanning Trees (Kruskal, Prim).',
    relevance: 'Essential for social networking mapping, routes, and dependency builders.',
    externalLinks: [
      { title: 'LeetCode Graph Category', url: 'https://leetcode.com/tag/graph/' }
    ],
    subtopics: [
      {
        title: 'DFS/BFS, Topological Sort, Dijkstra & Kruskal',
        definition: 'DFS explores deep paths. BFS discovers short ranges. Topological sort orders dependencies linearly. Dijkstra calculates single-source shortest paths. Kruskal constructs Minimum Spanning Trees.',
        syntax: 'adj.get(u).add(v); // Adjacency list creation',
        codeSnippet: `import java.util.*;

public class GraphTraversals {
    public static void bfs(int start, List<List<Integer>> adj, boolean[] visited) {
        Queue<Integer> q = new LinkedList<>();
        q.add(start);
        visited[start] = true;
        while (!q.isEmpty()) {
            int curr = q.poll();
            for (int neighbor : adj.get(curr)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.add(neighbor);
                }
            }
        }
    }
}`,
        complexity: 'BFS/DFS: O(V + E) time, O(V) space. Dijkstra: O(E log V) using priority queue.',
        commonMistakes: [
          'Forgetting to track visited states, which causes infinite loops inside cyclic graphs.',
          'Using Dijkstra on graphs containing negative edge weights (requires Bellman-Ford).'
        ],
        interviewQuestions: [
          'Describe the algorithm for topological sorting and how it detects cycle dependencies in directed graphs.',
          'Explain Dijkstra\'s shortest path algorithm and how its priority queue optimizes node updates.'
        ]
      }
    ]
  },
  'trie': {
    introduction: 'A Trie (Prefix Tree) is an efficient information-retrieval data structure. It is used to store and search keys in a graph of character paths.',
    conceptBreakdown: 'Prefix key matching, character node children arrays, search auto-complete engines, and string dict lookups.',
    relevance: 'Extremely popular for building dictionary auto-completes, spell checkers, and routing lookups.',
    externalLinks: [
      { title: 'LeetCode Trie Tag', url: 'https://leetcode.com/tag/trie/' }
    ],
    subtopics: [
      {
        title: 'Trie Nodes, Insertion, & Prefix Search',
        definition: 'Tries represent character nodes where strings form paths down the character tree branches.',
        syntax: 'TrieNode[] children = new TrieNode[26];',
        codeSnippet: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}

public class Trie {
    private TrieNode root = new TrieNode();
    
    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) {
                curr.children[idx] = new TrieNode();
            }
            curr = curr.children[idx];
        }
        curr.isEndOfWord = true;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode curr = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return false;
            curr = curr.children[idx];
        }
        return true;
    }
}`,
        complexity: 'Insert/Search: O(L) where L is the length of the string. Space: O(AL * N) where AL is alphabet size and N is node counts.',
        commonMistakes: [
          'Using excessive memory when a HashMap children configuration would optimize sparse trie branches.',
          'Forgetting to toggle isEndOfWord flags upon inserting word endings.'
        ],
        interviewQuestions: [
          'Why are Tries faster than balanced BSTs or HashMaps for string prefix searches?',
          'Explain how auto-complete suggestions can be retrieved using a Trie + DFS.'
        ]
      }
    ]
  }
};
