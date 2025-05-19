# SMASHSEND Python CI/CD

This directory contains CI/CD workflows for the SMASHSEND Python SDK.

## Automated Publishing Workflow

The package is automatically published to PyPI when code is pushed to either:

- `beta` branch (creates beta releases)
- `main` branch (creates stable releases)

### Version Management

The workflow automatically handles versioning:

#### Beta Branch

- When pushing to `beta`:
  - If the current version does not have a beta suffix, it increments the patch version and adds `-beta.1`
  - If the current version already has a beta suffix, it increments the beta number
  - Example: `0.1.0` → `0.1.1-beta.1` → `0.1.1-beta.2`

#### Main Branch

- When pushing to `main`:
  - If the current version has a beta suffix, it removes the suffix
  - If the current version does not have a beta suffix, it increments the patch version
  - Example: `0.1.1-beta.3` → `0.1.1` or `0.1.1` → `0.1.2`

### Git Tags

The workflow automatically creates git tags for each release in the format `v1.2.3` or `v1.2.3-beta.4`.

## How to Set Up Secrets

To use this workflow, you need to set up the following GitHub secrets:

1. Go to your repository settings
2. Select "Secrets and variables" → "Actions"
3. Add the following secrets:
   - `PYPI_USERNAME`: Set to `__token__`
   - `PYPI_PASSWORD`: Your PyPI API token

## Workflow Steps

1. Code is pushed to `beta` or `main` branch
2. GitHub Actions workflow runs automatically
3. Version is updated based on branch
4. Package is built and published to PyPI
5. Git tag is created for the release
