#!/usr/bin/env pwsh
Set-Location "d:\Octa Byte\portfolio-dashboard"

Write-Host "Adding changes..." -ForegroundColor Cyan
git add lib/finance/googleFinance.ts

Write-Host "Committing..." -ForegroundColor Cyan
git commit -m "fix: move cacheKey declaration to function scope for TypeScript"

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✓ Done! Vercel will auto-deploy." -ForegroundColor Green
