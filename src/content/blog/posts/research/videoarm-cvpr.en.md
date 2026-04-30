---
title: "VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding"
date: "2025-12-13"
summary: "A hierarchical-memory and agentic-reasoning framework for long-form video understanding, accepted to CVPR 2026."
tags: ["Video Understanding", "Agents", "Multimodal", "Long Video", "CVPR 2026"]
---

# VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding

**Status**: Accepted to CVPR 2026<br/>
**arXiv**: https://arxiv.org/abs/2512.12360<br/>
**Code**: https://github.com/qiankemeng/VideoARM

## Background

Long-form video understanding requires models to preserve key events across long temporal spans, connect information across segments, and perform multi-step reasoning when answering questions. Feeding many raw frames directly into context is costly and often leads to noise accumulation and missed key evidence.

VideoARM addresses this problem with a hierarchical memory and agentic reasoning framework for long-video question answering. The framework enables controlled retrieval and reasoning over compressed video memories instead of consuming the whole video context at once.

## Core Ideas

- **Hierarchical video memory**: Organize long-video information into event-, segment-, and global-level semantic memories.
- **Agentic reasoning**: Let the agent dynamically access relevant memories according to the question.
- **Long-video QA loop**: Unify visual information extraction, memory organization, and reasoning-based answering in an extensible pipeline.

## Current Role

This work is one of my main research outputs on long-form video understanding and multimodal agents. It also motivates my ongoing exploration of video memory, long-video multi-agent systems, and visualization-assisted evaluation.

---

**Keywords**: Long-Form Video Understanding | Agentic Reasoning | Hierarchical Memory | Video QA | CVPR 2026
