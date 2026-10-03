export type Channel = 'VMA' | 'VCS';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const channelInfo: Record<Channel, {
  name: string;
  handle: string;
  youtubeUrl: string;
  description: string;
  emoji: string;
  subscribers: string;
  tags: string[];
  borderColor: string;
  badgeClass: string;
  tagBadgeClass: string;
}> = {
  VMA: {
    name: 'Vikas Maurya Academy',
    handle: '@VikasMauryaAcademy',
    youtubeUrl: 'https://www.youtube.com/@VikasMauryaAcademy',
    description: 'GATE, PSU, reasoning, quants, and placement-focused academic content for Indian students.',
    emoji: '📚',
    subscribers: '450K subscribers',
    tags: ['GATE', 'PSU', 'Reasoning', 'Quants', 'Physics', 'Placement'],
    borderColor: 'border-green-light',
    badgeClass: 'badge-green',
    tagBadgeClass: 'badge-green',
  },
  VCS: {
    name: 'Vikas Coding School',
    handle: '@VikasCodingSchool',
    youtubeUrl: 'https://www.youtube.com/@VikasCodingSchool',
    description: 'Full stack, DSA, Python, AI/ML, React, Node.js — hands-on coding tutorials and projects.',
    emoji: '💻',
    subscribers: '380K subscribers',
    tags: ['Full Stack', 'DSA', 'Python', 'AI-ML', 'React', 'Node.js'],
    borderColor: 'border-blue-light',
    badgeClass: 'badge-blue',
    tagBadgeClass: 'badge-blue',
  },
};

export const externalSites = [
  { name: 'Anatomy Class', url: 'https://anatomy-class.vercel.app/', emoji: '🫀', description: 'Interactive anatomy learning platform' },
  { name: 'Algorithm Class', url: 'https://algorithmclass.vercel.app/', emoji: '🧮', description: 'Algorithm visualization and practice tool' },
];

export const youtubeEmbeds: Record<Channel, { videoId: string; title: string }[]> = {
  VMA: [
    { videoId: 'qz0aW3jX3Qg', title: 'GATE 2026 — Complete Syllabus Overview' },
    { videoId: '8mXqVBtQ9Zk', title: 'Operating Systems — Process Scheduling' },
    { videoId: '5p6Wq3xY9Nc', title: 'Aptitude — Time & Work Shortcut Tricks' },
    { videoId: '2mJ4qWtQ7Nc', title: 'DBMS — Normalization Made Easy' },
  ],
  VCS: [
    { videoId: 'Tn6WqXzQ9Kg', title: 'React Hooks Explained — useState to useReducer' },
    { videoId: '4mPqWtXzQ9Nc', title: 'Dynamic Programming — From Zero to Hero' },
    { videoId: '7mXqWtXzQ9Nc', title: 'Python for Beginners — Full Course' },
    { videoId: '9mXqWtXzQ9Nc', title: 'Node.js & Express — Build a REST API' },
  ],
};

export interface Course {
  id: string;
  title: string;
  description: string;
  channel: Channel;
  emoji: string;
  price: number; // 0 = free
  badge?: string;
  tags: string[];
  lessons: number;
  hours: number;
  students: number;
  rating: number;
  reviews: number;
  category: string;
  syllabus: { title: string; duration: string; free: boolean }[];
  whatYouWillLearn: string[];
  about: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  acceptance: number;
  tags: string[];
  companies: string[];
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  hints: string[];
  starterCode: Record<string, string>;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  channel: Channel;
  live: boolean;
  watching?: number;
  time: string;
  date: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  pages: number;
  size: string;
  free: boolean;
  emoji: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  type: string;
  posted: string;
  tech: string[];
  logo: string;
}

export interface Video {
  id: string;
  title: string;
  channel: Channel;
  duration: string;
  views: string;
  date: string;
  emoji: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  emoji: string;
  readTime: number;
  views: number;
  date: string;
  excerpt: string;
}

export interface Certificate {
  id: string;
  course: string;
  date: string;
  code: string;
  emoji: string;
}

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Complete GATE CSE Preparation 2026',
    description: 'Master all GATE CSE subjects — Data Structures, Algorithms, OS, DBMS, Computer Networks, TOC, and more with 500+ hours of content.',
    channel: 'VMA',
    emoji: '🎓',
    price: 0,
    badge: 'Bestseller',
    tags: ['GATE', 'PSU', 'Placement'],
    lessons: 320,
    hours: 500,
    students: 4200,
    rating: 4.9,
    reviews: 890,
    category: 'GATE & PSU Prep',
    syllabus: [
      { title: 'Introduction to GATE 2026', duration: '12:30', free: true },
      { title: 'Data Structures Overview', duration: '45:20', free: true },
      { title: 'Algorithms — Sorting & Searching', duration: '1:02:15', free: false },
      { title: 'Operating Systems — Process Management', duration: '55:40', free: false },
      { title: 'DBMS — Normalization & ER Diagrams', duration: '48:10', free: false },
      { title: 'Computer Networks — TCP/IP Model', duration: '52:30', free: false },
    ],
    whatYouWillLearn: [
      'Complete GATE CSE syllabus coverage',
      '500+ practice problems with solutions',
      'Previous year question analysis',
      'Mock tests with detailed solutions',
      'Time management strategies for GATE',
      'PSU interview preparation tips',
    ],
    about:
      'This comprehensive GATE CSE preparation course covers every topic in the GATE syllabus with detailed video lectures, practice problems, and mock tests. Designed for final-year students and working professionals aiming for PSUs and M.Tech admissions at IITs/NITs.',
  },
  {
    id: 'c2',
    title: 'Full Stack Web Development with MERN',
    description: 'Build production-ready web apps using MongoDB, Express, React, and Node.js. Includes 10 real-world projects and deployment.',
    channel: 'VCS',
    emoji: '💻',
    price: 2999,
    badge: 'Bestseller',
    tags: ['Full Stack', 'React', 'Node.js'],
    lessons: 180,
    hours: 120,
    students: 3100,
    rating: 4.8,
    reviews: 650,
    category: 'Full Stack Dev',
    syllabus: [
      { title: 'Course Introduction & Setup', duration: '15:00', free: true },
      { title: 'HTML, CSS & JavaScript Refresher', duration: '1:30:00', free: true },
      { title: 'React Fundamentals & Hooks', duration: '2:10:00', free: false },
      { title: 'Backend with Node.js & Express', duration: '1:45:00', free: false },
      { title: 'MongoDB & Mongoose', duration: '1:20:00', free: false },
      { title: 'Authentication & JWT', duration: '55:30', free: false },
      { title: 'Deployment with Docker & AWS', duration: '1:10:00', free: false },
    ],
    whatYouWillLearn: [
      'Build full-stack MERN applications from scratch',
      'Master React hooks, context, and routing',
      'Create RESTful APIs with Express & Node.js',
      'Design MongoDB schemas with Mongoose',
      'Implement JWT authentication & authorization',
      'Deploy apps with Docker, AWS, and CI/CD',
    ],
    about:
      'Become a job-ready full stack developer. This course takes you from basics to advanced MERN stack development with 10 real-world projects including an e-commerce app, a social media platform, and a real-time chat application.',
  },
  {
    id: 'c3',
    title: 'DSA Mastery — Data Structures & Algorithms',
    description: 'Complete DSA course covering arrays, linked lists, trees, graphs, DP, and more. Includes 500+ coding problems with video solutions.',
    channel: 'VCS',
    emoji: '🧩',
    price: 0,
    badge: 'Popular',
    tags: ['DSA', 'Coding', 'Interview'],
    lessons: 240,
    hours: 180,
    students: 5600,
    rating: 4.9,
    reviews: 1200,
    category: 'DSA Mastery',
    syllabus: [
      { title: 'Introduction to DSA', duration: '10:00', free: true },
      { title: 'Arrays & Two Pointers', duration: '45:30', free: true },
      { title: 'Linked Lists — Singly & Doubly', duration: '52:00', free: false },
      { title: 'Stacks & Queues', duration: '38:20', free: false },
      { title: 'Trees & BST', duration: '1:05:00', free: false },
      { title: 'Graphs — BFS, DFS, Shortest Path', duration: '1:20:00', free: false },
      { title: 'Dynamic Programming', duration: '1:45:00', free: false },
    ],
    whatYouWillLearn: [
      'Master all data structures from arrays to graphs',
      'Learn problem-solving patterns & techniques',
      'Solve 500+ coding problems with video solutions',
      'Crack coding interviews at top companies',
      'Understand time & space complexity analysis',
      'Build efficient algorithms from scratch',
    ],
    about:
      'The most comprehensive DSA course on the platform. Learn data structures and algorithms through animated explanations, coding problems, and interview-style questions. Perfect for placement preparation and competitive programming.',
  },
  {
    id: 'c4',
    title: 'Python & AI/ML Bootcamp',
    description: 'Learn Python from scratch, then dive into NumPy, Pandas, scikit-learn, and build ML models. Includes 5 AI projects.',
    channel: 'VCS',
    emoji: '🤖',
    price: 1999,
    badge: 'New',
    tags: ['Python', 'AI/ML', 'Data Science'],
    lessons: 150,
    hours: 90,
    students: 2800,
    rating: 4.7,
    reviews: 430,
    category: 'Python & AI/ML',
    syllabus: [
      { title: 'Python Basics & Setup', duration: '20:00', free: true },
      { title: 'OOP in Python', duration: '45:00', free: true },
      { title: 'NumPy & Pandas', duration: '1:15:00', free: false },
      { title: 'Data Visualization', duration: '40:00', free: false },
      { title: 'Machine Learning with scikit-learn', duration: '1:30:00', free: false },
      { title: 'Deep Learning with TensorFlow', duration: '1:50:00', free: false },
    ],
    whatYouWillLearn: [
      'Master Python programming from basics to advanced',
      'Data analysis with NumPy & Pandas',
      'Build ML models with scikit-learn',
      'Create neural networks with TensorFlow',
      'Deploy ML models to production',
      'Work on 5 real AI projects',
    ],
    about:
      'Start your AI/ML journey with this hands-on bootcamp. From Python basics to building and deploying machine learning models, this course covers everything you need to enter the world of artificial intelligence.',
  },
  {
    id: 'c5',
    title: 'DevOps & Cloud — AWS, Docker, Kubernetes',
    description: 'Master DevOps practices with CI/CD, containerization, orchestration, and cloud deployment on AWS.',
    channel: 'VCS',
    emoji: '☁️',
    price: 2499,
    tags: ['DevOps', 'AWS', 'Docker'],
    lessons: 110,
    hours: 75,
    students: 1900,
    rating: 4.8,
    reviews: 310,
    category: 'DevOps & Cloud',
    syllabus: [
      { title: 'DevOps Introduction', duration: '15:00', free: true },
      { title: 'Linux for DevOps', duration: '40:00', free: true },
      { title: 'Git & GitHub', duration: '35:00', free: false },
      { title: 'Docker & Containerization', duration: '1:10:00', free: false },
      { title: 'Kubernetes Orchestration', duration: '1:30:00', free: false },
      { title: 'AWS Cloud Services', duration: '1:45:00', free: false },
      { title: 'CI/CD with Jenkins & GitHub Actions', duration: '55:00', free: false },
    ],
    whatYouWillLearn: [
      'Master DevOps culture and practices',
      'Containerize apps with Docker',
      'Orchestrate with Kubernetes',
      'Deploy on AWS cloud infrastructure',
      'Set up CI/CD pipelines',
      'Monitor & log applications',
    ],
    about:
      'Become a DevOps engineer. Learn the complete DevOps lifecycle from source code management to deployment, monitoring, and scaling. This course is designed for developers looking to move into DevOps roles.',
  },
  {
    id: 'c6',
    title: 'Reasoning & Quantitative Aptitude',
    description: 'Master logical reasoning, quantitative aptitude, and verbal ability for placement tests, CAT, and competitive exams.',
    channel: 'VMA',
    emoji: '📊',
    price: 0,
    badge: 'Popular',
    tags: ['Aptitude', 'Reasoning', 'Placement'],
    lessons: 95,
    hours: 60,
    students: 3800,
    rating: 4.7,
    reviews: 520,
    category: 'Reasoning & Quants',
    syllabus: [
      { title: 'Quantitative Aptitude Basics', duration: '25:00', free: true },
      { title: 'Number System & Simplification', duration: '40:00', free: true },
      { title: 'Time, Speed & Distance', duration: '35:00', free: false },
      { title: 'Logical Reasoning — Puzzles', duration: '50:00', free: false },
      { title: 'Verbal Ability & Comprehension', duration: '45:00', free: false },
      { title: 'Data Interpretation', duration: '40:00', free: false },
    ],
    whatYouWillLearn: [
      'Master quantitative aptitude topics',
      'Solve logical reasoning puzzles',
      'Improve verbal ability skills',
      'Practice data interpretation',
      'Time-saving shortcuts & tricks',
      'Crack placement aptitude tests',
    ],
    about:
      'Aptitude tests are the first round in most placement drives. This course covers all topics — quantitative aptitude, logical reasoning, and verbal ability — with shortcut techniques and 1000+ practice problems.',
  },
];

export const problems: Problem[] = [
  {
    id: 'p1',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: 85,
    tags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'TCS'],
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
    ],
    hints: ['Try using a hash map to store seen values and their indices.', 'For each element, check if target - current value exists in the map.'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n};',
      python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p2',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    acceptance: 78,
    tags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Infosys'],
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'The reversed list is [5,4,3,2,1].' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'The reversed list is [2,1].' },
    ],
    hints: ['Use three pointers: prev, curr, and next.', 'Iterate through the list, reversing each link.'],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Write your code here\n};',
      python: 'def reverse_list(head):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p3',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptance: 72,
    tags: ['Stack', 'String'],
    companies: ['Google', 'Wipro'],
    description:
      'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'The parentheses are properly matched.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All brackets are properly matched.' },
      { input: 's = "(]"', output: 'false', explanation: 'The brackets are not of the same type.' },
    ],
    hints: ['Use a stack to track opening brackets.', 'When you see a closing bracket, check if it matches the top of the stack.'],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Write your code here\n};',
      python: 'def is_valid(s):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p4',
    slug: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Medium',
    acceptance: 68,
    tags: ['Tree', 'DFS', 'Stack'],
    companies: ['Accenture', 'Cognizant'],
    description:
      'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    examples: [
      { input: 'root = [1,null,2,3]', output: '[1,3,2]', explanation: 'Inorder traversal visits left, root, then right.' },
    ],
    hints: ['Try both recursive and iterative approaches.', 'For iterative, use a stack to simulate the call stack.'],
    starterCode: {
      javascript: 'function inorderTraversal(root) {\n  // Write your code here\n};',
      python: 'def inorder_traversal(root):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> inorderTraversal(TreeNode* root) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p5',
    slug: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    acceptance: 62,
    tags: ['String', 'Sliding Window', 'Hash Table'],
    companies: ['Google', 'Amazon'],
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    hints: ['Use a sliding window approach.', 'Maintain a set of characters in the current window.'],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Write your code here\n};',
      python: 'def length_of_longest_substring(s):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p6',
    slug: 'median-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    acceptance: 35,
    tags: ['Array', 'Binary Search', 'Divide & Conquer'],
    companies: ['Google', 'Amazon'],
    description:
      'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'Merged array = [1,2,3], median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'Merged array = [1,2,3,4], median is (2+3)/2 = 2.5.' },
    ],
    hints: ['Use binary search on the smaller array.', 'Partition both arrays such that left half elements are smaller than right half.'],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n};',
      python: 'def find_median_sorted_arrays(nums1, nums2):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p7',
    slug: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    acceptance: 42,
    tags: ['Linked List', 'Heap', 'Divide & Conquer'],
    companies: ['Amazon', 'Google'],
    description:
      'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All lists merged and sorted.' },
    ],
    hints: ['Use a min-heap to efficiently get the smallest element.', 'Alternatively, use divide and conquer to merge pairs of lists.'],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  // Write your code here\n};',
      python: 'def merge_k_lists(lists):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Write your code here\n    }\n};',
    },
  },
  {
    id: 'p8',
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    acceptance: 70,
    tags: ['Array', 'Dynamic Programming'],
    companies: ['TCS', 'Infosys', 'Accenture'],
    description:
      'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
    ],
    hints: ['Use Kadane\'s algorithm.', 'Keep track of the current sum and the maximum sum seen so far.'],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  // Write your code here\n};',
      python: 'def max_sub_array(nums):\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n    }\n};',
    },
  },
];

export const liveClasses: LiveClass[] = [
  {
    id: 'l1',
    title: 'Accenture Placement Prep — Mock Interview Round',
    description: 'Live mock interview session covering technical and HR rounds for Accenture placement.',
    channel: 'VMA',
    live: true,
    watching: 238,
    time: 'Live Now',
    date: 'Today',
  },
  {
    id: 'l2',
    title: 'GATE 2026 — Operating Systems Doubt Session',
    description: 'Open doubt session for OS topics — process scheduling, deadlocks, memory management.',
    channel: 'VMA',
    live: false,
    time: '6:00 PM',
    date: 'Tomorrow',
  },
  {
    id: 'l3',
    title: 'React Hooks Deep Dive — Live Coding',
    description: 'Build a real-time app using useState, useEffect, useReducer, and useContext live.',
    channel: 'VCS',
    live: false,
    time: '7:30 PM',
    date: 'Aug 20',
  },
  {
    id: 'l4',
    title: 'DSA Contest Solutions — Weekly Roundup',
    description: 'Walkthrough of the weekly contest problems with optimal solutions.',
    channel: 'VCS',
    live: false,
    time: '5:00 PM',
    date: 'Aug 21',
  },
];

export const notes: Note[] = [
  { id: 'n1', title: 'Data Structures — Complete Notes', subject: 'DSA', pages: 120, size: '2.4 MB', free: true, emoji: '📋' },
  { id: 'n2', title: 'Operating Systems — Quick Revision', subject: 'OS', pages: 85, size: '1.8 MB', free: true, emoji: '⚙️' },
  { id: 'n3', title: 'DBMS — Normalization Cheat Sheet', subject: 'DBMS', pages: 45, size: '920 KB', free: true, emoji: '🗄️' },
  { id: 'n4', title: 'Computer Networks — TCP/IP Model', subject: 'Networks', pages: 60, size: '1.2 MB', free: false, emoji: '🌐' },
  { id: 'n5', title: 'Algorithms — Time Complexity Sheet', subject: 'Algorithms', pages: 30, size: '640 KB', free: true, emoji: '⏱️' },
  { id: 'n6', title: 'Python — 100 Programs with Solutions', subject: 'Python', pages: 150, size: '3.1 MB', free: false, emoji: '🐍' },
  { id: 'n7', title: 'Aptitude — Shortcut Tricks', subject: 'Aptitude', pages: 70, size: '1.4 MB', free: true, emoji: '🧮' },
  { id: 'n8', title: 'React — Hooks Reference Card', subject: 'React', pages: 25, size: '480 KB', free: false, emoji: '⚛️' },
];

export const jobs: Job[] = [
  { id: 'j1', title: 'Software Engineer', company: 'TCS', location: 'Bangalore, India', experience: '0-2 years', salary: '₹3.5-5.0 LPA', type: 'Fresher', posted: '2 days ago', tech: ['Java', 'SQL', 'Spring Boot'], logo: '🏢' },
  { id: 'j2', title: 'Full Stack Developer', company: 'Infosys', location: 'Pune, India', experience: '0-1 years', salary: '₹4.0-6.0 LPA', type: 'Fresher', posted: '1 day ago', tech: ['React', 'Node.js', 'MongoDB'], logo: '💻' },
  { id: 'j3', title: 'Software Developer Intern', company: 'Accenture', location: 'Remote', experience: 'Internship', salary: '₹25,000/mo', type: 'Internship', posted: '3 hours ago', tech: ['Python', 'AWS', 'Docker'], logo: '☁️' },
  { id: 'j4', title: 'Junior Data Scientist', company: 'Wipro', location: 'Hyderabad, India', experience: '0-2 years', salary: '₹5.0-8.0 LPA', type: 'Fresher', posted: '5 days ago', tech: ['Python', 'ML', 'Pandas'], logo: '📊' },
  { id: 'j5', title: 'Frontend Developer', company: 'Capgemini', location: 'Remote', experience: '1-3 years', salary: '₹6.0-10.0 LPA', type: 'Remote', posted: '1 week ago', tech: ['React', 'TypeScript', 'CSS'], logo: '🎨' },
  { id: 'j6', title: 'Backend Engineer', company: 'Cognizant', location: 'Chennai, India', experience: '0-2 years', salary: '₹4.5-7.0 LPA', type: 'Campus', posted: '4 days ago', tech: ['Java', 'Spring', 'PostgreSQL'], logo: '🔧' },
  { id: 'j7', title: 'Cloud DevOps Engineer', company: 'HCL', location: 'Noida, India', experience: '1-3 years', salary: '₹7.0-12.0 LPA', type: 'Fresher', posted: '2 days ago', tech: ['AWS', 'Kubernetes', 'Terraform'], logo: '☁️' },
  { id: 'j8', title: 'SDE Intern', company: 'Amazon', location: 'Bangalore, India', experience: 'Internship', salary: '₹40,000/mo', type: 'Internship', posted: '6 hours ago', tech: ['Java', 'DSA', 'System Design'], logo: '📦' },
];

export const videos: Video[] = [
  { id: 'v1', title: 'GATE 2026 — Complete Syllabus Overview', channel: 'VMA', duration: '45:20', views: '125K views', date: '2 weeks ago', emoji: '🎓' },
  { id: 'v2', title: 'React Hooks Explained — useState to useReducer', channel: 'VCS', duration: '32:15', views: '89K views', date: '1 week ago', emoji: '⚛️' },
  { id: 'v3', title: 'Dynamic Programming — From Zero to Hero', channel: 'VCS', duration: '1:02:30', views: '210K views', date: '3 weeks ago', emoji: '🧩' },
  { id: 'v4', title: 'Operating Systems — Process Scheduling', channel: 'VMA', duration: '28:40', views: '67K views', date: '5 days ago', emoji: '⚙️' },
  { id: 'v5', title: 'Python for Beginners — Full Course', channel: 'VCS', duration: '1:45:00', views: '340K views', date: '1 month ago', emoji: '🐍' },
  { id: 'v6', title: 'Aptitude — Time & Work Shortcut Tricks', channel: 'VMA', duration: '22:10', views: '95K views', date: '4 days ago', emoji: '🧮' },
  { id: 'v7', title: 'Node.js & Express — Build a REST API', channel: 'VCS', duration: '55:30', views: '78K views', date: '2 weeks ago', emoji: '🟢' },
  { id: 'v8', title: 'DBMS — Normalization Made Easy', channel: 'VMA', duration: '38:20', views: '112K views', date: '1 week ago', emoji: '🗄️' },
  { id: 'v9', title: 'Docker for Beginners — Hands-On Tutorial', channel: 'VCS', duration: '42:00', views: '56K views', date: '3 days ago', emoji: '🐳' },
];

export const blogPosts: BlogPost[] = [
  { id: 'b1', slug: 'cracking-tcs-interview', title: 'How to Crack the TCS NQT Interview in 2026', category: 'Interview', emoji: '🎯', readTime: 8, views: 12500, date: 'Aug 10, 2026', excerpt: 'A complete guide to cracking the TCS NQT interview — from aptitude to technical to HR round.' },
  { id: 'b2', slug: 'react-performance', title: '10 React Performance Optimization Techniques', category: 'Tutorial', emoji: '⚡', readTime: 12, views: 8900, date: 'Aug 8, 2026', excerpt: 'Learn how to optimize your React apps with memoization, lazy loading, virtualization, and more.' },
  { id: 'b3', slug: 'gate-prep-strategy', title: 'GATE 2026 — 6-Month Preparation Strategy', category: 'Career', emoji: '🎓', readTime: 10, views: 21000, date: 'Aug 5, 2026', excerpt: 'A month-by-month preparation plan to crack GATE CSE with a top rank.' },
  { id: 'b4', slug: 'system-design-basics', title: 'System Design Basics Every Developer Should Know', category: 'Tutorial', emoji: '🏗️', readTime: 15, views: 15600, date: 'Aug 3, 2026', excerpt: 'Understand scalability, load balancing, caching, and database sharding for system design interviews.' },
  { id: 'b5', slug: 'amazon-sde-interview', title: 'Amazon SDE Interview — Complete Breakdown', category: 'Interview', emoji: '📦', readTime: 11, views: 18900, date: 'Aug 1, 2026', excerpt: 'Everything you need to know about the Amazon SDE interview process — OA, technical, and leadership rounds.' },
  { id: 'b6', slug: 'switching-to-devops', title: 'Switching from Developer to DevOps — A Roadmap', category: 'Career', emoji: '🚀', readTime: 9, views: 7200, date: 'Jul 28, 2026', excerpt: 'A step-by-step roadmap for developers looking to transition into DevOps roles.' },
];

export const certificates: Certificate[] = [
  { id: 'cert1', course: 'DSA Mastery — Data Structures & Algorithms', date: 'Aug 12, 2026', code: 'VMA-DSA-2026-8F3A2B', emoji: '🧩' },
  { id: 'cert2', course: 'Reasoning & Quantitative Aptitude', date: 'Jul 30, 2026', code: 'VMA-APT-2026-3C7D9E', emoji: '📊' },
];

export const leaderboard = [
  { rank: 1, name: 'Arjun Sharma', college: 'IIT Delhi', solved: 487, streak: 42 },
  { rank: 2, name: 'Priya Nair', college: 'NIT Trichy', solved: 472, streak: 38 },
  { rank: 3, name: 'Rohit Kumar', college: 'BITS Pilani', solved: 465, streak: 35 },
  { rank: 4, name: 'Sneha Reddy', college: 'IIIT Hyderabad', solved: 451, streak: 29 },
  { rank: 5, name: 'Karthik Iyer', college: 'VIT Vellore', solved: 440, streak: 27 },
  { rank: 6, name: 'Ananya Das', college: 'NIT Warangal', solved: 432, streak: 24 },
  { rank: 7, name: 'Vikram Singh', college: 'DTU Delhi', solved: 421, streak: 21 },
  { rank: 8, name: 'Meera Joshi', college: 'COEP Pune', solved: 415, streak: 19 },
  { rank: 9, name: 'Aditya Rao', college: 'BITS Goa', solved: 408, streak: 17 },
  { rank: 10, name: 'Pooja Gupta', college: 'NIT Surathkal', solved: 401, streak: 15 },
];

export const testimonials = [
  { name: 'Arjun Sharma', college: 'IIT Delhi', detail: 'AIR 142 GATE', quote: 'Vikas Maurya Academy helped me crack GATE with a top rank. The structured approach and mock tests were exactly what I needed.' },
  { name: 'Priya Nair', college: 'NIT Trichy', detail: 'Placed at TCS', quote: 'The placement prep and aptitude courses were a game-changer. I cleared the TCS NQT with confidence thanks to the practice problems.' },
  { name: 'Rohit Kumar', college: 'BITS Pilani', detail: '300+ Code Arena', quote: 'Code Arena is addictive! Solving problems daily improved my DSA skills immensely and helped me land an internship at Amazon.' },
];

export const placementCompanies = [
  {
    name: 'TCS',
    rounds: ['Aptitude Test (90 min)', 'Technical Interview', 'Managerial Round', 'HR Interview'],
    strategy: 'Focus on aptitude, basic programming (C/Java/Python), and SQL. Prepare for questions on your final year project. Practice TCS NQT pattern questions and previous year papers.',
    resources: [
      { title: 'Reasoning & Quantitative Aptitude', price: 'Free' },
      { title: 'DSA Mastery Course', price: 'Free' },
      { title: 'TCS Interview Guide (Blog)', price: 'Free' },
    ],
  },
  {
    name: 'Infosys',
    rounds: ['Online Assessment (Aptitude + Verbal)', 'Technical Interview', 'HR Interview'],
    strategy: 'Infosys focuses heavily on verbal ability and aptitude. Brush up on basic OOP concepts, DBMS, and your project. Practice pseudocode questions for the technical round.',
    resources: [
      { title: 'Reasoning & Quantitative Aptitude', price: 'Free' },
      { title: 'Full Stack Web Development', price: '₹2,999' },
      { title: 'Infosys Prep Notes', price: 'Free' },
    ],
  },
  {
    name: 'Accenture',
    rounds: ['Cognitive & Technical Assessment', 'Coding Round', 'Interview'],
    strategy: 'Accenture tests cognitive ability, pseudocode, and coding. Practice SQL, MS Office, and networking basics. The coding round has 2 problems — one easy, one medium.',
    resources: [
      { title: 'DSA Mastery Course', price: 'Free' },
      { title: 'Python & AI/ML Bootcamp', price: '₹1,999' },
      { title: 'Accenture Mock Interview Notes', price: 'Free' },
    ],
  },
  {
    name: 'Wipro',
    rounds: ['Online Assessment (Aptitude + Coding)', 'Technical Interview', 'HR Interview'],
    strategy: 'Wipro assessment includes aptitude, logical reasoning, and 2 coding problems. Prepare Java/C/C++ fundamentals, OOP, and basic DSA. Project knowledge is important.',
    resources: [
      { title: 'DSA Mastery Course', price: 'Free' },
      { title: 'Reasoning & Quantitative Aptitude', price: 'Free' },
      { title: 'Wipro Previous Year Questions', price: 'Free' },
    ],
  },
  {
    name: 'Capgemini',
    rounds: ['Aptitude + Logical + Verbal', 'Pseudocode + Gaming', 'Technical + HR Interview'],
    strategy: 'Capgemini has a unique gaming aptitude test. Practice pseudocode, data structures, and basic algorithms. Focus on communication skills for the HR round.',
    resources: [
      { title: 'Reasoning & Quantitative Aptitude', price: 'Free' },
      { title: 'DSA Mastery Course', price: 'Free' },
      { title: 'Capgemini Prep Guide', price: 'Free' },
    ],
  },
  {
    name: 'HCL',
    rounds: ['Online Test (Aptitude + Technical)', 'Technical Interview', 'HR Interview'],
    strategy: 'HCL technical test covers C, C++, OOP, and DBMS. Practice SQL queries, data structures, and basic algorithms. Be ready to explain your project in detail.',
    resources: [
      { title: 'DSA Mastery Course', price: 'Free' },
      { title: 'DevOps & Cloud Course', price: '₹2,499' },
      { title: 'HCL Interview Notes', price: 'Free' },
    ],
  },
];

export const navDropdowns: Record<string, { emoji: string; label: string; to?: string }[]> = {
  Courses: [
    { emoji: '🎓', label: 'GATE & PSU Prep', to: '/courses' },
    { emoji: '💻', label: 'Full Stack Dev', to: '/courses' },
    { emoji: '🐍', label: 'Python & AI/ML', to: '/courses' },
    { emoji: '🧩', label: 'DSA Mastery', to: '/courses' },
    { emoji: '☁️', label: 'DevOps & Cloud', to: '/courses' },
    { emoji: '📊', label: 'Reasoning & Quants', to: '/courses' },
  ],
  Live: [
    { emoji: '🔴', label: 'Watch Live Now', to: '/live' },
    { emoji: '📅', label: 'Upcoming Schedule', to: '/live' },
    { emoji: '🎬', label: 'Recorded Sessions', to: '/videos' },
  ],
  Arena: [
    { emoji: '🧩', label: 'Problem Set', to: '/arena' },
    { emoji: '🏆', label: 'Leaderboard', to: '/arena?tab=leaderboard' },
    { emoji: '⚡', label: 'Daily Contest', to: '/arena' },
  ],
  Notes: [
    { emoji: '📄', label: 'Chapter-wise PDFs', to: '/notes' },
    { emoji: '📋', label: 'Cheat Sheets', to: '/notes' },
    { emoji: '✏️', label: 'Practice Sets', to: '/notes' },
  ],
  Placement: [
    { emoji: '🏢', label: 'Company Prep', to: '/placement' },
    { emoji: '💼', label: 'Jobs Board', to: '/jobs' },
    { emoji: '🎤', label: 'Mock Interviews', to: '/live' },
    { emoji: '📝', label: 'Resume Builder', to: '/placement' },
  ],
  Certificates: [
    { emoji: '🏆', label: 'My Certificates', to: '/certificates' },
    { emoji: '✅', label: 'Verify a Certificate', to: '/certificates' },
  ],
  Jobs: [
    { emoji: '🆕', label: 'Fresher Jobs', to: '/jobs' },
    { emoji: '🎓', label: 'Internships', to: '/jobs' },
    { emoji: '🏠', label: 'Remote Jobs', to: '/jobs' },
    { emoji: '🏫', label: 'Campus Drives', to: '/jobs' },
  ],
  Videos: [
    { emoji: '📚', label: 'VMA — Academy', to: '/videos?channel=VMA' },
    { emoji: '💻', label: 'VCS — Coding School', to: '/videos?channel=VCS' },
    { emoji: '🔥', label: 'Most Watched', to: '/videos' },
  ],
  Blog: [
    { emoji: '📰', label: 'Latest Articles', to: '/blog' },
    { emoji: '🎤', label: 'Interview Guides', to: '/blog' },
    { emoji: '💼', label: 'Career Tips', to: '/blog' },
    { emoji: '📚', label: 'Tech Tutorials', to: '/blog' },
  ],
  More: [
    { emoji: '📺', label: 'VMA YouTube Channel', to: 'https://www.youtube.com/@VikasMauryaAcademy' },
    { emoji: '💻', label: 'VCS YouTube Channel', to: 'https://www.youtube.com/@VikasCodingSchool' },
    { emoji: '🫀', label: 'Anatomy Class', to: 'https://anatomy-class.vercel.app/' },
    { emoji: '🧮', label: 'Algorithm Class', to: 'https://algorithmclass.vercel.app/' },
    { emoji: '💬', label: 'Community Forum', to: '/dashboard' },
    { emoji: '🗺️', label: 'Roadmaps', to: '/courses' },
    { emoji: '🧑‍🏫', label: 'Mentorship', to: '/dashboard' },
    { emoji: '📱', label: 'Mobile App', to: '/dashboard' },
    { emoji: '🎁', label: 'Refer & Earn', to: '/dashboard' },
  ],
};
