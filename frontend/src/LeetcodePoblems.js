// src/data/LeetcodeProblems.js
const LeetcodeProblems = {
  "Hard": {
    "Median of Two Sorted Arrays": {
      "name": "Median of Two Sorted Arrays",
      "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nExample 1:\n\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.\n\nExample 2:\n\nInput: nums1 = [1,2], nums2 = [3,4]\nOutput: 2.50000\nExplanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.\n\nConstraints:\n\nnums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-106 <= nums1[i], nums2[i] <= 106",
      "tests": [
        {"input": [[1,3],[2]], "output": 2.00000},
        {"input": [[1,3,8],[7,9,10,11]], "output": 8.00000}
      ]
    },
    "Regular Expression Matching": {
      "name": "Regular Expression Matching",
      "description": "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:\n\n'.' Matches any single character.\n'*' Matches zero or more of the preceding element.\nThe matching should cover the entire input string (not partial).\n\nExample 1:\n\nInput: s = \"aa\", p = \"a\"\nOutput: false\nExplanation: \"a\" does not match the entire string \"aa\".\n\nExample 2:\n\nInput: s = \"aa\", p = \"a*\"\nOutput: true\nExplanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes \"aa\".\n\nExample 3:\n\nInput: s = \"ab\", p = \".*\"\nOutput: true\nExplanation: \".*\" means \"zero or more (*) of any character (.)\".\n\nConstraints:\n\n1 <= s.length <= 20\n1 <= p.length <= 20\ns contains only lowercase English letters.\np contains only lowercase English letters, '.', and '*'.\nIt is guaranteed for each appearance of the character '*', there will be a previous valid character to match.",
      "tests": [
        {"input": ["aa", "a"], "output": false},
        {"input": ["aa", "a*"], "output": true}
      ]
    },
    "First Missing Positive": {
      "name": "First Missing Positive",
      "description": "Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.",
      "tests": [
        {"input": [[1,2,0]], "output": 3},
        {"input": [[3,4,-1,1]], "output": 2}
      ]
    },
  },
  "Medium": {
    "Add Two Numbers": {
      "name": "Add Two Numbers",
      "description": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\nExample 1:\n\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.\n\nExample 2:\n\nInput: l1 = [0], l2 = [0]\nOutput: [0]\n\nExample 3:\n\nInput: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\nOutput: [8,9,9,9,0,0,0,1]\n\nConstraints:\n\nThe number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros.",
      "tests": [
        {"input": [[1,2,3,4], [5,6,7,8]], "output": [6,8,0,3,1]},
        {"input": [[4,2,2], [6,3,2]], "output": [6,4]}
      ]
    },
    "Longest Substring Without Repeating Characters": {
      "name": "Longest Substring Without Repeating Characters",
      "description": "Given a string s, find the length of the longest substring without duplicate characters.\n\nExample 1:\n\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with the length of 3.\n\nExample 2:\n\nInput: s = \"bbbbb\"\nOutput: 1\nExplanation: The answer is \"b\", with the length of 1.\n\nExample 3:\n\nInput: s = \"pwwkew\"\nOutput: 3\nExplanation: The answer is \"wke\", with the length of 3.\nNotice that the answer must be a substring, \"pwke\" is a subsequence and not a substring.\n\nConstraints:\n\n0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
      "tests": [
        {"input": ["s"], "output": 1},
        {"input": ["123451234"], "output": 5}
      ]
    },
    "Longest Palindromic Substring": {
      "name": "Longest Palindromic Substring",
      "description": "Given a string s, return the longest palindromic substring in s.\n\nExample 1:\n\nInput: s = \"babad\"\nOutput: \"bab\"\nExplanation: \"aba\" is also a valid answer.\n\nExample 2:\n\nInput: s = \"cbbd\"\nOutput: \"bb\"\n\nConstraints:\n\n1 <= s.length <= 1000\ns consist of only digits and English letters.",
      "tests": [
        {"input": ["abbaef"], "output": "abba"},
        {"input": ["1234543219"], "output": "123454321"}
      ]
    },
    "Zigzag Conversion": {
      "name": "Zigzag Conversion",
      "description": "The string \"PAYPALISHIRING\" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)\n\nP   A   H   N\nA P L S I I G\nY   I   R\nAnd then read line by line: \"PAHNAPLSIIGYIR\"\n\nWrite the code that will take a string and make this conversion given a number of rows:\n\nstring convert(string s, int numRows);\n\nExample 1:\n\nInput: s = \"PAYPALISHIRING\", numRows = 3\nOutput: \"PAHNAPLSIIGYIR\"\n\nExample 2:\n\nInput: s = \"PAYPALISHIRING\", numRows = 4\nOutput: \"PINALSIGYAHRPI\"\nExplanation:\nP     I    N\nA   L S  I G\nY A   H R\nP     I\n\nExample 3:\n\nInput: s = \"A\", numRows = 1\nOutput: \"A\"\n\nConstraints:\n\n1 <= s.length <= 1000\ns consists of English letters (lower-case and upper-case), ',' and '.'.\n1 <= numRows <= 1000",
      "tests": [
        {"input": ["HELLOWORLD", 2], "output": "HLOWRD EL OL"},
        {"input": ["THISISAZIGZAGCONVERSIONTEST", 5], "output": "TSEIAGNITSHZVORCZSAGIOTSR"}
      ]
    },
    "Reverse Integer": {
      "name": "Reverse Integer",
      "description": "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).\n\nExample 1:\n\nInput: x = 123\nOutput: 321\n\nExample 2:\n\nInput: x = -123\nOutput: -321\n\nExample 3:\n\nInput: x = 120\nOutput: 21\n\nConstraints:\n\n-231 <= x <= 231 - 1",
      "tests": [
        {"input": [1000000003], "output": 0},
        {"input": [1463847412], "output": 2147483641},
        {"input": [-1463847412], "output": -2147483641}
      ]
    },
    "String to Integer (atoi)": {
      "name": "String to Integer (atoi)",
      "description": "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.\n\nThe algorithm for myAtoi(string s) is as follows:\n\nWhitespace: Ignore any leading whitespace (\" \").\nSignedness: Determine the sign by checking if the next character is '-' or '+', assuming positivity if neither present.\nConversion: Read the integer by skipping leading zeros until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.\nRounding: If the integer is out of the 32-bit signed integer range [-231, 231 - 1], then round the integer to remain in the range. Specifically, integers less than -231 should be rounded to -231, and integers greater than 231 - 1 should be rounded to 231 - 1.\nReturn the integer as the final result.",
      "tests": [
        {"input": ["words and 987"], "output": 0},
        {"input": ["-91283472332"], "output": -2147483648},
        {"input": ["91283472332"], "output": 2147483647},
        {"input": ["0-1"], "output": 0}
      ]
    },
    "Container With Most Water": {
      "name": "Container With Most Water",
      "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\nNotice that you may not slant the container.",
      "tests": [
        {"input": [[1,3,2,5,25,24,5]], "output": 24},
        {"input": [[2,3,10,5,7,8,9]], "output": 36},
        {"input": [[1,2,4,3]], "output": 4}
      ]
    },
    "Integer to Roman": {
      "name": "Integer to Roman",
      "description": "Seven different symbols represent Roman numerals with the following values:\n\nSymbol\tValue\nI\t1\nV\t5\nX\t10\nL\t50\nC\t100\nD\t500\nM\t1000\n\nRoman numerals are formed by appending the conversions of decimal place values from highest to lowest. Converting a decimal place value into a Roman numeral has the following rules:\n\nIf the value does not start with 4 or 9, select the symbol of the maximal value that can be subtracted from the input, append that symbol to the result, subtract its value, and convert the remainder to a Roman numeral.\nIf the value starts with 4 or 9 use the subtractive form representing one symbol subtracted from the following symbol, for example, 4 is 1 (I) less than 5 (V): IV and 9 is 1 (I) less than 10 (X): IX. Only the following subtractive forms are used: 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD) and 900 (CM).\nOnly powers of 10 (I, X, C, M) can be appended consecutively at most 3 times to represent multiples of 10. You cannot append 5 (V), 50 (L), or 500 (D) multiple times. If you need to append a symbol 4 times use the subtractive form.",
      "tests": [
        {"input": [58], "output": "LVIII"},
        {"input": [1994], "output": "MCMXCIV"},
        {"input": [1], "output": "I"}
      ]
    },
    "3Sum": {
      "name": "3Sum",
      "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
      "tests": [
        {"input": [[0,1,1]], "output": []},
        {"input": [[0,0,0]], "output": [[0,0,0]]},
        {"input": [[-2,0,1,1,2]], "output": [[-2,0,2],[-2,1,1]]},
        {"input": [[-4,-2,-1,0,1,2,3]], "output": [[-4,1,3],[-4,2,2],[-2,-1,3],[-2,0,2],[-1,0,1]]}
      ]
    },
    "3Sum Closest": {
      "name": "3Sum Closest",
      "description": "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.\n\nReturn the sum of the three integers.\n\nYou may assume that each input would have exactly one solution.",
      "tests": [
        {"input": [[-3,-2,-5,3,-4], -1], "output": -2},
        {"input": [[1,2,5,10,11], 12], "output": 13},
        {"input": [[-1,2,1,-4,5,6], 8], "output": 8},
        {"input": [[-1,2,1,-4], -1], "output": -1}
      ]
    }
  },
  "Easy": {
    "Two Sum": {
      "name": "Two Sum",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      "tests": [
        {"input": [[2,7,11,15], 9], "output": [0,1]},
        {"input": [[3,2,4], 6], "output": [1,2]}
      ]
    },
    "Palindrome Number": {
      "name": "Palindrome Number",
      "description": "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nA palindrome reads the same backward as forward.",
      "tests": [
        {"input": [121], "output": true},
        {"input": [-121], "output": false}
      ]
    },
    "Roman to Integer": {
      "name": "Roman to Integer",
      "description": "Given a roman numeral, convert it to an integer.\n\nRoman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Subtractive notation is used for 4, 9, 40, 90, 400, and 900.",
      "tests": [
        {"input": ["III"], "output": 3},
        {"input": ["IV"], "output": 4}
      ]
    },
    "Longest Common Prefix": {
      "name": "Longest Common Prefix",
      "description": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
      "tests": [
        {"input": [["flower","flow","flight"]], "output": "fl"},
        {"input": [["interview","internet","internal"]], "output": "inte"}
      ]
    },
    "Valid Parentheses": {
      "name": "Valid Parentheses",
      "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type and in the correct order.",
      "tests": [
        {"input": ["()"], "output": true},
        {"input": ["(]"], "output": false}
      ]
    },
    "Search Insert Position": {
      "name": "Search Insert Position",
      "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. Must be done in O(log n) time complexity.",
      "tests": [
        {"input": [[1,3,5,6], 5], "output": 2},
        {"input": [[1,3,5,6], 2], "output": 1}
      ]
    },
    "Find The Index of the First Occurrence in a String": {
      "name": "Find the Index of the First Occurrence in a String",
      "description": "Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
      "tests": [
        {"input": ["sadbutsad", "sad"], "output": 0},
        {"input": ["hello", "ll"], "output": 2}
      ]
    }
  }
};

export default LeetcodeProblems;