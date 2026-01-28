
Overview
--------

This project is an **incremental, from-first-principles implementation of a diff engine**, similar in spirit to how tools like **Git diff**, editors, and document comparison systems work.

The goal is **not** to jump directly to a final optimized solution, but to **build the system step by step**, understanding _why_ each algorithm exists and _what problem it solves_.

We are treating this as a **real engineering project**, developed in phases.

What are we building?
---------------------

I are building a **Diff engine Like Git Diff** Where i can compare two files and know the changes

Diff Engine (Phase 1)
=====================

What I have done?
---------------------

I have builded a simple **string diff engine** that:

* Takes two strings: an **old version** and a **new version**

* Computes the **minimal and meaningful differences** between them

* Outputs those differences as structured **diff operations**, not just text

These diff operations can later be:

* Rendered in a UI

* Converted into patches

* Used for undo/redo

* Extended to file diffs, JSON diffs, or collaborative editing
  
  <img width="1365" height="861" alt="Screenshot from 2026-01-28 10-58-30" src="https://github.com/user-attachments/assets/d72bce7c-9c2b-4488-8daf-a80777f2b8fd" />


  
