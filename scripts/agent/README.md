# AI Agent for Paper Curation

This directory contains the arXiv paper-curation agent.

Canonical maintenance documentation now lives at:

```text
../../docs/ai-paper-agent.md
```

Main entry:

```bash
cd scripts
npm install
npm run agent
```

Root aliases:

```bash
npm run agent
npm run agent:run
npm run agent:test
```

Do not place secrets in this directory. Use environment variables locally and GitHub Actions secrets in production.
