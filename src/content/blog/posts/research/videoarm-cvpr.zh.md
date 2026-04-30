---
title: "VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding"
date: "2025-12-13"
summary: "面向长视频理解的层次化记忆与智能体推理框架，已被 CVPR 2026 接收。"
tags: ["视频理解", "智能体", "多模态", "长视频", "CVPR 2026"]
---

# VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding

**状态**: CVPR 2026 接收<br/>
**arXiv**: https://arxiv.org/abs/2512.12360<br/>
**代码**: https://github.com/qiankemeng/VideoARM

## 研究背景

长视频理解需要模型在较长时间跨度中保存关键事件、跨片段建立联系，并在回答问题时进行多步推理。直接把大量帧塞入上下文会带来计算成本、噪声累积和关键信息遗忘等问题。

VideoARM 围绕这一问题构建了面向长视频问答的层次化记忆与智能体推理框架，让模型能够在压缩后的视频记忆上进行可控检索和推理。

## 核心思路

- **层次化视频记忆**：将长视频信息组织为不同粒度的事件、片段和全局语义记忆。
- **Agentic Reasoning**：让智能体根据问题动态访问相关记忆，而不是一次性消费全部视频内容。
- **长视频问答闭环**：面向长视频 QA 任务，把视觉信息抽取、记忆组织和推理回答统一到一个可扩展流程中。

## 当前意义

这项工作是我围绕长视频理解与多模态 Agent 方向的主要研究成果之一，也延伸出后续对视频记忆、长视频多 Agent 系统和可视化评估工具的持续探索。

---

**关键词**: 长视频理解 | 智能体推理 | 层次化记忆 | 视频问答 | CVPR 2026
