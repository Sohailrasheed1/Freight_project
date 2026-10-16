# Antigravity Execution Rules

## Context and Performance Tuning
- NEVER scan `node_modules`, `dist`, `build`, or `.git` folders.
- Limit repository analysis to the current active module only.
- If response token length exceeds 4000 tokens, truncate logs and present only the code diff.
- Do not re-evaluate full codebase architecture unless explicitly asked.

## Agent Behavior
- Prioritize low-latency execution over multi-agent consensus loops.
- Use zero-shot direct execution for minor code refactors.
