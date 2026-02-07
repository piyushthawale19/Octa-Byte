Set-Location "d:\Octa Byte\portfolio-dashboard"

# Set git editor to true (no-op editor) for this session only
$env:GIT_EDITOR = 'true'

Write-Host "Completing rebase..." -ForegroundColor Cyan
git rebase --continue

Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

Write-Host "`nPushing to origin..." -ForegroundColor Cyan
git push origin main

Write-Host "`nDone! Check Vercel dashboard for deployment." -ForegroundColor Green
