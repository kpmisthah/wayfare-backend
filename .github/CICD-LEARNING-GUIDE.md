# 🎓 CI/CD Complete Learning Guide
## From Beginner to Advanced

---

## 📚 Table of Contents

1. [What is CI/CD?](#1-what-is-cicd)
2. [Why Do We Need CI/CD?](#2-why-do-we-need-cicd)
3. [Understanding the Workflow](#3-understanding-the-workflow)
4. [GitHub Actions Basics](#4-github-actions-basics)
5. [Your Project's CI Pipeline Explained](#5-your-projects-ci-pipeline-explained)
6. [Your Project's CD Pipeline Explained](#6-your-projects-cd-pipeline-explained)
7. [Step-by-Step Setup Guide](#7-step-by-step-setup-guide)
8. [Advanced Concepts](#8-advanced-concepts)
9. [Best Practices](#9-best-practices)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. What is CI/CD?

### 🤔 Simple Explanation

Imagine you're working on a group project. Every time someone makes changes:

- **Without CI/CD**: You manually check if the code works, run tests, and deploy it yourself
- **With CI/CD**: All of this happens AUTOMATICALLY when you push code!

### 📖 Definitions

| Term | Full Form | What It Does |
|------|-----------|--------------|
| **CI** | Continuous Integration | Automatically builds and tests your code every time you push |
| **CD** | Continuous Deployment/Delivery | Automatically deploys your tested code to servers |

### 🔄 The CI/CD Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CI/CD PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   👨‍💻 Developer        🔄 CI (Continuous Integration)        🚀 CD          │
│                                                                              │
│   ┌──────────┐      ┌─────────┐  ┌─────────┐  ┌─────────┐    ┌─────────┐   │
│   │  Write   │      │  Build  │  │  Lint   │  │  Test   │    │ Deploy  │   │
│   │   Code   │─────▶│  Code   │─▶│  Check  │─▶│  Code   │───▶│ to Live │   │
│   └──────────┘      └─────────┘  └─────────┘  └─────────┘    └─────────┘   │
│        │                                                          │         │
│        │                                                          │         │
│        └──────────── git push ────────────────────────────────────┘         │
│                          ▲                                                   │
│                          │                                                   │
│                    "The Magic Happens                                        │
│                     Automatically!"                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🎯 Real-World Analogy

Think of CI/CD like a **car manufacturing assembly line**:

1. **Raw Materials** (Your Code) → Enter the factory
2. **Quality Check #1** (Linting) → Check for obvious defects
3. **Assembly** (Build) → Put the pieces together
4. **Quality Check #2** (Testing) → Make sure everything works
5. **Delivery** (Deploy) → Send to the customer (users)

If ANY step fails, the line STOPS and alerts you! ⚠️

---

## 2. Why Do We Need CI/CD?

### 😫 Problems WITHOUT CI/CD

| Problem | Description |
|---------|-------------|
| **"Works on my machine"** | Code works locally but breaks in production |
| **Manual errors** | Forgetting to run tests before deploying |
| **Slow releases** | Takes hours/days to deploy manually |
| **Fear of deploying** | Deployments become stressful events |
| **Integration conflicts** | Multiple developers' code clashing |

### 🎉 Benefits WITH CI/CD

| Benefit | Description |
|---------|-------------|
| ✅ **Automatic testing** | Every code change is tested immediately |
| ✅ **Early bug detection** | Find bugs minutes after they're introduced |
| ✅ **Consistent deployments** | Same process every time, no human error |
| ✅ **Faster releases** | Deploy multiple times per day safely |
| ✅ **Team confidence** | Everyone can deploy without fear |

### 📊 Real Statistics

> Companies using CI/CD deploy **200x more frequently** with **24x faster recovery** from failures
> — *State of DevOps Report*

---

## 3. Understanding the Workflow

### 🌳 Git Branching Strategy

```
main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/user-auth
  │     │
  │     ├── feature/payment
  │     │
  │     └── bugfix/login-issue
  │
  └── hotfix/critical-fix
```

### 🔄 The Complete Workflow

```
Step 1: Developer creates a feature branch
        └── git checkout -b feature/new-feature

Step 2: Developer writes code and commits
        └── git commit -m "Add new feature"

Step 3: Developer pushes to GitHub
        └── git push origin feature/new-feature
        
              ⬇️ CI TRIGGERS AUTOMATICALLY ⬇️
              
Step 4: CI Pipeline runs
        ├── Install dependencies
        ├── Run linting (code style check)
        ├── Build the application
        └── Run tests
        
Step 5: Developer creates Pull Request (PR)
        └── PR shows CI status (✅ or ❌)
        
Step 6: Code review + CI passes
        └── Merge to develop/main
        
              ⬇️ CD TRIGGERS AUTOMATICALLY ⬇️
              
Step 7: CD Pipeline runs
        ├── Build production images
        ├── Deploy to staging
        ├── Run smoke tests
        └── Deploy to production (if approved)
```

---

## 4. GitHub Actions Basics

### 📁 File Structure

```
your-project/
├── .github/
│   └── workflows/           ← All CI/CD files go here
│       ├── ci.yml           ← Continuous Integration
│       └── cd.yml           ← Continuous Deployment
├── backend/
├── frontend/
└── ...
```

### 📝 YAML Syntax Basics

GitHub Actions uses YAML format. Here's a quick primer:

```yaml
# This is a comment

# Key-value pairs
name: My Pipeline

# Nested structure (use 2-space indentation)
parent:
  child: value
  another_child: another_value

# Lists (use dashes)
my_list:
  - item1
  - item2
  - item3

# Multi-line strings
description: |
  This is a
  multi-line
  string
```

### 🧱 GitHub Actions Building Blocks

#### 1. **Workflow** (The whole pipeline)
```yaml
name: CI Pipeline          # Name shown in GitHub UI
on: [push, pull_request]   # When to run
jobs:                      # What to do
  ...
```

#### 2. **Trigger** (When to run)
```yaml
on:
  push:                    # Run when code is pushed
    branches: [main]       # Only on main branch
  pull_request:            # Run on PRs
    branches: [main]
  schedule:                # Run on schedule
    - cron: '0 0 * * *'   # Daily at midnight
  workflow_dispatch:       # Manual trigger button
```

#### 3. **Job** (A group of tasks)
```yaml
jobs:
  build:                   # Job name (can be anything)
    runs-on: ubuntu-latest # Machine type
    steps:                 # List of steps
      - ...
```

#### 4. **Step** (Individual task)
```yaml
steps:
  - name: Checkout code              # Human-readable name
    uses: actions/checkout@v4        # Use a pre-built action
    
  - name: Run custom command
    run: npm install                 # Run shell command
```

#### 5. **Action** (Reusable task)
```yaml
# Using a pre-built action from marketplace
- uses: actions/setup-node@v4
  with:
    node-version: '22'
    
# Using an action from another repo
- uses: owner/repo@version
```

### 🔧 Common Actions You'll Use

| Action | Purpose |
|--------|---------|
| `actions/checkout@v4` | Get your code |
| `actions/setup-node@v4` | Install Node.js |
| `actions/cache@v4` | Cache dependencies (faster builds) |
| `actions/upload-artifact@v4` | Save files between jobs |
| `docker/build-push-action@v5` | Build Docker images |

---

## 5. Your Project's CI Pipeline Explained

Let me explain your `ci.yml` file step by step:

### 📄 File Header

```yaml
name: CI Pipeline    # ← Shows in GitHub Actions tab

on:
  push:
    branches: [main, develop]    # ← Runs when you push to these branches
  pull_request:
    branches: [main, develop]    # ← Runs when PR targets these branches
```

**What this means:**
- Every time you push code to `main` or `develop`, CI runs
- Every time you open a PR to these branches, CI runs

### 🔐 Environment Variables

```yaml
env:
  NODE_VERSION: '22'                    # ← Used in all jobs
  REGISTRY: ghcr.io                     # ← GitHub Container Registry
  IMAGE_NAME: ${{ github.repository }}  # ← Your repo name
```

### 📦 Job 1: Backend Linting

```yaml
backend-lint:
  name: Backend Lint
  runs-on: ubuntu-latest    # ← Uses Ubuntu Linux machine
  defaults:
    run:
      working-directory: ./backend    # ← All commands run in /backend
```

**Steps Explained:**

```yaml
steps:
  # Step 1: Get your code from GitHub
  - name: Checkout code
    uses: actions/checkout@v4
  
  # Step 2: Install Node.js
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: ${{ env.NODE_VERSION }}
      cache: 'npm'    # ← Caches node_modules for faster builds
      cache-dependency-path: ./backend/package-lock.json
  
  # Step 3: Install npm packages
  - name: Install dependencies
    run: npm ci    # ← Like 'npm install' but faster & for CI
  
  # Step 4: Check code style
  - name: Run ESLint
    run: npm run lint
  
  # Step 5: Check formatting
  - name: Run Prettier check
    run: npx prettier --check "src/**/*.ts"
```

### 🔨 Job 2: Backend Build

```yaml
backend-build:
  name: Backend Build
  needs: backend-lint    # ← Waits for lint to pass first!
```

**Key Concept: Job Dependencies**

```
backend-lint ──────▶ backend-build ──────▶ backend-test
     ✅                    ✅                   ✅
  (must pass)          (must pass)          (final check)
```

### 🧪 Job 3: Backend Tests

```yaml
backend-test:
  name: Backend Tests
  needs: backend-build
  
  services:    # ← Spin up databases for testing!
    postgres:
      image: postgres:16-alpine
      env:
        POSTGRES_USER: test
        POSTGRES_PASSWORD: test
        POSTGRES_DB: test_db
      ports:
        - 5432:5432
      options: >-    # ← Health check to wait until ready
        --health-cmd pg_isready
        --health-interval 10s
        --health-timeout 5s
        --health-retries 5
```

**What's Happening:**
1. GitHub spins up a fresh Ubuntu machine
2. It starts PostgreSQL and Redis containers
3. Waits until databases are healthy
4. Then runs your tests!

### 🖥️ Frontend Jobs

Same pattern as backend:

```
frontend-lint ──────▶ frontend-build
     ✅                     ✅
```

### 🐳 Docker Build Job

```yaml
docker-build:
  needs: [backend-build, frontend-build]    # ← Waits for both!
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```

**This means:**
- Only runs on `main` branch
- Only runs on push (not on PRs)
- Builds and pushes Docker images to registry

### 🔍 Security Scan

```yaml
security-scan:
  name: Security Scan
  needs: [backend-lint, frontend-lint]
  
  steps:
    - name: Run npm audit
      run: npm audit --audit-level=high || true
```

**What it does:**
- Checks for known vulnerabilities in your dependencies
- `|| true` prevents build failure (just warns)

---

## 6. Your Project's CD Pipeline Explained

### 📄 Triggers

```yaml
on:
  push:
    branches: [main]          # ← Auto-deploy when main updated
    tags:
      - 'v*'                  # ← Deploy on version tags (v1.0.0)
  workflow_dispatch:          # ← Manual deploy button
    inputs:
      environment:
        description: 'Deployment environment'
        type: choice
        options:
          - staging
          - production
```

### 🏗️ Production Build

```yaml
build-production:
  outputs:
    backend-image: ${{ steps.meta-backend.outputs.tags }}
```

**Outputs** let other jobs know what was built!

### 🎭 Staging Deployment

```yaml
deploy-staging:
  needs: build-production
  if: github.ref == 'refs/heads/main'    # ← Only from main
  environment:
    name: staging
    url: https://staging.wanderly.app    # ← Shows link in GitHub
```

### 🚀 Production Deployment

```yaml
deploy-production:
  needs: [build-production, deploy-staging]    # ← After staging!
  if: startsWith(github.ref, 'refs/tags/v')    # ← Only on v* tags
  environment:
    name: production
    url: https://wanderly.app
```

**Deployment Flow:**

```
Push to main
     │
     ▼
┌─────────────┐
│   Build     │
│   Images    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │──── Automatic!
│   Staging   │
└──────┬──────┘
       │
       ▼
       │ (Only on v* tags)
       │
┌─────────────┐
│   Deploy    │──── Requires approval
│ Production  │
└─────────────┘
```

---

## 7. Step-by-Step Setup Guide

### Step 1: Push Files to GitHub

```bash
# Navigate to your project
cd /home/misthah/Documents/Wanderly

# Check if it's a git repository
git status

# If not, initialize git
git init

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/wanderly.git

# Add the CI/CD files
git add .github/
git add docker-compose.prod.yml
git add backend/Dockerfile.prod
git add frontend/Dockerfile.prod
git add .env.production.example

# Commit
git commit -m "feat: add CI/CD pipeline with GitHub Actions"

# Push
git push -u origin main
```

### Step 2: View Your Pipeline

1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. You'll see your workflows listed!

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Repository                                       │
├─────────────────────────────────────────────────────────┤
│  📁 Code  │ 🔄 Actions │ 📋 Issues │ 🔀 Pull requests   │
│           │     ▲       │           │                    │
│           │     │       │           │                    │
│           │  Click here!│           │                    │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Configure GitHub Secrets

Go to: `Settings > Secrets and variables > Actions`

Click "New repository secret" and add:

| Secret Name | What to Put |
|-------------|-------------|
| `STAGING_SSH_USER` | Your staging server username |
| `STAGING_SSH_HOST` | Your staging server IP/domain |
| `PROD_SSH_USER` | Your production server username |
| `PROD_SSH_HOST` | Your production server IP/domain |

### Step 4: Set Up Environments

Go to: `Settings > Environments`

1. Click "New environment"
2. Create `staging`
3. Create `production`
4. For `production`, add:
   - **Required reviewers**: Add yourself
   - **Wait timer**: 5 minutes (optional)

### Step 5: Test Your Pipeline

```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "test: trigger CI pipeline"
git push
```

Now go to **Actions** tab and watch the magic! 🎉

---

## 8. Advanced Concepts

### 🔀 Matrix Builds

Run tests on multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### 💾 Caching

Speed up builds by caching:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 🔐 Secrets & Variables

```yaml
# Using secrets
env:
  API_KEY: ${{ secrets.MY_API_KEY }}

# Using variables (non-sensitive)
env:
  APP_NAME: ${{ vars.APP_NAME }}
```

### 📦 Artifacts

Save files between jobs:

```yaml
# Job 1: Save
- uses: actions/upload-artifact@v4
  with:
    name: build-files
    path: dist/

# Job 2: Use
- uses: actions/download-artifact@v4
  with:
    name: build-files
    path: dist/
```

### 🔄 Reusable Workflows

Create once, use everywhere:

```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:    # ← Makes it reusable

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

```yaml
# Another workflow
jobs:
  call-tests:
    uses: ./.github/workflows/reusable-test.yml
```

### 🏷️ Manual Triggers with Inputs

```yaml
on:
  workflow_dispatch:
    inputs:
      deploy_env:
        description: 'Environment'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
      debug_mode:
        description: 'Enable debug?'
        type: boolean
        default: false
```

---

## 9. Best Practices

### ✅ DO's

| Practice | Why |
|----------|-----|
| **Use `npm ci`** instead of `npm install` | Faster and more reliable in CI |
| **Cache dependencies** | Speeds up builds significantly |
| **Use specific versions** | `node:22` not `node:latest` |
| **Keep workflows DRY** | Use reusable workflows |
| **Fail fast** | Put quick checks (lint) first |
| **Use branch protection** | Require CI pass before merge |

### ❌ DON'Ts

| Anti-pattern | Problem |
|--------------|---------|
| **Storing secrets in code** | Security risk! |
| **Skipping tests** | Defeats the purpose |
| **Large workflows** | Hard to maintain |
| **Ignoring failures** | Builds trust issues |

### 🔒 Security Best Practices

1. **Never expose secrets**
   ```yaml
   # ❌ Bad
   run: echo ${{ secrets.PASSWORD }}
   
   # ✅ Good - Secrets are masked in logs
   run: npm deploy
   env:
     PASSWORD: ${{ secrets.PASSWORD }}
   ```

2. **Pin action versions**
   ```yaml
   # ❌ Risky
   uses: actions/checkout@main
   
   # ✅ Safe
   uses: actions/checkout@v4
   ```

3. **Use least privilege**
   ```yaml
   permissions:
     contents: read    # Only what's needed
     packages: write
   ```

---

## 10. Troubleshooting

### ❌ Common Errors

#### 1. "npm ci" fails
```
Error: npm ci requires package-lock.json
```
**Fix:** Commit your `package-lock.json` file!
```bash
git add package-lock.json
git commit -m "add package-lock.json"
```

#### 2. Tests fail but pass locally
```
Error: Cannot connect to database
```
**Fix:** Make sure services are configured correctly:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    options: >-
      --health-cmd pg_isready    # Wait until ready!
```

#### 3. Docker push fails
```
Error: denied: permission denied
```
**Fix:** Make sure permissions are set:
```yaml
permissions:
  contents: read
  packages: write
```

#### 4. Deployment step fails
```
Error: Host key verification failed
```
**Fix:** Add SSH key to secrets and use:
```yaml
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan ${{ secrets.HOST }} >> ~/.ssh/known_hosts
```

### 🔍 Debugging Tips

1. **Add debug output**
   ```yaml
   - run: |
       echo "Current directory: $(pwd)"
       echo "Files: $(ls -la)"
       echo "Node version: $(node --version)"
   ```

2. **Enable debug logging**
   - Go to `Settings > Secrets > Actions`
   - Add secret: `ACTIONS_RUNNER_DEBUG` = `true`

3. **Check logs**
   - Click on failed job
   - Expand failed step
   - Read the error message!

4. **Re-run with debugging**
   - Click "Re-run jobs"
   - Check "Enable debug logging"

---

## 📚 Quick Reference Card

```yaml
# Minimal CI workflow
name: CI
on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## 🎯 Your Learning Path

1. ⬜ Read this guide completely
2. ⬜ Push the CI/CD files to GitHub
3. ⬜ Watch your first pipeline run
4. ⬜ Make a code change and see CI trigger
5. ⬜ Set up GitHub Secrets
6. ⬜ Configure environments
7. ⬜ Try manual deployment
8. ⬜ Set up branch protection rules
9. ⬜ Explore the GitHub Actions marketplace
10. ⬜ Customize your pipeline!

---

## 🔗 Useful Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [YAML Tutorial](https://learnxinyminutes.com/docs/yaml/)
- [Docker Documentation](https://docs.docker.com/)

---

*Created with ❤️ for the Wanderly Project*
