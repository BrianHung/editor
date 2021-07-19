#!/usr/bin/env sh

# abort on errors
set -e

# create a new orphan branch
git checkout --orphan mirror main
git add -A
git commit -m ":egg:"

# force push to github repo
git push -f https://github.com/BrianHung/editor.git mirror:main 

# delete orphan branch
git checkout main 
git branch -D mirror