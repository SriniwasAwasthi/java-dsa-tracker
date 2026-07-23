export interface ProgramExample {
  id: string;
  title: string;
  difficulty: 'Basic' | 'Easy' | 'Medium' | 'Hard';
  description: string;
  codeSnippet: string;
  challengePrompt: string;
  leetcodeUrl?: string;
}

export const PROGRAMS_BY_TOPIC: Record<string, ProgramExample[]> = {
  'java-basics': [
    {
      id: 'jb-1',
      title: 'Hello World & Basic Output',
      difficulty: 'Basic',
      description: 'Understanding the standard structure of a Java program, main method signature, and console printing.',
      codeSnippet: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java DSA Learner!");
    }
}`,
      challengePrompt: 'Modify the program to accept a command-line argument and print a customized greeting.'
    },
    {
      id: 'jb-2',
      title: 'Variables, Constants & Data Types',
      difficulty: 'Basic',
      description: 'Declaration, initialization, and usage of primitive data types (int, double, char, boolean, long).',
      codeSnippet: `public class DataTypes {
    public static void main(String[] args) {
        int age = 21;
        double gpa = 3.92;
        char grade = 'A';
        boolean isEnrolled = true;
        final double PI = 3.14159; // Constant
        System.out.println("GPA: " + gpa);
    }
}`,
      challengePrompt: 'Create a program that calculates the area of a circle using a final double variable for PI.'
    },
    {
      id: 'jb-3',
      title: 'Conditionals (if-else, switch-case)',
      difficulty: 'Basic',
      description: 'Control flow structures to make decisions based on boolean expressions.',
      codeSnippet: `public class GradeAssessor {
    public static void main(String[] args) {
        int score = 85;
        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C");
        }
    }
}`,
      challengePrompt: 'Implement a switch-case statement to print the name of the day of the week based on an integer input (1-7).'
    },
    {
      id: 'jb-4',
      title: 'Loops (for, while, do-while)',
      difficulty: 'Basic',
      description: 'Repeating a block of statements dynamically using iterative loops.',
      codeSnippet: `public class Iteration {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.print(i + " ");
        }
        
        int count = 5;
        while (count > 0) {
            count--;
        }
    }
}`,
      challengePrompt: 'Write a while loop that prints all even numbers between 1 and 50.'
    },
    {
      id: 'jb-5',
      title: 'Method Definition & Parameters',
      difficulty: 'Easy',
      description: 'Creating reusable code blocks with parameterized arguments and return statements.',
      codeSnippet: `public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        int result = add(12, 18);
        System.out.println("Result: " + result);
    }
}`,
      challengePrompt: 'Create a method called isPrime(int n) that returns true if the number is prime, and false otherwise.'
    },
    {
      id: 'jb-6',
      title: 'Input Scanner Parsing',
      difficulty: 'Easy',
      description: 'Reading values from the standard keyboard input dynamically during runtime.',
      codeSnippet: `import java.util.Scanner;

public class InputScanner {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter integer: ");
        int n = sc.nextInt();
        System.out.println("Double: " + (n * 2));
        sc.close();
    }
}`,
      challengePrompt: 'Read a full sentence using sc.nextLine() and count the number of words in it.'
    },
    {
      id: 'jb-7',
      title: 'Function Overloading',
      difficulty: 'Easy',
      description: 'Defining multiple methods with the same name but different signatures.',
      codeSnippet: `public class Overload {
    public static double multiply(double a, double b) {
        return a * b;
    }
    public static int multiply(int a, int b, int c) {
        return a * b * c;
    }
}`,
      challengePrompt: 'Create overloaded methods for calculating the area of a square (one int parameter) and a rectangle (two double parameters).'
    },
    {
      id: 'jb-8',
      title: 'Type Casting & Data Conversions',
      difficulty: 'Easy',
      description: 'Implicit vs explicit casting between incompatible types (e.g., double to int, int to String).',
      codeSnippet: `public class Casting {
    public static void main(String[] args) {
        double exactValue = 9.99;
        int floorValue = (int) exactValue; // Explicit truncation
        
        String numberStr = "123";
        int parsedInt = Integer.parseInt(numberStr);
    }
}`,
      challengePrompt: 'Take a floating-point score and round it to the nearest integer using explicit casting and Math.round.'
    },
    {
      id: 'jb-9',
      title: 'FizzBuzz Classic Implementation',
      difficulty: 'Easy',
      description: 'The standard evaluation challenge with division checks.',
      codeSnippet: `public class FizzBuzz {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0 && i % 5 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
      challengePrompt: 'Optimize the FizzBuzz program to use string concatenation to append words instead of having multiple if checks.',
      leetcodeUrl: 'https://leetcode.com/problems/fizz-buzz/'
    },
    {
      id: 'jb-10',
      title: 'Reverse an Integer',
      difficulty: 'Medium',
      description: 'Reversing numbers mathematically without treating them as Strings.',
      codeSnippet: `public class ReverseNumber {
    public static int reverse(int n) {
        int rev = 0;
        while (n != 0) {
            int pop = n % 10;
            n /= 10;
            rev = rev * 10 + pop;
        }
        return rev;
    }
}`,
      challengePrompt: 'Enhance this method to check for 32-bit signed integer overflow limits (return 0 on overflow).',
      leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/'
    }
  ],
  'java-oop': [
    {
      id: 'jo-1',
      title: 'Class & Object Instantiation',
      difficulty: 'Basic',
      description: 'Defining fields, constructor parameters, and basic state modeling.',
      codeSnippet: `class Student {
    String name;
    int rollNo;
    
    public Student(String name, int rollNo) {
        this.name = name;
        this.rollNo = rollNo;
    }
}`,
      challengePrompt: 'Add a displayDetails() method to the Student class to print all variables neatly.'
    },
    {
      id: 'jo-2',
      title: 'Encapsulation with Getters & Setters',
      difficulty: 'Easy',
      description: 'Restricting access to variables using private modifiers and safe accessors.',
      codeSnippet: `class BankAccount {
    private double balance;
    
    public double getBalance() { return balance; }
    public void deposit(double amt) {
        if (amt > 0) balance += amt;
    }
}`,
      challengePrompt: 'Add a withdraw(double amt) method that checks if the balance is sufficient and throws an exception on failure.'
    },
    {
      id: 'jo-3',
      title: 'Single & Multi-level Inheritance',
      difficulty: 'Easy',
      description: 'Using the "extends" keyword to create hierarchical relationships.',
      codeSnippet: `class Animal {
    void breathe() { System.out.println("Breathing..."); }
}
class Dog extends Animal {
    void bark() { System.out.println("Woof!"); }
}`,
      challengePrompt: 'Create a class structure where Puppy extends Dog, demonstrating multi-level inheritance.'
    },
    {
      id: 'jo-4',
      title: 'Polymorphism (Method Overriding)',
      difficulty: 'Easy',
      description: 'Providing a specific implementation of a parent method in a child class.',
      codeSnippet: `class Shape {
    void draw() { System.out.println("Drawing base shape"); }
}
class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing circle"); }
}`,
      challengePrompt: 'Add a Rectangle class that also overrides draw(), and create an array of Shape objects to call draw() polymorphically.'
    },
    {
      id: 'jo-5',
      title: 'Abstract Classes vs Interfaces',
      difficulty: 'Medium',
      description: 'Defining standard contracts with complete and partial implementations.',
      codeSnippet: `interface Vehicle {
    void startEngine();
}
abstract class Car implements Vehicle {
    abstract void rollWindow();
}`,
      challengePrompt: 'Implement a concrete class Sedan that extends Car and satisfies all required vehicle methods.'
    },
    {
      id: 'jo-6',
      title: 'Using "super" and "this" Keywords',
      difficulty: 'Easy',
      description: 'Invoking parent constructors and resolving variable scope ambiguities.',
      codeSnippet: `class Base {
    int id;
    Base(int id) { this.id = id; }
}
class Derived extends Base {
    String tag;
    Derived(int id, String tag) {
        super(id);
        this.tag = tag;
    }
}`,
      challengePrompt: 'Create a method in Derived that accesses the base class field id using super.id.'
    },
    {
      id: 'jo-7',
      title: 'Static Variables, Blocks, and Methods',
      difficulty: 'Easy',
      description: 'Variables and methods shared across all instances of a class.',
      codeSnippet: `class Config {
    static int hitCount = 0;
    static {
        System.out.println("Static Block Init");
    }
    static void increment() { hitCount++; }
}`,
      challengePrompt: 'Demonstrate how hitCount acts as a global class counter by initializing three instances and printing the count.'
    },
    {
      id: 'jo-8',
      title: 'Dynamic Method Dispatch',
      difficulty: 'Medium',
      description: 'Resolving method overriding calls at runtime instead of compile-time.',
      codeSnippet: `class Game {
    void play() { System.out.println("Playing base game"); }
}
class Chess extends Game {
    void play() { System.out.println("Playing chess match"); }
}`,
      challengePrompt: 'Initialize a variable of type Game using new Chess() and call play() to observe runtime resolution.'
    },
    {
      id: 'jo-9',
      title: 'Final Modifier (Variables, Methods, Classes)',
      difficulty: 'Easy',
      description: 'Preventing modification, method overriding, and class inheritance inheritance boundaries.',
      codeSnippet: `final class ImmutableToken {
    final String value;
    ImmutableToken(String val) { this.value = val; }
}`,
      challengePrompt: 'Try writing a subclass that extends ImmutableToken and document the compilation error in comments.'
    },
    {
      id: 'jo-10',
      title: 'Custom Exception Handler Design',
      difficulty: 'Medium',
      description: 'Extending Exception class to implement customized error flows.',
      codeSnippet: `class InvalidAgeException extends Exception {
    public InvalidAgeException(String msg) {
        super(msg);
    }
}`,
      challengePrompt: 'Write a validator method that checks age and throws InvalidAgeException if the age is less than 18.'
    }
  ],
  'java-collections': [
    {
      id: 'jc-1',
      title: 'ArrayList Dynamic Array Ops',
      difficulty: 'Easy',
      description: 'Adding, removing, and iterating over dynamic arrays.',
      codeSnippet: `import java.util.ArrayList;
public class ListExample {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("Java");
        list.add("DSA");
        System.out.println(list.get(0));
    }
}`,
      challengePrompt: 'Write a method to reverse an ArrayList in-place without using Collections.reverse.'
    },
    {
      id: 'jc-2',
      title: 'LinkedList as Double Queue',
      difficulty: 'Easy',
      description: 'Using LinkedList to efficiently add and remove elements from start or end.',
      codeSnippet: `import java.util.LinkedList;
public class LinkList {
    public static void main(String[] args) {
        LinkedList<Integer> list = new LinkedList<>();
        list.addFirst(10);
        list.addLast(20);
    }
}`,
      challengePrompt: 'Convert a LinkedList of integers into an array of primitives using standard streams.'
    },
    {
      id: 'jc-3',
      title: 'HashMap Key-Value Mapping',
      difficulty: 'Easy',
      description: 'Storing and fetching keys, handling default values, and iterating mappings.',
      codeSnippet: `import java.util.HashMap;
public class MapTest {
    public static void main(String[] args) {
        HashMap<String, Integer> counts = new HashMap<>();
        counts.put("Apples", 5);
        counts.put("Oranges", counts.getOrDefault("Oranges", 0) + 1);
    }
}`,
      challengePrompt: 'Count occurrences of words in a paragraph using a HashMap and print keys sorted alphabetically.'
    },
    {
      id: 'jc-4',
      title: 'HashSet for Deduplication',
      difficulty: 'Easy',
      description: 'Hashing set elements to filter duplicates instantly with O(1) membership check.',
      codeSnippet: `import java.util.HashSet;
public class Dedupe {
    public static void main(String[] args) {
        HashSet<Integer> unique = new HashSet<>();
        unique.add(10);
        unique.add(10); // Ignored
    }
}`,
      challengePrompt: 'Write a program to find if an array contains any duplicate values using a HashSet in O(n) time.'
    },
    {
      id: 'jc-5',
      title: 'PriorityQueue Heap Structure',
      difficulty: 'Medium',
      description: 'Using a min/max heap structure natively for constant-time access to the extreme element.',
      codeSnippet: `import java.util.PriorityQueue;
import java.util.Collections;
public class HeapTest {
    public static void main(String[] args) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        maxHeap.add(45);
    }
}`,
      challengePrompt: 'Implement a top-k elements tracker using a PriorityQueue with size bounded at k.'
    },
    {
      id: 'jc-6',
      title: 'Comparable vs Comparator',
      difficulty: 'Medium',
      description: 'Defining default order vs multiple external sorting configurations for custom objects.',
      codeSnippet: `import java.util.Comparator;
class Person implements Comparable<Person> {
    int age;
    public int compareTo(Person other) { return this.age - other.age; }
}
class NameComparator implements Comparator<Person> {
    public int compare(Person a, Person b) { return a.age - b.age; }
}`,
      challengePrompt: 'Sort an array of Person items by age ascending, and then by name descending using a composite Comparator.'
    },
    {
      id: 'jc-7',
      title: 'LinkedHashMap & LRU Cache Blueprint',
      difficulty: 'Medium',
      description: 'Preserving insertion or access order of elements within hash mappings.',
      codeSnippet: `import java.util.LinkedHashMap;
import java.util.Map;
public class LRUMap<K, V> extends LinkedHashMap<K, V> {
    private final int cap;
    public LRUMap(int cap) { super(cap, 0.75f, true); this.cap = cap; }
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) { return size() > cap; }
}`,
      challengePrompt: 'Build a fully working LRU Cache wrapper subclass with get and put operations.',
      leetcodeUrl: 'https://leetcode.com/problems/lru-cache/'
    },
    {
      id: 'jc-8',
      title: 'TreeMap & TreeSet Red-Black Order',
      difficulty: 'Medium',
      description: 'Self-balancing binary search tree based collections for range query operations.',
      codeSnippet: `import java.util.TreeMap;
public class Ranges {
    public static void main(String[] args) {
        TreeMap<Integer, String> tree = new TreeMap<>();
        tree.put(10, "Ten");
        System.out.println(tree.floorKey(11)); // Returns 10
    }
}`,
      challengePrompt: 'Find the closest matching server id from a dynamic ring database using TreeMap ceilingKey lookup.'
    },
    {
      id: 'jc-9',
      title: 'Deconstruct Collections.sort internal Timsort',
      difficulty: 'Medium',
      description: 'Understanding runtime complexity of standard JDK sorting structures.',
      codeSnippet: `import java.util.Collections;
import java.util.List;
import java.util.Arrays;
public class Sorter {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(4, 2, 9, 1);
        Collections.sort(list);
    }
}`,
      challengePrompt: 'Measure sorting time difference of 100,000 integers using dynamic ArrayList sorting vs standard native primitive Arrays.sort.'
    },
    {
      id: 'jc-10',
      title: 'Stack & Queue with Deque Interface',
      difficulty: 'Easy',
      description: 'Modern standard replacement for old java.util.Stack using double-ended queue mechanisms.',
      codeSnippet: `import java.util.ArrayDeque;
import java.util.Deque;
public class DoubleEnd {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10);
        stack.pop();
    }
}`,
      challengePrompt: 'Use ArrayDeque as a queue structure to reverse a string word-by-word.'
    }
  ],
  'recursion': [
    {
      id: 'rec-1',
      title: 'Factorial Calculation',
      difficulty: 'Basic',
      description: 'Simplest mathematical recursion proving base cases and subproblem stack execution.',
      codeSnippet: `public class RecFactorial {
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
      challengePrompt: 'Find the maximum n for which factorial fits inside a 32-bit signed integer.'
    },
    {
      id: 'rec-2',
      title: 'Fibonacci Tree Recursion',
      difficulty: 'Easy',
      description: 'Double recursion illustrating overlapping states and call branches.',
      codeSnippet: `public class Fib {
    public static int get(int n) {
        if (n <= 1) return n;
        return get(n - 1) + get(n - 2);
    }
}`,
      challengePrompt: 'Write down the call stack trace for get(4) and explain the exponential O(2^n) behavior.',
      leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/'
    },
    {
      id: 'rec-3',
      title: 'Sum of Digits',
      difficulty: 'Easy',
      description: 'Recursively peeling units and calling sub-division math.',
      codeSnippet: `public class DigitsSum {
    public static int sum(int n) {
        if (n == 0) return 0;
        return (n % 10) + sum(n / 10);
    }
}`,
      challengePrompt: 'Implement digital root (recursively sum digits until a single digit remains).'
    },
    {
      id: 'rec-4',
      title: 'String Reversal Recursively',
      difficulty: 'Easy',
      description: 'Dividing string into substrings and constructing backwards stack merges.',
      codeSnippet: `public class ReverseStr {
    public static String rev(String s) {
        if (s.isEmpty()) return s;
        return rev(s.substring(1)) + s.charAt(0);
    }
}`,
      challengePrompt: 'Formulate a recursive method that determines if a string is a palindrome.'
    },
    {
      id: 'rec-5',
      title: 'Tower of Hanoi Standard Blueprint',
      difficulty: 'Medium',
      description: 'Classic divide-and-conquer move sequences using recursive steps.',
      codeSnippet: `public class Hanoi {
    public static void solve(int n, char src, char helper, char dest) {
        if (n == 1) {
            System.out.println("Move disk 1 from " + src + " to " + dest);
            return;
        }
        solve(n-1, src, dest, helper);
        System.out.println("Move disk " + n + " from " + src + " to " + dest);
        solve(n-1, helper, src, dest);
    }
}`,
      challengePrompt: 'Calculate the total move count of 4 disks and write a general formula for n disks.'
    },
    {
      id: 'rec-6',
      title: 'Binary Power Execution O(log N)',
      difficulty: 'Medium',
      description: 'Divide exponent by two recursively to shrink stack iterations from linear to logarithmic.',
      codeSnippet: `public class BinaryPower {
    public static double pow(double x, int n) {
        if (n == 0) return 1.0;
        double half = pow(x, n / 2);
        if (n % 2 == 0) return half * half;
        return n > 0 ? x * half * half : (1.0 / x) * half * half;
    }
}`,
      challengePrompt: 'Trace the steps of pow(2, 10) and evaluate the number of operations.',
      leetcodeUrl: 'https://leetcode.com/problems/powx-n/'
    },
    {
      id: 'rec-7',
      title: 'Print Subsequences of a String',
      difficulty: 'Medium',
      description: 'Using the pick and leave choice pattern to generate all dynamic permutations.',
      codeSnippet: `public class Subsequences {
    public static void generate(String current, String remaining) {
        if (remaining.isEmpty()) {
            System.out.println(current);
            return;
        }
        generate(current + remaining.charAt(0), remaining.substring(1)); // Pick
        generate(current, remaining.substring(1)); // Leave
    }
}`,
      challengePrompt: 'Create a list of subsets from an array of integers instead of string characters.'
    },
    {
      id: 'rec-8',
      title: 'Grid Unique Paths O(2^(M+N))',
      difficulty: 'Medium',
      description: 'Moving exclusively right and down recursively to target corner grids.',
      codeSnippet: `public class Paths {
    public static int count(int r, int c) {
        if (r == 1 || c == 1) return 1;
        return count(r - 1, c) + count(r, c - 1);
    }
}`,
      challengePrompt: 'Optimize the exponential recursion using memoization (saving cell calculations in a 2D array).',
      leetcodeUrl: 'https://leetcode.com/problems/unique-paths/'
    },
    {
      id: 'rec-9',
      title: 'Josephus Circle Survival Problem',
      difficulty: 'Medium',
      description: 'Eliminating every kth person recursively in a dynamic circular formation.',
      codeSnippet: `public class Josephus {
    public static int safePosition(int n, int k) {
        if (n == 1) return 1;
        return (safePosition(n - 1, k) + k - 1) % n + 1;
    }
}`,
      challengePrompt: 'Trace Josephus safe spot for 7 people with k = 3.',
      leetcodeUrl: 'https://leetcode.com/problems/find-the-winner-of-the-circular-game/'
    },
    {
      id: 'rec-10',
      title: 'Generate Balanced Parentheses Pairs',
      difficulty: 'Hard',
      description: 'Constructing strings while respecting bounds on opened and closed brackets.',
      codeSnippet: `import java.util.ArrayList;
import java.util.List;
public class Parens {
    public static void generate(List<String> list, String str, int open, int close, int max) {
        if (str.length() == max * 2) {
            list.add(str);
            return;
        }
        if (open < max) generate(list, str + "(", open + 1, close, max);
        if (close < open) generate(list, str + ")", open, close + 1, max);
    }
}`,
      challengePrompt: 'Generate all combinations of valid braces for max = 3 and verify correctness.',
      leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/'
    }
  ],
  'arrays': [
    {
      id: 'arr-1',
      title: 'Find Minimum & Maximum',
      difficulty: 'Basic',
      description: 'Single-pass linear scan to capture extreme boundary integers.',
      codeSnippet: `public class Extremes {
    public static int[] find(int[] arr) {
        int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
        for (int x : arr) {
            if (x < min) min = x;
            if (x > max) max = x;
        }
        return new int[]{min, max};
    }
}`,
      challengePrompt: 'Perform the array scan using the minimum number of comparisons (pairs comparison).'
    },
    {
      id: 'arr-2',
      title: 'Reverse Array In-Place',
      difficulty: 'Easy',
      description: 'Double-pointer swaps advancing from outer limits inside.',
      codeSnippet: `public class Reverse {
    public static void arr(int[] nums) {
        int i = 0, j = nums.length - 1;
        while (i < j) {
            int tmp = nums[i];
            nums[i] = nums[j];
            nums[j] = tmp;
            i++; j--;
        }
    }
}`,
      challengePrompt: 'Reverse a subset of the array starting from index k to index m.'
    },
    {
      id: 'arr-3',
      title: 'Two Sum Target Matching',
      difficulty: 'Easy',
      description: 'O(N) search mapping indexes to lookup numbers in a hash repository.',
      codeSnippet: `import java.util.HashMap;
public class TwoSum {
    public static int[] get(int[] arr, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < arr.length; i++) {
            int diff = target - arr[i];
            if (map.containsKey(diff)) return new int[]{map.get(diff), i};
            map.put(arr[i], i);
        }
        return new int[0];
    }
}`,
      challengePrompt: 'Implement Two Sum for sorted input arrays in O(1) extra space using two pointer approaches.',
      leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
    },
    {
      id: 'arr-4',
      title: 'Move Zeroes to End',
      difficulty: 'Easy',
      description: 'Pointer partition shifting non-zero elements to front positions.',
      codeSnippet: `public class Shift {
    public static void zeroes(int[] arr) {
        int insertPos = 0;
        for (int x : arr) {
            if (x != 0) arr[insertPos++] = x;
        }
        while (insertPos < arr.length) arr[insertPos++] = 0;
    }
}`,
      challengePrompt: 'Solve the problem with minimum total array write operations.',
      leetcodeUrl: 'https://leetcode.com/problems/move-zeroes/'
    },
    {
      id: 'arr-5',
      title: 'Kadanes Subarray Algorithm',
      difficulty: 'Medium',
      description: 'Linear accumulation tracking global maxima versus current continuous elements.',
      codeSnippet: `public class Kadane {
    public static int maxSubArray(int[] nums) {
        int globalMax = nums[0], currMax = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currMax = Math.max(nums[i], currMax + nums[i]);
            globalMax = Math.max(globalMax, currMax);
        }
        return globalMax;
    }
}`,
      challengePrompt: 'Modify the method to also output the start and end indices of the contiguous subarray.',
      leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/'
    },
    {
      id: 'arr-6',
      title: 'Merge Sorted Array In-Place',
      difficulty: 'Medium',
      description: 'Merging values from rear endpoints inside a padded parent structure.',
      codeSnippet: `public class MergeSorted {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1, p2 = n - 1, curr = m + n - 1;
        while (p2 >= 0) {
            if (p1 >= 0 && nums1[p1] > nums2[p2]) {
                nums1[curr--] = nums1[p1--];
            } else {
                nums1[curr--] = nums2[p2--];
            }
        }
    }
}`,
      challengePrompt: 'Analyze the advantage of merging from the back vs shifting from the front.',
      leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/'
    },
    {
      id: 'arr-7',
      title: 'Rotate 2D Matrix Grid',
      difficulty: 'Medium',
      description: 'Transposing indices of a 2D array and reversing each vector row.',
      codeSnippet: `public class Rotate {
    public static void matrix(int[][] g) {
        int n = g.length;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int tmp = g[i][j];
                g[i][j] = g[j][i];
                g[j][i] = tmp;
            }
        }
    }
}`,
      challengePrompt: 'Complete the rotation to turn the matrix 90 degrees clockwise in O(1) space.',
      leetcodeUrl: 'https://leetcode.com/problems/rotate-image/'
    },
    {
      id: 'arr-8',
      title: 'Next Permutation Permutator',
      difficulty: 'Medium',
      description: 'Lexicographical order generation locating pivot boundaries.',
      codeSnippet: `public class Lexico {
    public void nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    }
}`,
      challengePrompt: 'Implement the full nextPermutation flow including pivot swaps and trailing reverses.',
      leetcodeUrl: 'https://leetcode.com/problems/next-permutation/'
    },
    {
      id: 'arr-9',
      title: 'Container with Most Water',
      difficulty: 'Medium',
      description: 'Optimized twin pointers shrinking area coordinates.',
      codeSnippet: `public class WaterContainer {
    public static int maxArea(int[] h) {
        int max = 0, l = 0, r = h.length - 1;
        while (l < r) {
            max = Math.max(max, Math.min(h[l], h[r]) * (r - l));
            if (h[l] < h[r]) l++; else r--;
        }
        return max;
    }
}`,
      challengePrompt: 'Explain mathematically why moving the smaller pointer guarantees finding potential bigger area.',
      leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/'
    },
    {
      id: 'arr-10',
      title: 'Find Duplicate Number O(N)',
      difficulty: 'Hard',
      description: 'Using Floyds cycle detection algorithm treating array entries as next pointers.',
      codeSnippet: `public class FloydDuplicate {
    public static int find(int[] arr) {
        int slow = arr[0], fast = arr[0];
        do {
            slow = arr[slow];
            fast = arr[arr[fast]];
        } while (slow != fast);
        return slow;
    }
}`,
      challengePrompt: 'Prove mathematically that starting a second slow pointer from origin will meet at the loop duplicate coordinate.',
      leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/'
    }
  ],
  'strings': [
    {
      id: 'str-1',
      title: 'String Declaration & Memory Pool',
      difficulty: 'Basic',
      description: 'String Pool, heap allocation differences, literal vs new Keyword.',
      codeSnippet: `public class PoolExample {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java"; // Same reference in pool
        String s3 = new String("Java"); // New object in heap
        System.out.println(s1 == s2); // true
        System.out.println(s1 == s3); // false
    }
}`,
      challengePrompt: 'Demonstrate how the intern() method forces String pool reference matching.'
    },
    {
      id: 'str-2',
      title: 'Valid Palindrome Scan',
      difficulty: 'Easy',
      description: 'Two-pointer approach skipping non-alphanumeric chars.',
      codeSnippet: `public class Palindrome {
    public static boolean is(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l++)) != Character.toLowerCase(s.charAt(r--))) return false;
        }
        return true;
    }
}`,
      challengePrompt: 'Determine if a string can be a palindrome by deleting at most one character.',
      leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/'
    },
    {
      id: 'str-3',
      title: 'StringBuilder Buffer Optimizations',
      difficulty: 'Easy',
      description: 'Avoiding the O(N^2) string concatenation trap in loops with dynamic buffers.',
      codeSnippet: `public class BufferOps {
    public static String repeat(String w, int count) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) sb.append(w);
        return sb.toString();
    }
}`,
      challengePrompt: 'Compare memory allocation rates of StringBuilder vs classic string concatenation for 50,000 concatenations.'
    },
    {
      id: 'str-4',
      title: 'Reverse Words in a Sentence',
      difficulty: 'Easy',
      description: 'Parsing space boundaries and appending tokens backwards.',
      codeSnippet: `public class RevWords {
    public static String process(String s) {
        String[] tokens = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = tokens.length - 1; i >= 0; i--) {
            sb.append(tokens[i]).append(i == 0 ? "" : " ");
        }
        return sb.toString();
    }
}`,
      challengePrompt: 'Reverse words in-place inside a character array without calling split().',
      leetcodeUrl: 'https://leetcode.com/problems/reverse-words-in-a-string/'
    },
    {
      id: 'str-5',
      title: 'Valid Anagram Counts',
      difficulty: 'Easy',
      description: 'O(N) count buckets using a small constant integer array mapping ASCII characters.',
      codeSnippet: `public class Anagram {
    public static boolean check(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int x : counts) if (x != 0) return false;
        return true;
    }
}`,
      challengePrompt: 'Optimize the anagram code to handle Unicode/extended characters using HashMaps.',
      leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/'
    },
    {
      id: 'str-6',
      title: 'Longest Common Prefix',
      difficulty: 'Easy',
      description: 'Horizontal or vertical matching of characters across strings.',
      codeSnippet: `public class PrefixMatch {
    public static String get(String[] strs) {
        if (strs.length == 0) return "";
        String p = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(p) != 0) p = p.substring(0, p.length() - 1);
        }
        return p;
    }
}`,
      challengePrompt: 'Solve longest common prefix using sorting (only compare lexicographically extreme first and last strings).',
      leetcodeUrl: 'https://leetcode.com/problems/longest-common-prefix/'
    },
    {
      id: 'str-7',
      title: 'Group Anagrams Together',
      difficulty: 'Medium',
      description: 'Hashing sorted character keys within a List mapping structure.',
      codeSnippet: `import java.util.*;
public class GroupAnagrams {
    public List<List<String>> group(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = String.valueOf(chars);
            map.putIfAbsent(key, new ArrayList<>());
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
      challengePrompt: 'Group anagrams using integer array frequency hash representation rather than sorting each string.',
      leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/'
    },
    {
      id: 'str-8',
      title: 'Longest Palindromic Substring',
      difficulty: 'Hard',
      description: 'Expanding outward around potential single or double odd/even indices.',
      codeSnippet: `public class Lps {
    public static String find(String s) {
        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        return s.substring(start, end + 1);
    }
}`,
      challengePrompt: 'Implement the expandAroundCenter helper method and return the correct longest substring.',
      leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/'
    },
    {
      id: 'str-9',
      title: 'Minimum Window Substring',
      difficulty: 'Hard',
      description: 'Sliding window structure expanding right and contracting left boundaries.',
      codeSnippet: `public class MinWindow {
    public String search(String s, String t) {
        int[] counts = new int[128];
        return "";
    }
}`,
      challengePrompt: 'Complete the O(N) sliding window solution to locate the smallest substring containing all characters in t.',
      leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/'
    },
    {
      id: 'str-10',
      title: 'KMP String Pattern Matcher',
      difficulty: 'Hard',
      description: 'O(N + M) substring search using the Longest Prefix Suffix (LPS) table skip optimization.',
      codeSnippet: `public class Kmp {
    public int[] getLps(String pat) {
        int[] lps = new int[pat.length()];
        return lps;
    }
}`,
      challengePrompt: 'Generate the LPS table and build the pattern scanning loop.',
      leetcodeUrl: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/'
    }
  ],
  'searching': [
    {
      id: 'sea-1',
      title: 'Linear Search Scan',
      difficulty: 'Basic',
      description: 'Sequential check on every index for searching values in O(N).',
      codeSnippet: `public class LinearSearch {
    public static int find(int[] arr, int k) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == k) return i;
        }
        return -1;
    }
}`,
      challengePrompt: 'Modify search to scan from both ends simultaneously to speed up avg case scans.'
    },
    {
      id: 'sea-2',
      title: 'Binary Search (Iterative)',
      difficulty: 'Easy',
      description: 'Logarithmic search halving search bounds (high/low bounds) at each step.',
      codeSnippet: `public class BinarySearch {
    public static int get(int[] arr, int k) {
        int l = 0, r = arr.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2; // Prevent overflow
            if (arr[mid] == k) return mid;
            if (arr[mid] < k) l = mid + 1; else r = mid - 1;
        }
        return -1;
    }
}`,
      challengePrompt: 'Explain why int mid = (l + r) / 2 might crash in large arrays and how the code above resolves it.',
      leetcodeUrl: 'https://leetcode.com/problems/binary-search/'
    },
    {
      id: 'sea-3',
      title: 'Binary Search (Recursive)',
      difficulty: 'Easy',
      description: 'Calling division checks recursively on index subsegments.',
      codeSnippet: `public class RecSearch {
    public static int search(int[] arr, int k, int l, int r) {
        if (l > r) return -1;
        int mid = l + (r - l) / 2;
        if (arr[mid] == k) return mid;
        if (arr[mid] < k) return search(arr, k, mid + 1, r);
        return search(arr, k, l, mid - 1);
    }
}`,
      challengePrompt: 'Compare memory storage overhead of iterative vs recursive binary searches.'
    },
    {
      id: 'sea-4',
      title: 'Find First & Last Position',
      difficulty: 'Medium',
      description: 'Using custom binary search bounds to target first and last extreme indices.',
      codeSnippet: `public class FirstLast {
    public static int findBound(int[] arr, int target, boolean first) {
        int l = 0, r = arr.length - 1, res = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (arr[mid] == target) {
                res = mid;
                if (first) r = mid - 1; else l = mid + 1;
            } else if (arr[mid] < target) l = mid + 1; else r = mid - 1;
        }
        return res;
    }
}`,
      challengePrompt: 'Write a wrapper to return the range array [firstIndex, lastIndex] of the target.',
      leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/'
    },
    {
      id: 'sea-5',
      title: 'Search in Rotated Array',
      difficulty: 'Medium',
      description: 'Binary search identifying which half of the array is uniformly sorted.',
      codeSnippet: `public class RotatedSearch {
    public int search(int[] arr, int target) {
        int l = 0, r = arr.length - 1;
        return -1;
    }
}`,
      challengePrompt: 'Complete the logic to find target element inside rotated arrays in O(log N).',
      leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
    },
    {
      id: 'sea-6',
      title: 'Find Peak Element',
      difficulty: 'Medium',
      description: 'Binary search comparing neighboring items to trace climbing slopes.',
      codeSnippet: `public class Peak {
    public static int find(int[] arr) {
        int l = 0, r = arr.length - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (arr[mid] > arr[mid + 1]) r = mid; else l = mid + 1;
        }
        return l;
    }
}`,
      challengePrompt: 'Trace the peak search logic for an array containing only declining values [5, 4, 3, 2, 1].',
      leetcodeUrl: 'https://leetcode.com/problems/find-peak-element/'
    },
    {
      id: 'sea-7',
      title: 'Search a 2D Matrix',
      difficulty: 'Medium',
      description: 'Treating a grid of columns and rows as a flat single dimensional index layout.',
      codeSnippet: `public class GridSearch {
    public boolean check(int[][] m, int target) {
        int r = m.length, c = m[0].length;
        int l = 0, h = r * c - 1;
        return false;
    }
}`,
      challengePrompt: 'Complete the lookup by mapping index to coordinate: row = mid / c, col = mid % c.',
      leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/'
    },
    {
      id: 'sea-8',
      title: 'Sqrt(x) implementation',
      difficulty: 'Medium',
      description: 'Binary search checking ranges from 1 to x for dynamic floor bounds.',
      codeSnippet: `public class Sqrt {
    public static int get(int x) {
        if (x < 2) return x;
        int l = 1, r = x / 2, res = 0;
        return res;
    }
}`,
      challengePrompt: 'Implement Newton\'s approximation method and compare its execution count vs binary search.',
      leetcodeUrl: 'https://leetcode.com/problems/sqrtx/'
    },
    {
      id: 'sea-9',
      title: 'Capacity To Ship Packages',
      difficulty: 'Hard',
      description: 'Binary search on answer space (min possible weight limit to max total weights).',
      codeSnippet: `public class ShipPackages {
    public int shipWithinDays(int[] weights, int days) {
        int l = 0, r = 0;
        return -1;
    }
}`,
      challengePrompt: 'Build the isPossibleHelper to evaluate if a target shipping speed satisfies constraints.',
      leetcodeUrl: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/'
    },
    {
      id: 'sea-10',
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      description: 'Binary search on partition split coordinates to find safe boundary fits.',
      codeSnippet: `public class MedianSorted {
    public double find(int[] a1, int[] a2) {
        return 0.0;
    }
}`,
      challengePrompt: 'Solve binary search partition split targeting O(log(min(M, N))) runtime bounds.',
      leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
    }
  ],
  'sorting': [
    {
      id: 'sor-1',
      title: 'Bubble Sort Pass',
      difficulty: 'Basic',
      description: 'O(N^2) sorting continually swapping adjacent out-of-order values.',
      codeSnippet: `public class Bubble {
    public static void sort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n-1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n-i-1; j++) {
                if (a[j] > a[j+1]) {
                    int tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
      challengePrompt: 'Implement an optimization that stops processing early if a pass completed without any swaps.'
    },
    {
      id: 'sor-2',
      title: 'Selection Sort Swap',
      difficulty: 'Easy',
      description: 'Continuously finding the minimum element from the unsorted part and placing it at the front.',
      codeSnippet: `public class Selection {
    public static void sort(int[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (a[j] < a[minIdx]) minIdx = j;
            }
            int tmp = a[minIdx]; a[minIdx] = a[i]; a[i] = tmp;
        }
    }
}`,
      challengePrompt: 'Analyze the total number of element swaps in selection sort vs bubble sort.'
    },
    {
      id: 'sor-3',
      title: 'Insertion Sort Shift',
      difficulty: 'Easy',
      description: 'Inserting elements from unsorted array into correct slot inside sorted prefix segment.',
      codeSnippet: `public class Insertion {
    public static void sort(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int k = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > k) {
                a[j+1] = a[j];
                j--;
            }
            a[j+1] = k;
        }
    }
}`,
      challengePrompt: 'Show why insertion sort has O(N) complexity for arrays that are already sorted.'
    },
    {
      id: 'sor-4',
      title: 'Merge Sort Recursion',
      difficulty: 'Medium',
      description: 'Divide and conquer recursively dividing sections and combining sorted lists.',
      codeSnippet: `public class MergeSort {
    public void sort(int[] a, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        sort(a, l, m);
        sort(a, m + 1, r);
        merge(a, l, m, r);
    }
}`,
      challengePrompt: 'Implement the merge helper method that copies elements into a temporary array and back.',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/'
    },
    {
      id: 'sor-5',
      title: 'Quick Sort Pivot Partitioner',
      difficulty: 'Medium',
      description: 'Selecting pivot elements and placing lesser items left, and greater items right.',
      codeSnippet: `public class Quick {
    public void sort(int[] a, int l, int r) {
        if (l < r) {
            int p = partition(a, l, r);
            sort(a, l, p - 1);
            sort(a, p + 1, r);
        }
    }
}`,
      challengePrompt: 'Implement the Lomuto partition algorithm using the last element as the pivot.',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/'
    },
    {
      id: 'sor-6',
      title: 'Heap Sort Implementation',
      difficulty: 'Medium',
      description: 'Creating a max-heap and continually extracting max elements to the end.',
      codeSnippet: `public class HeapSort {
    public void sort(int[] a) {
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);
    }
}`,
      challengePrompt: 'Implement the heapify helper method that restores the max-heap property recursively.',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/'
    },
    {
      id: 'sor-7',
      title: 'Kth Largest Element',
      difficulty: 'Medium',
      description: 'Using Quickselect (Quick Sort partition subsetting) to find elements in O(N).',
      codeSnippet: `public class QuickSelect {
    public int findKth(int[] a, int k) {
        return -1;
    }
}`,
      challengePrompt: 'Explain how Quickselect discards half of the partition array, achieving linear time on average.',
      leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
    },
    {
      id: 'sor-8',
      title: 'Counting Sort (Linear O(N))',
      difficulty: 'Medium',
      description: 'Sorting small-range positive integers using frequency coordinate lists.',
      codeSnippet: `public class CountSort {
    public static void sort(int[] a, int maxVal) {
        int[] count = new int[maxVal + 1];
        for (int x : a) count[x]++;
    }
}`,
      challengePrompt: 'Make counting sort stable by using prefix-sums to locate target indices.',
      leetcodeUrl: 'https://leetcode.com/problems/sort-an-array/'
    },
    {
      id: 'sor-9',
      title: 'Sort Colors (Dutch Flag)',
      difficulty: 'Medium',
      description: 'Three-way partitioning O(N) sorting of 0s, 1s, and 2s in O(1) space.',
      codeSnippet: `public class DutchFlag {
    public void sortColors(int[] a) {
        int l = 0, mid = 0, h = a.length - 1;
    }
}`,
      challengePrompt: 'Complete the element swap transitions for mid pointers comparing values.',
      leetcodeUrl: 'https://leetcode.com/problems/sort-colors/'
    },
    {
      id: 'sor-10',
      title: 'Dynamic Intervals Merge',
      difficulty: 'Hard',
      description: 'Sorting interval ranges and combining overlapping bounding numbers.',
      codeSnippet: `import java.util.Arrays;
public class MergeIntervals {
    public int[][] merge(int[][] ivs) {
        Arrays.sort(ivs, (a, b) -> Integer.compare(a[0], b[0]));
        return ivs;
    }
}`,
      challengePrompt: 'Solve interval merges using custom array builders.',
      leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/'
    }
  ],
  'linked-list': [
    {
      id: 'll-1',
      title: 'Node Structure Definition',
      difficulty: 'Basic',
      description: 'Creating nodes containing data and reference to next coordinates.',
      codeSnippet: `class Node {
    int val;
    Node next;
    Node(int v) { this.val = v; }
}`,
      challengePrompt: 'Write a class that supports traversing and printing all node values.'
    },
    {
      id: 'll-2',
      title: 'Linked List Insertions',
      difficulty: 'Easy',
      description: 'Adding elements at head, tail, or arbitrary index coordinates.',
      codeSnippet: `class LinkedListOps {
    Node head;
    void addHead(int v) {
        Node n = new Node(v);
        n.next = head;
        head = n;
    }
}`,
      challengePrompt: 'Write an addTail(int v) method that locates the last node and appends the new node.'
    },
    {
      id: 'll-3',
      title: 'Linked List Deletions',
      difficulty: 'Easy',
      description: 'Removing nodes from lists by rewiring neighboring next pointers.',
      codeSnippet: `class LinkedListDel {
    void deleteNode(Node target) {
        target.val = target.next.val;
        target.next = target.next.next;
    }
}`,
      challengePrompt: 'Delete a node containing data value target and sew remaining nodes together.',
      leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-linked-list/'
    },
    {
      id: 'll-4',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      description: 'Inverting next references using auxiliary pointers (curr, prev, next).',
      codeSnippet: `public class ReverseList {
    public static Node reverse(Node head) {
        Node prev = null, curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
      challengePrompt: 'Implement reversing a linked list recursively and compare runtime space with iterative solutions.',
      leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/'
    },
    {
      id: 'll-5',
      title: 'Floyds Cycle Loop Finder',
      difficulty: 'Medium',
      description: 'Using fast and slow pointers to detect cyclic pointer structures.',
      codeSnippet: `public class CycleDetect {
    public static boolean check(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
      challengePrompt: 'Return the exact starting node of the cycle if a loop exists.',
      leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/'
    },
    {
      id: 'll-6',
      title: 'Find Middle of List',
      difficulty: 'Easy',
      description: 'Finding the middle node of a list in a single pass using slow and fast pointer increments.',
      codeSnippet: `public class MiddleList {
    public static Node find(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
      challengePrompt: 'Find the nth node from the end of a linked list in a single pass.',
      leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/'
    },
    {
      id: 'll-7',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      description: 'Merging nodes from two sorted lists into a single sorted list using a dummy helper node.',
      codeSnippet: `public class MergeLists {
    public static Node merge(Node l1, Node l2) {
        Node dummy = new Node(0);
        Node curr = dummy;
        return dummy.next;
    }
}`,
      challengePrompt: 'Complete the sorted list merge and return the merged list head node.',
      leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/'
    },
    {
      id: 'll-8',
      title: 'Remove Nth Node From End',
      difficulty: 'Medium',
      description: 'Maintaining a gap of n nodes between slow and fast pointers to locate the node from end.',
      codeSnippet: `public class RemoveEndNode {
    public Node remove(Node head, int n) {
        Node dummy = new Node(0);
        dummy.next = head;
        return dummy.next;
    }
}`,
      challengePrompt: 'Complete the single-pass deletion of the nth node from the end.',
      leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
    },
    {
      id: 'll-9',
      title: 'Intersection of Two Lists',
      difficulty: 'Easy',
      description: 'Aligning pointers of two lists of different lengths to find the common intersection node.',
      codeSnippet: `public class IntersectionList {
    public Node getIntersect(Node headA, Node headB) {
        Node pA = headA, pB = headB;
        while (pA != pB) {
            pA = pA == null ? headB : pA.next;
            pB = pB == null ? headA : pB.next;
        }
        return pA;
    }
}`,
      challengePrompt: 'Explain why flipping pointers to alternative list heads guarantees they meet at the intersection point.',
      leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/'
    },
    {
      id: 'll-10',
      title: 'Merge K Sorted Lists',
      difficulty: 'Hard',
      description: 'Combining list fragments using a PriorityQueue min-heap sorting node values.',
      codeSnippet: `import java.util.PriorityQueue;
public class MergeKLists {
    public Node merge(Node[] lists) {
        PriorityQueue<Node> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        return null;
    }
}`,
      challengePrompt: 'Add nodes to PriorityQueue and sew together the k sorted lists.',
      leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/'
    }
  ],
  'stack': [
    {
      id: 'st-1',
      title: 'Array Stack Implementation',
      difficulty: 'Basic',
      description: 'Building custom Last In First Out lists using arrays.',
      codeSnippet: `class Stack {
    int[] a = new int[100];
    int top = -1;
    void push(int v) { a[++top] = v; }
    int pop() { return a[top--]; }
}`,
      challengePrompt: 'Support dynamic resizing of array stack when storage bounds are reached.'
    },
    {
      id: 'st-2',
      title: 'Valid Parentheses Parser',
      difficulty: 'Easy',
      description: 'Pushing openings, popping closes, checking bracket matches.',
      codeSnippet: `import java.util.Stack;
public class Balanced {
    public static boolean check(String s) {
        Stack<Character> st = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (st.isEmpty() || st.pop() != c) return false;
        }
        return st.isEmpty();
    }
}`,
      challengePrompt: 'Extend bracket validation to include square [] and curly {} braces.',
      leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/'
    },
    {
      id: 'st-3',
      title: 'Min Stack Design O(1)',
      difficulty: 'Medium',
      description: 'Using a helper min value stack to track local minima.',
      codeSnippet: `import java.util.Stack;
class MinStack {
    Stack<Integer> s = new Stack<>();
    Stack<Integer> min = new Stack<>();
    void push(int x) {
        s.push(x);
        if (min.isEmpty() || x <= min.peek()) min.push(x);
    }
}`,
      challengePrompt: 'Optimize the pop method to pop from min stack only if values match.',
      leetcodeUrl: 'https://leetcode.com/problems/min-stack/'
    },
    {
      id: 'st-4',
      title: 'Evaluate Postfix Expressions',
      difficulty: 'Medium',
      description: 'Stacking digits and popping pairs to evaluate mathematical operations.',
      codeSnippet: `import java.util.Stack;
public class Postfix {
    public static int eval(String[] tokens) {
        Stack<Integer> st = new Stack<>();
        return st.pop();
    }
}`,
      challengePrompt: 'Write a parser to support multiplication and division operators in postfix expressions.',
      leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
    },
    {
      id: 'st-5',
      title: 'Next Greater Element O(N)',
      difficulty: 'Medium',
      description: 'Using monotonic decreasing stacks to locate next extreme values.',
      codeSnippet: `import java.util.Stack;
public class NextGreater {
    public int[] find(int[] arr) {
        int[] res = new int[arr.length];
        Stack<Integer> st = new Stack<>();
        return res;
    }
}`,
      challengePrompt: 'Implement nextGreater element scan for circular array targets.',
      leetcodeUrl: 'https://leetcode.com/problems/next-greater-element-i/'
    },
    {
      id: 'st-6',
      title: 'Daily Temperatures Stack',
      difficulty: 'Medium',
      description: 'Finding wait days for warmer weather using index monotonic stack storage.',
      codeSnippet: `import java.util.Stack;
public class TempWait {
    public int[] solve(int[] t) {
        Stack<Integer> s = new Stack<>();
        return new int[0];
    }
}`,
      challengePrompt: 'Complete the temperature wait time solution.',
      leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/'
    },
    {
      id: 'st-7',
      title: 'Online Stock Span',
      difficulty: 'Medium',
      description: 'Dynamic calculations of price spans using continuous stack elements.',
      codeSnippet: `import java.util.Stack;
class StockSpanner {
    Stack<int[]> s = new Stack<>(); // pair: {price, span}
    public int next(int p) {
        int span = 1;
        return span;
    }
}`,
      challengePrompt: 'Implement the price span lookups in amortized O(1) time.',
      leetcodeUrl: 'https://leetcode.com/problems/online-stock-span/'
    },
    {
      id: 'st-8',
      title: 'Sort a Stack (Recursively)',
      difficulty: 'Medium',
      description: 'Sorting a stack of numbers using only recursive insert methods.',
      codeSnippet: `import java.util.Stack;
public class StackSort {
    public void sort(Stack<Integer> s) {
        if (s.isEmpty()) return;
        int t = s.pop();
        sort(s);
        insert(s, t);
    }
}`,
      challengePrompt: 'Implement the insert helper method that inserts values in sorted order.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/sort-a-stack/1'
    },
    {
      id: 'st-9',
      title: 'Simplify Unix Directory Path',
      difficulty: 'Medium',
      description: 'Splitting directory paths and resolving dot markers using stack lists.',
      codeSnippet: `import java.util.Stack;
public class UnixPath {
    public String simplify(String path) {
        Stack<String> s = new Stack<>();
        return "";
    }
}`,
      challengePrompt: 'Write path parsing and dot folder resolution logic.',
      leetcodeUrl: 'https://leetcode.com/problems/simplify-path/'
    },
    {
      id: 'st-10',
      title: 'Largest Rectangle in Histogram',
      difficulty: 'Hard',
      description: 'Monotonic increasing stack tracking widths and heights of rectangular shapes.',
      codeSnippet: `import java.util.Stack;
public class Histogram {
    public int maxArea(int[] h) {
        Stack<Integer> s = new Stack<>();
        return 0;
    }
}`,
      challengePrompt: 'Complete the largest area rectangle scan.',
      leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
    }
  ],
  'queue': [
    {
      id: 'qu-1',
      title: 'Array Circular Queue',
      difficulty: 'Easy',
      description: 'First In First Out list implementation reusing index ranges circularly.',
      codeSnippet: `class CircQueue {
    int[] a = new int[5];
    int f = 0, r = 0, size = 0;
    void enqueue(int v) {
        a[r] = v;
        r = (r + 1) % a.length;
        size++;
    }
}`,
      challengePrompt: 'Implement the dequeue method that frees elements and throws exceptions on empty queues.'
    },
    {
      id: 'qu-2',
      title: 'Queue using Stacks',
      difficulty: 'Easy',
      description: 'Creating standard FIFO queues using two helper LIFO stacks.',
      codeSnippet: `import java.util.Stack;
class MyQueue {
    Stack<Integer> in = new Stack<>();
    Stack<Integer> out = new Stack<>();
    void push(int x) { in.push(x); }
}`,
      challengePrompt: 'Complete pop and peek methods including stack transfers.',
      leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/'
    },
    {
      id: 'qu-3',
      title: 'Stack using Queues',
      difficulty: 'Easy',
      description: 'Creating standard LIFO stacks by rolling queue elements circularly.',
      codeSnippet: `import java.util.LinkedList;
import java.util.Queue;
class MyStack {
    Queue<Integer> q = new LinkedList<>();
    void push(int x) {
        q.add(x);
        for(int i = 1; i < q.size(); i++) q.add(q.poll());
    }
}`,
      challengePrompt: 'Implement pop and top methods for the queue-based stack.',
      leetcodeUrl: 'https://leetcode.com/problems/implement-stack-using-queues/'
    },
    {
      id: 'qu-4',
      title: 'First Unique Character in Stream',
      difficulty: 'Easy',
      description: 'Tracking char counts and dynamic order of characters using queues.',
      codeSnippet: `import java.util.Queue;
import java.util.LinkedList;
public class UniqueChar {
    public int firstUniqChar(String s) {
        Queue<Character> q = new LinkedList<>();
        return -1;
    }
}`,
      challengePrompt: 'Complete first unique lookup using frequency counts.',
      leetcodeUrl: 'https://leetcode.com/problems/first-unique-character-in-a-string/'
    },
    {
      id: 'qu-5',
      title: 'Sliding Window Maximum',
      difficulty: 'Hard',
      description: 'Deque storing index values monotonically decreasing prices.',
      codeSnippet: `import java.util.Deque;
import java.util.ArrayDeque;
public class SlideMax {
    public int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        return new int[0];
    }
}`,
      challengePrompt: 'Develop window shifts tracking monotonic values.',
      leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/'
    }
  ],
  'trees': [
    {
      id: 'tr-1',
      title: 'TreeNode Structure Definition',
      difficulty: 'Basic',
      description: 'Representing hierarchical structure nodes with left and right children references.',
      codeSnippet: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { this.val = v; }
}`,
      challengePrompt: 'Instantiate a small binary tree with 3 nodes and print root value.'
    },
    {
      id: 'tr-2',
      title: 'Pre-order, In-order, Post-order Traversal',
      difficulty: 'Easy',
      description: 'Traversing the binary tree in pre-order (root-left-right), in-order (left-root-right), or post-order (left-right-root) recursively.',
      codeSnippet: `public class TreeTraversals {
    void inorder(TreeNode root) {
        if (root == null) return;
        inorder(root.left);
        System.out.print(root.val + " ");
        inorder(root.right);
    }
}`,
      challengePrompt: 'Write recursive pre-order and post-order traversal methods.',
      leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/'
    },
    {
      id: 'tr-3',
      title: 'Level Order Traversal (BFS)',
      difficulty: 'Medium',
      description: 'Traversing tree nodes level by level using a queue (Breadth-First Search).',
      codeSnippet: `import java.util.*;
public class LevelOrder {
    public List<List<Integer>> traverse(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        return res;
    }
}`,
      challengePrompt: 'Complete the level order traversal loop and return the result lists.',
      leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
    },
    {
      id: 'tr-4',
      title: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      description: 'Finding the height of a binary tree recursively by calculating max depth of left and right subtrees.',
      codeSnippet: `public class MaxDepth {
    public static int get(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(get(root.left), get(root.right));
    }
}`,
      challengePrompt: 'Modify the method to check if the tree is height-balanced.',
      leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
    },
    {
      id: 'tr-5',
      title: 'Diameter of Binary Tree',
      difficulty: 'Medium',
      description: 'Finding the longest path between any two nodes in a tree recursively.',
      codeSnippet: `public class Diameter {
    int maxD = 0;
    public int find(TreeNode root) {
        depth(root);
        return maxD;
    }
    private int depth(TreeNode root) {
        if (root == null) return 0;
        int l = depth(root.left);
        int r = depth(root.right);
        maxD = Math.max(maxD, l + r);
        return 1 + Math.max(l, r);
    }
}`,
      challengePrompt: 'Verify why diameter calculation requires evaluating left + right heights at each node.',
      leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/'
    },
    {
      id: 'tr-6',
      title: 'Lowest Common Ancestor (LCA)',
      difficulty: 'Medium',
      description: 'Finding the lowest common ancestor node of two given nodes in a binary tree.',
      codeSnippet: `public class LcaTree {
    public TreeNode findLCA(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode l = findLCA(root.left, p, q);
        TreeNode r = findLCA(root.right, p, q);
        if (l != null && r != null) return root;
        return l != null ? l : r;
    }
}`,
      challengePrompt: 'Trace the LCA logic on a paper tree with nodes 1 to 7.',
      leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/'
    },
    {
      id: 'tr-7',
      title: 'Invert Binary Tree',
      difficulty: 'Easy',
      description: 'Swapping left and right children for every node in the tree recursively.',
      codeSnippet: `public class InvertTree {
    public TreeNode invert(TreeNode root) {
        if (root == null) return null;
        TreeNode tmp = root.left;
        root.left = invert(root.right);
        root.right = invert(tmp);
        return root;
    }
}`,
      challengePrompt: 'Invert a binary tree iteratively using a queue (BFS pattern) instead of recursion.',
      leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/'
    },
    {
      id: 'tr-8',
      title: 'Construct Tree from Pre/Inorder',
      difficulty: 'Hard',
      description: 'Rebuilding a unique binary tree from its pre-order and in-order traversal arrays.',
      codeSnippet: `public class ConstructTree {
    public TreeNode build(int[] pre, int[] in) {
        return null;
    }
}`,
      challengePrompt: 'Implement the recursive build logic using a HashMap for fast in-order index lookups.',
      leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'
    },
    {
      id: 'tr-9',
      title: 'Binary Tree Zigzag Traversal',
      difficulty: 'Medium',
      description: 'Traversing a binary tree level by level, reversing traversal direction at each level alternate.',
      codeSnippet: `import java.util.*;
public class Zigzag {
    public List<List<Integer>> traverse(TreeNode root) {
        return new ArrayList<>();
    }
}`,
      challengePrompt: 'Implement zigzag traversal using a double-ended queue (Deque).',
      leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/'
    },
    {
      id: 'tr-10',
      title: 'Serialize and Deserialize Tree',
      difficulty: 'Hard',
      description: 'Converting a binary tree into a string representation and parsing it back to rebuild the original tree.',
      codeSnippet: `public class Codec {
    public String serialize(TreeNode root) { return ""; }
    public TreeNode deserialize(String data) { return null; }
}`,
      challengePrompt: 'Implement pre-order based serializing and deserializing methods.',
      leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
    }
  ],
  'bst': [
    {
      id: 'bst-1',
      title: 'Binary Search Tree Lookups',
      difficulty: 'Easy',
      description: 'Exploiting BST properties (left < root < right) to search elements in O(log N).',
      codeSnippet: `public class BstSearch {
    public TreeNode search(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        if (val < root.val) return search(root.left, val);
        return search(root.right, val);
    }
}`,
      challengePrompt: 'Convert this lookup into an iterative loop that avoids recursion memory stack.',
      leetcodeUrl: 'https://leetcode.com/problems/search-in-a-binary-search-tree/'
    },
    {
      id: 'bst-2',
      title: 'BST Insertion Algorithm',
      difficulty: 'Easy',
      description: 'Locating the correct spot and appending new leaf nodes without violating BST rules.',
      codeSnippet: `public class BstInsert {
    public TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) root.left = insert(root.left, val);
        else root.right = insert(root.right, val);
        return root;
    }
}`,
      challengePrompt: 'Implement BST insertion iteratively.',
      leetcodeUrl: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/'
    },
    {
      id: 'bst-3',
      title: 'Validate BST Correctness',
      difficulty: 'Medium',
      description: 'Verifying BST constraints using lower and upper bounding values at each subtree node.',
      codeSnippet: `public class ValidateBst {
    public boolean isValid(TreeNode root) {
        return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean check(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return check(node.left, min, node.val) && check(node.right, node.val, max);
    }
}`,
      challengePrompt: 'Show why simply verifying left.val < root.val < right.val for every parent node is insufficient.',
      leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/'
    },
    {
      id: 'bst-4',
      title: 'Kth Smallest Element in BST',
      difficulty: 'Medium',
      description: 'Performing in-order traversal (which yields sorted elements) and tracking traversal counter.',
      codeSnippet: `public class KthSmallestBst {
    int count = 0, res = -1;
    public int find(TreeNode root, int k) {
        traverse(root, k);
        return res;
    }
    private void traverse(TreeNode node, int k) {
        if (node == null) return;
        traverse(node.left, k);
        if (++count == k) { res = node.val; return; }
        traverse(node.right, k);
    }
}`,
      challengePrompt: 'Solve kth smallest element iteratively using stack-based in-order traversal.',
      leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
    },
    {
      id: 'bst-5',
      title: 'Delete Node in BST',
      difficulty: 'Hard',
      description: 'Deleting nodes from BST and maintaining properties under three cases (leaf, one child, two children).',
      codeSnippet: `public class DeleteBst {
    public TreeNode delete(TreeNode root, int key) {
        return root;
    }
}`,
      challengePrompt: 'Implement node deletion, resolving the two-children case using the inorder successor.',
      leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-bst/'
    }
  ],
  'heap': [
    {
      id: 'hp-1',
      title: 'Binary Heap Structure',
      difficulty: 'Easy',
      description: 'Defining indices parent-child mapping for complete trees in array buffers.',
      codeSnippet: `class BinaryHeapIdx {
    int parent(int i) { return (i - 1) / 2; }
    int left(int i) { return 2 * i + 1; }
    int right(int i) { return 2 * i + 2; }
}`,
      challengePrompt: 'Write index mapping functions for a 1-indexed array heap representation.'
    },
    {
      id: 'hp-2',
      title: 'Min Heapify Operation',
      difficulty: 'Medium',
      description: 'Sifting down elements recursively to restore heap properties.',
      codeSnippet: `public class Heapify {
    void minHeapify(int[] a, int size, int i) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < size && a[l] < a[smallest]) smallest = l;
        if (r < size && a[r] < a[smallest]) smallest = r;
        if (smallest != i) {
            int tmp = a[i]; a[i] = a[smallest]; a[smallest] = tmp;
            minHeapify(a, size, smallest);
        }
    }
}`,
      challengePrompt: 'Implement maxHeapify and build a heap from an unsorted array in O(N).'
    },
    {
      id: 'hp-3',
      title: 'Kth Largest Element',
      difficulty: 'Medium',
      description: 'Using min-heaps (PriorityQueue) of size k to scan stream numbers.',
      codeSnippet: `import java.util.PriorityQueue;
public class KthLargest {
    public int find(int[] a, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : a) {
            pq.add(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
      challengePrompt: 'Explain why keeping PriorityQueue size at k bounds time complexity to O(N log K).',
      leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
    },
    {
      id: 'hp-4',
      title: 'Merge K Sorted Streams',
      difficulty: 'Hard',
      description: 'Min-heaps storing arrays references to merge arrays efficiently.',
      codeSnippet: `import java.util.PriorityQueue;
public class MergeStreams {
    class Element implements Comparable<Element> {
        int val, row, col;
        public int compareTo(Element o) { return val - o.val; }
    }
}`,
      challengePrompt: 'Write the complete merge logic for k lists using the Element PriorityQueue class above.',
      leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/'
    },
    {
      id: 'hp-5',
      title: 'Find Median from Data Stream',
      difficulty: 'Hard',
      description: 'Balancing element quantities across two heaps (min-heap and max-heap) in O(log N).',
      codeSnippet: `import java.util.PriorityQueue;
import java.util.Collections;
class MedianFinder {
    PriorityQueue<Integer> min = new PriorityQueue<>(); // larger half
    PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder()); // smaller half
}`,
      challengePrompt: 'Implement addNum and findMedian methods, ensuring heaps size differences never exceed 1.',
      leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/'
    }
  ],
  'hashing': [
    {
      id: 'hs-1',
      title: 'Direct Address Map',
      difficulty: 'Basic',
      description: 'Constant time table insertion using indices directly.',
      codeSnippet: `public class DirectMap {
    boolean[] table = new boolean[1000];
    void insert(int k) { table[k] = true; }
    boolean check(int k) { return table[k]; }
}`,
      challengePrompt: 'Show limitation of direct maps when keys are negative or very large (e.g., 10^9).'
    },
    {
      id: 'hs-2',
      title: 'Chaining Collision Solver',
      difficulty: 'Easy',
      description: 'Resolving hash collisions using array bucket lists.',
      codeSnippet: `import java.util.LinkedList;
public class ChainHash {
    LinkedList<Integer>[] buckets = new LinkedList[10];
    void add(int val) {
        int idx = val % buckets.length;
        if (buckets[idx] == null) buckets[idx] = new LinkedList<>();
        buckets[idx].add(val);
    }
}`,
      challengePrompt: 'Add a search method that loops over list items in the mapped bucket and returns true if found.'
    },
    {
      id: 'hs-3',
      title: 'HashMap Load Factor resizing',
      difficulty: 'Medium',
      description: 'Evaluating current storage capacities and doubling bucket table size.',
      codeSnippet: `public class ResizeHash {
    int size = 0, capacity = 16;
    double loadFactor = 0.75;
    void verifyResize() {
        if ((double)size / capacity >= loadFactor) {
            capacity *= 2;
        }
    }
}`,
      challengePrompt: 'Write rehash helper methods that distribute elements into the newly expanded bucket array.'
    },
    {
      id: 'hs-4',
      title: 'Subarray Sum Equals K',
      difficulty: 'Medium',
      description: 'O(N) search using hash maps storing prefix sums and their frequency count.',
      codeSnippet: `import java.util.HashMap;
public class SubarraySum {
    public int solve(int[] a, int k) {
        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;
        return count;
    }
}`,
      challengePrompt: 'Complete prefix sum checks and increment counts appropriately.',
      leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/'
    },
    {
      id: 'hs-5',
      title: 'Design HashSet From Scratch',
      difficulty: 'Medium',
      description: 'Implementing custom bucket listings and load distributions.',
      codeSnippet: `class MyHashSet {
    private final int BUCKETS = 1000;
    private LinkedList<Integer>[] parent;
}`,
      challengePrompt: 'Implement add, remove, and contains methods using custom hash keys.',
      leetcodeUrl: 'https://leetcode.com/problems/design-hashset/'
    }
  ],
  'graph': [
    {
      id: 'gr-1',
      title: 'Adjacency List Graph',
      difficulty: 'Basic',
      description: 'Creating graphs using lists of integer lists.',
      codeSnippet: `import java.util.ArrayList;
import java.util.List;
public class AdjacencyGraph {
    List<List<Integer>> adj = new ArrayList<>();
    void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u); // Undirected
    }
}`,
      challengePrompt: 'Implement graphs using Adjacency Matrices instead.'
    },
    {
      id: 'gr-2',
      title: 'Breadth First Search (BFS)',
      difficulty: 'Easy',
      description: 'Visiting neighbor vertices iteratively using FIFO queues.',
      codeSnippet: `import java.util.*;
public class BFS {
    void traverse(List<List<Integer>> adj, int start) {
        boolean[] vis = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();
        q.add(start); vis[start] = true;
    }
}`,
      challengePrompt: 'Complete the BFS traversal queue loop, printing nodes as they are visited.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1'
    },
    {
      id: 'gr-3',
      title: 'Depth First Search (DFS)',
      difficulty: 'Easy',
      description: 'Visiting vertex nodes recursively along individual branch paths.',
      codeSnippet: `import java.util.List;
public class DFS {
    void traverse(List<List<Integer>> adj, int node, boolean[] vis) {
        vis[node] = true;
        System.out.print(node + " ");
        for (int neighbor : adj.get(node)) {
            if (!vis[neighbor]) traverse(adj, neighbor, vis);
        }
    }
}`,
      challengePrompt: 'Rewrite DFS iteratively using stacks instead of recursion.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1'
    },
    {
      id: 'gr-4',
      title: 'Cycle Detection (Undirected)',
      difficulty: 'Medium',
      description: 'DFS cycle checks comparing parent pointers of visited vertices.',
      codeSnippet: `import java.util.List;
public class UndirectedCycle {
    boolean dfs(List<List<Integer>> adj, int node, int parent, boolean[] vis) {
        vis[node] = true;
        return false;
    }
}`,
      challengePrompt: 'Complete the undirected graph cycle check.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1'
    },
    {
      id: 'gr-5',
      title: 'Cycle Detection (Directed)',
      difficulty: 'Medium',
      description: 'Cycle check using recursive recursion stack tracking arrays.',
      codeSnippet: `import java.util.List;
public class DirectedCycle {
    boolean dfs(List<List<Integer>> adj, int node, boolean[] vis, boolean[] recStack) {
        return false;
    }
}`,
      challengePrompt: 'Complete dfs directed cycle checks.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1'
    },
    {
      id: 'gr-6',
      title: 'Topological Sort (Kahn Algorithm)',
      difficulty: 'Medium',
      description: 'O(V + E) scheduling of task dependencies using indegree queues.',
      codeSnippet: `import java.util.*;
public class Topological {
    public int[] sort(int n, List<List<Integer>> adj) {
        int[] inDegree = new int[n];
        return new int[0];
    }
}`,
      challengePrompt: 'Implement indegree increments and topological sort queue checks.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/topological-sort/1'
    },
    {
      id: 'gr-7',
      title: 'Dijkstras Shortest Path O(E log V)',
      difficulty: 'Hard',
      description: 'PriorityQueue optimization exploring paths of minimum cumulative weights.',
      codeSnippet: `import java.util.PriorityQueue;
public class Dijkstra {
    class Pair implements Comparable<Pair> {
        int node, dist;
        public int compareTo(Pair o) { return dist - o.dist; }
    }
}`,
      challengePrompt: 'Build Dijkstras distance updates queue processing loop.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-list/1'
    },
    {
      id: 'gr-8',
      title: 'Prims MST Algorithm',
      difficulty: 'Hard',
      description: 'PriorityQueue exploring minimum edge crossings to cover all nodes with minimal weights.',
      codeSnippet: `import java.util.PriorityQueue;
public class Prim {
    int findMST(int v, int[][] edges) {
        return 0;
    }
}`,
      challengePrompt: 'Complete Prims MST weight calculations.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1'
    },
    {
      id: 'gr-9',
      title: 'Kruskals MST (Union Find)',
      difficulty: 'Hard',
      description: 'Sorting edges and combining nodes dynamically avoiding cycle closures.',
      codeSnippet: `public class Kruskal {
    int findMST(int v, int[][] edges) {
        return 0;
    }
}`,
      challengePrompt: 'Complete Kruskals MST by sorting edges and implementing Union-by-Rank checks.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1'
    },
    {
      id: 'gr-10',
      title: 'Number of Islands DFS Grid',
      difficulty: 'Medium',
      description: 'Visiting land coordinate neighbors on 2D arrays of 0s and 1s.',
      codeSnippet: `public class IslandDFS {
    public int count(char[][] grid) {
        int count = 0;
        return count;
    }
}`,
      challengePrompt: 'Write grid coordinate boundary limits checking DFS helper to sink connected lands.',
      leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/'
    }
  ],
  'dp': [
    {
      id: 'dp-1',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      description: 'Fibonacci recurrence: solving paths to reach step n using subproblems (n-1) and (n-2).',
      codeSnippet: `public class Stairs {
    public int climb(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1; dp[2] = 2;
        for (int i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
        return dp[n];
    }
}`,
      challengePrompt: 'Optimize space complexity of climbing stairs to O(1) using only two rolling state variables.',
      leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/'
    },
    {
      id: 'dp-2',
      title: 'House Robber 1D DP',
      difficulty: 'Medium',
      description: 'Maximizing non-adjacent values: choose to rob current house or skip based on previous choices.',
      codeSnippet: `public class Robber {
    public int rob(int[] h) {
        if (h.length == 0) return 0;
        int[] dp = new int[h.length + 1];
        dp[1] = h[0];
        return dp[h.length];
    }
}`,
      challengePrompt: 'Complete the induction step: dp[i] = Math.max(dp[i-1], dp[i-2] + h[i-1]).',
      leetcodeUrl: 'https://leetcode.com/problems/house-robber/'
    },
    {
      id: 'dp-3',
      title: 'Coin Change Combination',
      difficulty: 'Medium',
      description: 'Finding the minimum coins required to make a target amount using 1D state array sweeps.',
      codeSnippet: `import java.util.Arrays;
public class CoinChange {
    public int getMin(int[] coins, int amt) {
        int[] dp = new int[amt + 1];
        Arrays.fill(dp, amt + 1);
        dp[0] = 0;
        return dp[amt];
    }
}`,
      challengePrompt: 'Implement DP loops to compute optimal coin combinations.',
      leetcodeUrl: 'https://leetcode.com/problems/coin-change/'
    },
    {
      id: 'dp-4',
      title: 'Longest Common Subsequence',
      difficulty: 'Hard',
      description: '2D grid matching character matches of two words horizontally and vertically.',
      codeSnippet: `public class LcsDP {
    public int find(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];
        return dp[m][n];
    }
}`,
      challengePrompt: 'Implement matching checks: if match, dp[i][j] = 1 + dp[i-1][j-1]; if mismatch, Math.max(dp[i-1][j], dp[i][j-1]).',
      leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/'
    },
    {
      id: 'dp-5',
      title: '0-1 Knapsack Classic',
      difficulty: 'Hard',
      description: 'Selecting items within weight limit capacities to maximize overall value.',
      codeSnippet: `public class Knapsack {
    int solve(int w, int[] wt, int[] val, int n) {
        int[][] dp = new int[n + 1][w + 1];
        return dp[n][w];
    }
}`,
      challengePrompt: 'Implement the nested value selections loop and space-optimize to a 1D array.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1'
    }
  ],
  'greedy': [
    {
      id: 'gy-1',
      title: 'Fractional Knapsack',
      difficulty: 'Medium',
      description: 'Sorting items by value-per-unit-weight ratio to maximize value with portions.',
      codeSnippet: `import java.util.Arrays;
class Item implements Comparable<Item> {
    int w, val;
    public int compareTo(Item o) {
        return Double.compare((double)o.val/o.w, (double)this.val/this.w);
    }
}`,
      challengePrompt: 'Compute total maximum fractional item weight selection value.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1'
    },
    {
      id: 'gy-2',
      title: 'N Meetings in One Room',
      difficulty: 'Medium',
      description: 'Sorting meeting intervals by finish times to fit the maximum possible sessions.',
      codeSnippet: `import java.util.Arrays;
class Meeting {
    int start, end;
    Meeting(int s, int e) { this.start = s; this.end = e; }
}`,
      challengePrompt: 'Sort meeting arrays and output the maximum number of meetings that can occur.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1'
    },
    {
      id: 'gy-3',
      title: 'Gas Station Circle Loop',
      difficulty: 'Medium',
      description: 'O(N) search identifying starting index candidate where remaining gas balances stay non-negative.',
      codeSnippet: `public class GasStation {
    public int solve(int[] gas, int[] cost) {
        int total = 0, curr = 0, start = 0;
        return -1;
    }
}`,
      challengePrompt: 'Track gas deficits and return the correct start index candidate.',
      leetcodeUrl: 'https://leetcode.com/problems/gas-station/'
    },
    {
      id: 'gy-4',
      title: 'Job Sequencing Problem',
      difficulty: 'Medium',
      description: 'Sorting jobs by profit descending and booking slots as close to deadlines as possible.',
      codeSnippet: `import java.util.Arrays;
class Job {
    int id, profit, deadline;
}`,
      challengePrompt: 'Book jobs in available slots, keeping track of overall profit.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1'
    },
    {
      id: 'gy-5',
      title: 'Huffman Coding Trees',
      difficulty: 'Hard',
      description: 'PriorityQueue accumulating low-frequency character nodes into prefix binary coding trees.',
      codeSnippet: `import java.util.PriorityQueue;
class HuffmanNode implements Comparable<HuffmanNode> {
    int freq;
    char c;
    HuffmanNode left, right;
    public int compareTo(HuffmanNode o) { return freq - o.freq; }
}`,
      challengePrompt: 'Assemble nodes into a binary tree structure and write a recursive encoder.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/huffman-encoding3345/1'
    }
  ],
  'backtracking': [
    {
      id: 'bk-1',
      title: 'Permutations Generator',
      difficulty: 'Medium',
      description: 'Swapping indices recursively to form every combination.',
      codeSnippet: `import java.util.*;
public class Permutations {
    public void generate(int[] nums, int l, List<List<Integer>> res) {
        if (l == nums.length) {
            // Add array clone
        }
    }
}`,
      challengePrompt: 'Complete the backtracking loop with index swaps, recursive call, and cleanup swap.',
      leetcodeUrl: 'https://leetcode.com/problems/permutations/'
    },
    {
      id: 'bk-2',
      title: 'N-Queens Solver',
      difficulty: 'Hard',
      description: 'Placing chess queens iteratively checking row, column, and diagonal threats.',
      codeSnippet: `public class NQueens {
    boolean isSafe(int[][] board, int row, int col) {
        return true;
    }
}`,
      challengePrompt: 'Complete row safety checks and write the backtrack search solver.',
      leetcodeUrl: 'https://leetcode.com/problems/n-queens/'
    },
    {
      id: 'bk-3',
      title: 'Sudoku Solver Helper',
      difficulty: 'Hard',
      description: 'Trial matching digits (1-9) checking box, column, and row validations.',
      codeSnippet: `public class Sudoku {
    boolean solve(char[][] board) {
        return false;
    }
}`,
      challengePrompt: 'Complete Sudoku backtracking cell validation methods.',
      leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/'
    },
    {
      id: 'bk-4',
      title: 'Subset Sum Combinations',
      difficulty: 'Medium',
      description: 'Traversing array indices selecting or skipping items to find sum targets.',
      codeSnippet: `public class SubsetsSum {
    void backtrack(int[] a, int idx, int currSum, int target) {
    }
}`,
      challengePrompt: 'Implement combination backtracking to track subsets matching target sum.',
      leetcodeUrl: 'https://leetcode.com/problems/combination-sum/'
    },
    {
      id: 'bk-5',
      title: 'Word Search DFS Grid',
      difficulty: 'Medium',
      description: 'Dynamic character check on 4-way grid neighbors backtracking letter usage.',
      codeSnippet: `public class WordSearch {
    boolean dfs(char[][] b, String w, int r, int c, int idx) {
        return false;
    }
}`,
      challengePrompt: 'Mask visited characters using dynamic XOR bounds, perform recursion, and restore characters.',
      leetcodeUrl: 'https://leetcode.com/problems/word-search/'
    }
  ],
  'bit-manipulation': [
    {
      id: 'bit-1',
      title: 'Power of Two Check',
      difficulty: 'Easy',
      description: 'Evaluating (n & (n - 1)) to check if there is exactly one set bit in binary representations.',
      codeSnippet: `public class PowerTwo {
    public static boolean check(int n) {
        if (n <= 0) return false;
        return (n & (n - 1)) == 0;
    }
}`,
      challengePrompt: 'Verify why n & (n - 1) resolves to 0 exclusively for powers of 2.',
      leetcodeUrl: 'https://leetcode.com/problems/power-of-two/'
    },
    {
      id: 'bit-2',
      title: 'Single Number O(N)',
      difficulty: 'Easy',
      description: 'Using XOR (a ^ a = 0; a ^ 0 = a) to locate unique numbers in duplicate lists.',
      codeSnippet: `public class SingleNumber {
    public static int find(int[] arr) {
        int xor = 0;
        for (int x : arr) xor ^= x;
        return xor;
    }
}`,
      challengePrompt: 'Find the single non-duplicate number where duplicate elements occur exactly three times.',
      leetcodeUrl: 'https://leetcode.com/problems/single-number/'
    },
    {
      id: 'bit-3',
      title: 'Count Set Bits (Hamming)',
      difficulty: 'Easy',
      description: 'Repeatedly shifting bits or clearing lowest bit to count 1s.',
      codeSnippet: `public class SetBits {
    public static int count(int n) {
        int count = 0;
        while (n != 0) {
            n = n & (n - 1); // Clears lowest set bit
            count++;
        }
        return count;
    }
}`,
      challengePrompt: 'Implement set bit count using standard bit shifts and compare performance.',
      leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/'
    },
    {
      id: 'bit-4',
      title: 'Toggle & Mask Specific Bit',
      difficulty: 'Easy',
      description: 'Using dynamic bitmasks (1 << k) to toggle, set, or clear kth bits.',
      codeSnippet: `public class Bitmask {
    int getBit(int n, int k) { return (n >> k) & 1; }
    int setBit(int n, int k) { return n | (1 << k); }
    int clearBit(int n, int k) { return n & ~(1 << k); }
}`,
      challengePrompt: 'Implement a method to toggle the kth bit of an integer.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/bit-difference-1587115620/1'
    },
    {
      id: 'bit-5',
      title: 'Reverse Bits',
      difficulty: 'Medium',
      description: 'Looping over 32 bit slots shifting output and OR-ing inputs.',
      codeSnippet: `public class RevBits {
    public int reverse(int n) {
        int res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>>= 1;
        }
        return res;
    }
}`,
      challengePrompt: 'Show difference between standard shift (>>) and unsigned logical shift (>>>) operators.',
      leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/'
    }
  ],
  'trie': [
    {
      id: 'tr-1',
      title: 'TrieNode Structure Design',
      difficulty: 'Easy',
      description: 'Creating characters nodes containing character child maps and isEndOfWord flag.',
      codeSnippet: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}`,
      challengePrompt: 'Modify TrieNode to support flexible word character lists using HashMap children.'
    },
    {
      id: 'tr-2',
      title: 'Insert Word in Trie',
      difficulty: 'Medium',
      description: 'Descending characters checking if children references exist, and marking leaf words.',
      codeSnippet: `public class TrieInsert {
    TrieNode root = new TrieNode();
    void insert(String w) {
        TrieNode curr = root;
        for (char c : w.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isWord = true;
    }
}`,
      challengePrompt: 'Write a search(String word) method that returns true if the word exists in the Trie.',
      leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
    },
    {
      id: 'tr-3',
      title: 'Prefix Match Search',
      difficulty: 'Medium',
      description: 'Scanning prefixes character-by-character to verify if sub-branches exist in the Trie.',
      codeSnippet: `public class TriePrefix {
    TrieNode root = new TrieNode();
    boolean startsWith(String p) {
        TrieNode curr = root;
        for (char c : p.toCharArray()) {
            TrieNode next = curr.children[c - 'a'];
            if (next == null) return false;
            curr = next;
        }
        return true;
    }
}`,
      challengePrompt: 'Write an autocomplete helper that returns all stored words matching a prefix.',
      leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
    },
    {
      id: 'tr-4',
      title: 'Word Dictionary Search',
      difficulty: 'Hard',
      description: 'Prefix search supporting dot "." wildcard matches using depth first traversal scans.',
      codeSnippet: `public class WordDictionary {
    boolean search(String w, TrieNode node, int idx) {
        return false;
    }
}`,
      challengePrompt: 'Implement recursive wildcard checks matching any trie child node index.',
      leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'
    },
    {
      id: 'tr-5',
      title: 'Maximum XOR Pair',
      difficulty: 'Hard',
      description: 'Storing binary bit patterns (0/1) in a Trie and traversing opposing bit paths to maximize XOR values.',
      codeSnippet: `class BinaryTrieNode {
    BinaryTrieNode[] children = new BinaryTrieNode[2];
}`,
      challengePrompt: 'Implement insert and findMaxXor methods for numbers streams.',
      leetcodeUrl: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/'
    }
  ],
  'advanced-topics': [
    {
      id: 'adv-1',
      title: 'Disjoint Set Union (DSU)',
      difficulty: 'Medium',
      description: 'Grouping disjoint elements and performing O(1) union-find operations with path compression.',
      codeSnippet: `class DSU {
    int[] parent, rank;
    DSU(int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
}`,
      challengePrompt: 'Implement unionByRank and write cycle detection checks for undirected graph edges.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/disjoint-set-du/1'
    },
    {
      id: 'adv-2',
      title: 'Segment Tree Range Sum',
      difficulty: 'Hard',
      description: 'Dividing arrays into nested coordinate trees to perform logarithmic range updates and query operations.',
      codeSnippet: `class SegmentTree {
    int[] tree;
    SegmentTree(int[] arr) {
        tree = new int[arr.length * 4];
    }
}`,
      challengePrompt: 'Write build, rangeQuery, and pointUpdate methods for sum queries.',
      leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-mutable/'
    },
    {
      id: 'adv-3',
      title: 'Fenwick Tree (BIT)',
      difficulty: 'Hard',
      description: 'Binary indexed tree storing prefix sum intervals using bit indexing arithmetic.',
      codeSnippet: `class BIT {
    int[] tree;
    void update(int i, int d) {
        for (; i < tree.length; i += i & -i) tree[i] += d;
    }
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
}`,
      challengePrompt: 'Write ranges queries using BIT calculations rangeSum(l, r) = query(r) - query(l-1).',
      leetcodeUrl: 'https://leetcode.com/problems/range-sum-query-mutable/'
    },
    {
      id: 'adv-4',
      title: 'Tarjans SCC Algorithm',
      difficulty: 'Hard',
      description: 'DFS traversal locating strongly connected components in directed graphs using stack tracking low values.',
      codeSnippet: `import java.util.Stack;
public class Tarjan {
    void dfs(int u, int[] disc, int[] low, Stack<Integer> st, boolean[] inStack) {
    }
}`,
      challengePrompt: 'Implement low link evaluations and pop matching SCC components.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/strongly-connected-components-tarjans-algo-1587115621/1'
    },
    {
      id: 'adv-5',
      title: 'Eulerian Path Graph Checks',
      difficulty: 'Hard',
      description: 'Verifying conditions (degree balances and connectivity checks) to traverse every graph edge exactly once.',
      codeSnippet: `import java.util.List;
public class Eulerian {
    boolean isEulerian(int v, List<List<Integer>> adj) {
        return false;
    }
}`,
      challengePrompt: 'Implement Eulerian path checks: count vertices with odd degrees and check connectivity.',
      leetcodeUrl: 'https://www.geeksforgeeks.org/problems/euler-circuit-and-path/1'
    }
  ]
};
