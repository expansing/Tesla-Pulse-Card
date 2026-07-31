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
6. Push the commit to `main`. The **Release** workflow creates and publishes
  `v<VERSION>` automatically when that tag does not already exist.
7. Use manual dispatch only to republish or explicitly reuse an existing
  matching tag.
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
- A push to `main` creates its matching tag only after validation and archive
  creation succeed. Existing version tags are not republished on ordinary
  branch pushes.
- The release workflow fails if tag, `VERSION`, and `CHANGELOG.md` are not in
  sync.
- GitHub release notes are taken from the matching section in `CHANGELOG.md`.