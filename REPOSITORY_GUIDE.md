# Repository Setup Guide

**Last Updated**: 2025-11-04

## Your BetterChat Repositories

You have **two separate repositories** for different purposes:

### 1. 🏗️ Custom Development Repo: `jezweb/betterchat`
**Location**: `/home/jez/Documents/betterchat`
**GitHub**: https://github.com/jezweb/betterchat
**Purpose**: Your custom playground for client projects and experimentation

**Use This For:**
- Client-specific branding and customizations
- Experimenting with new features
- Deploying to Vercel for clients
- Building custom versions

**Remote Setup:**
```bash
origin  → https://github.com/jezweb/betterchat.git (your custom repo)
upstream → https://github.com/cgoinglove/better-chatbot.git (original project)
```

**Notes:**
- This is NOT a fork (standalone repository)
- Can't create PRs directly from this repo
- Free to modify however you want
- Keep synced with upstream manually if you want updates

---

### 2. 🤝 Contribution Fork: `jezweb/better-chatbot`
**Location**: `/home/jez/Documents/better-chatbot-fork`
**GitHub**: https://github.com/jezweb/better-chatbot
**Purpose**: Clean fork for contributing features back to upstream

**Use This For:**
- Developing features to contribute upstream
- Creating PRs to cgoinglove/better-chatbot
- Staying synced with upstream changes
- Testing upstream updates before applying to custom repo

**Remote Setup:**
```bash
origin   → https://github.com/jezweb/better-chatbot.git (your fork)
upstream → https://github.com/cgoinglove/better-chatbot.git (original project)
betterchat → /home/jez/Documents/betterchat (your custom repo)
```

**Notes:**
- This IS a proper fork (linked to upstream on GitHub)
- Can create PRs easily
- Keep this clean (no client-specific stuff)
- Sync regularly with upstream/main

---

## Workflow Examples

### Contributing a Feature to Upstream

**Use**: `/home/jez/Documents/better-chatbot-fork`

```bash
cd /home/jez/Documents/better-chatbot-fork

# 1. Sync with upstream
git checkout main
git pull upstream main
git push origin main

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Make changes, commit
git add .
git commit -m "feat: Add new feature"

# 4. Push to your fork
git push origin feature/new-feature

# 5. Create PR to upstream
gh pr create --repo cgoinglove/better-chatbot \
  --head jezweb:feature/new-feature \
  --base main \
  --title "feat: Add new feature" \
  --body "Description here"
```

---

### Building a Client-Specific Version

**Use**: `/home/jez/Documents/betterchat` OR create new directory

#### Option A: Use Existing Custom Repo
```bash
cd /home/jez/Documents/betterchat

# Create client branch
git checkout -b client/acme-corp

# Make client-specific changes
# - Add their branding
# - Customize features
# - etc.

git commit -m "feat: ACME Corp customizations"
git push origin client/acme-corp

# Deploy to Vercel with custom domain
vercel --prod
```

#### Option B: Create Separate Repo for Client (Recommended for multiple clients)
```bash
cd /home/jez/Documents

# Clone your custom repo as starting point
git clone https://github.com/jezweb/betterchat.git betterchat-acme

cd betterchat-acme

# Create new GitHub repo
gh repo create jezweb/betterchat-acme --private --source=. --remote=origin --push

# Now customize for ACME
# - Update branding
# - Client-specific features
# - Deploy to Vercel
```

---

### Syncing Upstream Updates to Your Custom Repo

When upstream releases new features you want:

```bash
# In your contribution fork (easier to test first)
cd /home/jez/Documents/better-chatbot-fork
git checkout main
git pull upstream main
git push origin main

# Test the changes
pnpm install
pnpm build
pnpm dev

# If all good, apply to custom repo
cd /home/jez/Documents/betterchat
git fetch upstream
git checkout main
git merge upstream/main
# Resolve any conflicts with your customizations
git push origin main
```

---

## Creating New Client Versions

### Recommended Approach: Separate Repos

For each client, create a new repository:

1. **Clone your custom repo** as starting point
2. **Create new GitHub repo** for the client
3. **Customize** branding/features
4. **Deploy** to Vercel with client subdomain

**Advantages:**
- Clean separation per client
- Different deploy pipelines
- No branch confusion
- Easy to manage multiple clients

**Example Structure:**
```
/home/jez/Documents/
├── betterchat/              # Your main custom repo
├── better-chatbot-fork/     # Contribution fork
├── betterchat-client-a/     # Client A version
├── betterchat-client-b/     # Client B version
└── betterchat-client-c/     # Client C version
```

---

## Current PR

**Timeline Feature PR**:
- **URL**: https://github.com/cgoinglove/better-chatbot/pull/307
- **Status**: Open, awaiting review
- **Branch**: `feature/timeline-visualization` in `jezweb/better-chatbot`
- **Clean**: No contaminated files, proper fork structure

---

## Future Contributions Ideas

Track potential features to contribute in `/docs/features/CONTRIBUTION_IDEAS.md`

---

## Quick Reference

| Task | Repository | Command |
|------|------------|---------|
| Contribute feature | better-chatbot-fork | `cd /home/jez/Documents/better-chatbot-fork` |
| Client work | betterchat | `cd /home/jez/Documents/betterchat` |
| New client repo | new directory | `git clone https://github.com/jezweb/betterchat.git betterchat-newclient` |
| Sync upstream | either repo | `git pull upstream main` |
| Create PR | better-chatbot-fork | `gh pr create --repo cgoinglove/better-chatbot ...` |

---

## Notes

- **Never commit client secrets** to any repository
- **Use environment variables** for sensitive data
- **Private repos** for client projects (GitHub private or self-hosted)
- **Document customizations** in each client repo's README
- **Tag releases** when deploying to clients

---

**Questions?** Check SESSION.md or CLAUDE.md for more context.
