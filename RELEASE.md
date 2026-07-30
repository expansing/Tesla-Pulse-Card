# Release Guide

## One-Time Setup

- Push this project to GitHub.
- In Home Assistant HACS, add the repository as a custom frontend repository.

## Release Checklist

1. Update card behavior and documentation as needed.
2. Bump `VERSION` (example: `0.1.1`).
3. Add a matching section to `CHANGELOG.md` with the same version number.
4. Verify `tesla-pulse-card.js` is the artifact you want to ship.
5. Commit changes.
6. Run the **Release** workflow manually. Leave its tag input empty to create
  and publish `v<VERSION>`, or enter an existing matching tag to reuse it.
7. Wait for the GitHub Actions Release workflow to publish the release.
8. In HACS, open the repository and install or update to the new release.

## Commands

```bash
git add .
echo "0.1.1" > VERSION
# Update CHANGELOG.md with a new "## [0.1.1] - YYYY-MM-DD" section.
git add .
git commit -m "Release v0.1.1"
git push origin main
```

## Notes

- Validation runs on every push and pull request.
- The release workflow uploads both `tesla-pulse-card.js` and
  `tesla-pulse-card.zip`.
- A manually dispatched release creates its matching tag only after validation
  and archive creation succeed.
- The release workflow fails if tag, `VERSION`, and `CHANGELOG.md` are not in
  sync.
- GitHub release notes are taken from the matching section in `CHANGELOG.md`.