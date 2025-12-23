---
title: "VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding"
date: "2024-11-15"
summary: "Proposing an agentic reasoning framework with hierarchical memory for long-form video understanding. (Under review at CVPR)"
tags: ["Video Understanding", "Agents", "Multimodal", "Long Video"]
---

# VideoARM: Agentic Reasoning over Hierarchical Memory for Long-Form Video Understanding

**Status**: Under review at CVPR

## Background

Long-form video understanding is a critical challenge in multimodal large models. Traditional methods face issues such as high computational complexity and difficulty in extracting key information when processing long videos. This paper proposes the VideoARM framework, achieving efficient long-form video understanding through agentic reasoning and hierarchical memory mechanisms.

## Core Innovations

### 1. Hierarchical Memory Architecture

We design a multi-level memory structure:
- **Short-term Memory**: Stores visual features of current frames
- **Medium-term Memory**: Maintains keyframes and event summaries
- **Long-term Memory**: Preserves global semantic representations

### 2. Agentic Reasoning Mechanism

Large model-based agents can:
- Autonomously decide when to access different memory levels
- Dynamically adjust keyframe selection strategies
- Perform multi-step reasoning to answer complex questions

### 3. Temporal Modeling Strategy

For temporal relationships in long videos, we propose:
- Adaptive temporal sampling algorithm
- Event boundary detection module
- Cross-frame relation modeling network

## Experimental Results

Significant improvements on multiple long-form video QA benchmarks:

- **ActivityNet-QA**: +8.3% improvement
- **EgoSchema**: +12.1% improvement
- **NExT-QA**: +6.7% improvement

## Method Advantages

1. **Efficiency**: 70% reduction in computation compared to full-frame processing
2. **Accuracy**: Outperforms existing methods on long-form video understanding tasks
3. **Interpretability**: Visualizable agent reasoning process

## Future Work

- Explore larger-scale video datasets
- Research real-time inference optimization strategies
- Extend to multimodal video understanding tasks

---

**Keywords**: Long-Form Video Understanding | Agentic Reasoning | Hierarchical Memory | Video QA
