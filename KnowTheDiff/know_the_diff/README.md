
Overview
--------

This project is an **incremental, from-first-principles implementation of a diff engine**, similar in spirit to how tools like **Git diff**, editors, and document comparison systems work.

The goal is **not** to jump directly to a final optimized solution, but to **build the system step by step**, understanding _why_ each algorithm exists and _what problem it solves_.

What are we building?
---------------------

I are building a **Diff engine Like Git Diff** Where i can compare two files and know the changes

Diff Engine (Phase 1)
=====================

What I have done?
---------------------

I have built a simple **string diff engine** that:

* Takes two strings: an **old version** and a **new version**

* I used LCS DP algo to find the common subsequences, in this helper we first find the DP table , and find the sequence , and then find the diff. Please refer to diff_helper.ts to know more.

* Outputs those differences as structured **diff operations**, not just text

As a next step
----------------

What i have done here is created a line_diff helper, which checks the diff line by line - check line_diff.ts to know more ...

Here are the issues with that :

* Issue 1: Line insertion shifts everything

<<<<<<< HEAD
* Extended to file diffs, JSON diffs, or collaborative editing
  
  <img width="1365" height="861" alt="Screenshot from 2026-01-28 10-58-30" src="https://github.com/user-attachments/assets/d72bce7c-9c2b-4488-8daf-a80777f2b8fd" />


  
=======
* Issue 2: Deletions cause the same

* Issue 3: Move ≠ Modify -> Treats all lines as modified no concept of “movement”

* Issue 4: False “modify” detection

Like this there are some edge cases yet to get be reached , so let see what next can be done here to imporove before this ,before we jump on to the big giant algos(like MYERS ALGO)..
>>>>>>> 57bdc5d (know_diff:feat: added line_diff helper and updated the UI)
