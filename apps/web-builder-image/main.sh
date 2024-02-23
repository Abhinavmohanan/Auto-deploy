#!/bin/bash

git clone "$GITHUB_REPO_URL" /app/project

exec node script.js

