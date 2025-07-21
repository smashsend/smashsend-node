# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-21

### BREAKING CHANGES

- Removed the following property types that don't exist in the backend:
  - `SmashsendPropertyType.TEXT` - use `STRING` instead
  - `SmashsendPropertyType.INTEGER` - use `NUMBER` instead
  - `SmashsendPropertyType.EMAIL` - use `STRING` instead
  - `SmashsendPropertyType.URL` - use `STRING` instead
  - `SmashsendPropertyType.PHONE` - use `STRING` instead

### Added

- `SmashsendPropertyType.SELECT` - for single choice dropdown fields
- `SmashsendPropertyType.MULTI_SELECT` - for multiple choice selection fields
- Montenegro (ME) country code to `SmashsendCountryCode` enum
- Comprehensive TypeScript example for contact properties (`examples/contact-properties.ts`)
- Contact Properties section in README with proper documentation

### Fixed

- Property types now correctly match the backend implementation
- Only 6 property types are supported: SELECT, MULTI_SELECT, STRING, NUMBER, DATE, BOOLEAN

### Migration Guide

If you were using any of the removed property types, update your code as follows:

```typescript
// Before
type: SmashsendPropertyType.TEXT → type: SmashsendPropertyType.STRING
type: SmashsendPropertyType.INTEGER → type: SmashsendPropertyType.NUMBER
type: SmashsendPropertyType.EMAIL → type: SmashsendPropertyType.STRING
type: SmashsendPropertyType.URL → type: SmashsendPropertyType.STRING
type: SmashsendPropertyType.PHONE → type: SmashsendPropertyType.STRING
```

For dropdown/select fields, use the new types:

```typescript
// Single choice dropdown
type: SmashsendPropertyType.SELECT;

// Multiple choice selection
type: SmashsendPropertyType.MULTI_SELECT;
```
