#!/bin/bash
set -e

cd /Users/ahmedsoltani/Documents/cmmi

echo "=== Git Push Script ==="

# Initialize git if needed
if [ ! -d .git ]; then
    echo "Initializing git..."
    git init
fi

# Add all files
echo "Adding files..."
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit."
else
    echo "Committing changes..."
    git commit -m "feat: amélioration mobile complète - système tactile drag&drop, responsive design, zones tactiles optimisées, déverrouillage automatique, textes en français"
fi

# Ensure we're on main branch
git branch -M main

# Setup remote
if git remote get-url origin >/dev/null 2>&1; then
    echo "Remote already exists, updating URL..."
    git remote set-url origin https://github.com/soltaniahmed0/cmmi.git
else
    echo "Adding remote..."
    git remote add origin https://github.com/soltaniahmed0/cmmi.git
fi

# Push
echo "Pushing to GitHub..."
git push -u origin main || {
    echo "First push failed, trying force push..."
    git push -u origin main --force
}

echo "=== Done! ==="


