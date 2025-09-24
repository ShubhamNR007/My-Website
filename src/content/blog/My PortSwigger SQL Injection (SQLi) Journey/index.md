---
title: "My PortSwigger SQL Injection (SQLi) Journey"
publishDate: 2025-09-24 08:00:00
description: "How I solved 18 SQLi labs from PortSwigger Web Security Academy, what I learned, and how I automated the exploits with Python."
tags:
  - PortSwigger
  - SQL Injection
  - Cybersecurity
  - Penetration Testing
heroImage: { src: './sqli-thumbnail.jpg', color: '#F37F2E' }
language: 'English'
---

## Introduction — A small confession

I learned my first SQL injection from a textbook example: a single line that somehow felt both obvious and mythical — `' OR 1=1 --`. For a long time that line was the whole story. It was the “fun fact” at the end of chapters, the thing juniors were told to memorise before moving on to more advanced vulnerabilities. I knew the theory: user input should never be trusted, parameterize your queries, use prepared statements. But theory is brittle until it is lived.

So I decided to live SQLi. I committed to solving **all 18 SQLi labs** on the PortSwigger Web Security Academy and to document the experience. The goal wasn’t to collect trophies — it was to reshape the way I think about input, parsing, and the little brittle decisions that turn neat code into a liability. What follows is a long-form retelling of that process: the curiosities, the frustrations, the breakthroughs, and two long mini-essays on the labs that taught me the most — the time-based blind challenges and the error-tracing labs.

If you want the raw walkthroughs or the Python scripts I built to automate extractions, they’re linked at the end. But this piece is intentionally narrative-first: the kind of post I would read late at night with terminal glow and a cup of coffee.

---

## The first days — small puzzles, big lessons

The early labs read like puzzles. At first, the tasks are kind: they show you what to look for and nudge you toward the vulnerability. Those labs taught the mechanics: how SQL queries are structured, why `UNION` works (when your injection can match the original query shape), and how NULLs or data-type mismatches break payloads. They teach you to ask the right questions:

- Which parameters influence the SQL backend?
- Which responses show database output?
- What error messages does the app reveal?

Small victories — getting a `UNION` result to display, forcing a column count mismatch to show an error — felt like learning the alphabet of a new language. But after the alphabet comes composition, and that is where the labs stopped being exercises and started becoming stories.

---

## What changed in my head

Before the labs, I would glance at a login form and, if the parameters looked sanitized, tick it off. After 18 labs, that quick heuristic felt dangerous. The labs showed me that SQLi rarely announces itself with a big red sign. It lurks in less glamorous places:

- Hidden parameters added by client-side scripts.
- Cookies that the application uses for tracking.
- Custom headers or JSON fields in API calls.
- Search or filter inputs that seem safe but are concatenated into SQL.

I learned to treat every place the app accepts input as a potential point of failure. That mental shift— from “where I expect SQLi” to “where could SQLi hide?” — is the single most valuable change the labs gave me.

---

## The slow art of time-based / blind SQLi

If error-based labs are fireworks, blind, time-based SQLi is a slow, meticulous watch-and-wait performance. There’s no loud output, no error to read; instead you learn to listen to the application’s timing.

The core idea is almost poetic: if the app doesn’t tell you anything, you force it to tell you *when* it takes too long. You craft checks that make the database pause only when a certain condition is true — and then you watch the clock. Each successful guess reveals a tiny truth: one character of a password, one bit of a flag. Over many requests, you reconstruct a secret one letter at a time.

Why this lab stuck with me:

- **Patience and pattern recognition.** The first few rounds felt like throwing stones in the dark. But after building a rhythm — send, measure, analyse, repeat — the noise thinned and predictable timing patterns emerged. I learned to deal with network jitter, caching artefacts, and false positives by building statistical tolerance into my checks.
- **Engineering trade-offs.** Blind extraction forces you to think about trade-offs: how many concurrent requests is safe? How do you avoid tripping rate limits or WAF rules while still being efficient? These aren’t academic questions; they map directly to real assessments where reliability and stealth matter.
- **Tooling discipline.** I started manually with Burp Repeater to confirm that timing differences could be observed. Only after confirming the concept by hand did I write scripts that automated the character-by-character extraction process. The scripts included exponential backoffs, retries, and sanity checks — everything to avoid drawing false conclusions from a noisy network.

I still remember the exact moment a character resolved correctly: a response that sat for an extra second, and the little confirmation that followed in my parsing routine. It’s not flashy. It’s a slow release of tension, the kind that feels deeply satisfying because you built the scaffolding yourself.

**Defensive note:** From a defender’s perspective, this class of bugs demonstrates why consistent error handling and removing verbose DB feedback matter — and why time-based anomalies can reveal information even when output is silenced.

---

## Error messages: the accidental truth-tellers

Error-based labs felt almost unfair at times, but in the best possible way. A misplaced quote, a debug message left in production, or an overly-helpful SQL error can hand an attacker a roadmap. The labs that focused on error-elicitation taught me to read the server’s mistakes like a detective reads a witness statement.

What made these labs educational:

- **Contextual leaks.** An error might include a table name, a column reference, or even a stack trace. That single leak can turn a blind guessing game into a targeted operation. I learned to switch from exploratory probes to focused enumeration once I had a breadcrumb.
- **The importance of balance.** For developers, giving helpful errors during development is good. But the labs showed why error sanitization must be part of the deployment checklist. Error handling belongs in the performance and ops conversation as much as the security one.
- **A narrative of human error.** Many of these messages exist because someone thought they would help future developers debug quickly. The labs turned that helpfulness into a narrative of how small conveniences can create big vulnerabilities.

One memorable lab produced a relatively cryptic DB error that, when parsed carefully, hinted at a specific schema pattern. From there I could infer column names and eventually reconstruct sensitive rows. That cascade — from a tiny error string to a full data dump — is why I started treating error messages as high-value outputs to be minimized.

**Mitigation-focused takeaway:** Centralized logging with sanitized external responses, parameterized queries, and least-privilege DB users are not optional. These labs reinforce that “production-friendly” error messages are often the most dangerous in production.

---

## How I automated things

Automation is seductive. Once I learned the manual steps, the urge to script them was irresistible. But the difference between a script that runs commands and one you can explain to a peer is enormous. I adopted a two-stage pattern:

1. **Verify manually.** Confirm the vulnerability with Burp. Understand the app’s responses.
2. **Automate carefully.** Scripts became reproducible experiments: they logged every step, handled transient errors, and included clear comments about intent and safe use.

My automation work never replaced manual testing; it amplified it. Scripts let me iterate faster and forced me to think about edge cases I might otherwise ignore: HTML encoding differences, pagination quirks, or unexpected server-side normalization.

---

## Lessons I now carry into assessments and reports

- **Assume inputs are dangerous.** Everything that travels from client to server is suspect, especially fields handled client-side only.
- **Talk to developers in their language.** Security findings land better when you explain the exact query, the code pattern that causes it, and a short, pragmatic fix.
- **Measure and be ethical.** Timing attacks are noisy and slow; always work in scoped environments and ensure you don’t overwhelm services or expose real data.
- **Document automation.** My GitHub repo contains scripts with headers that explain educational intent and usage constraints. They are teaching tools, not weapons.

---

## Why this work still matters

SQL Injection is old, but it is stubborn. It survives in corners of codebases where creativity meets haste and configuration meets convenience. Solving these 18 PortSwigger labs didn’t make me infallible. It did something better: it taught me to ask better questions, to be patient with ambiguity, and to build tooling that respects both efficiency and ethics.

If you want the full, kitchen-sink writeups or the Python PoCs I used to automate extractions, you’ll find everything in my lab index and GitHub repo.

- [My PortSwigger lab index(Writeups)](https://shubhamranpise.com/portswigger-labs)  
- [My exploit scripts(Exploits)](https://github.com/ShubhamNR007/portswigger-labs-exploits/tree/main/SQLi)

---

— Shubham Ranpise

---