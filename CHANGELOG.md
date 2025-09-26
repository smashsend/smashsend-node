# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Data Migration Support**: Added `overrideCreatedAt` parameter for batch contact operations
  - ⚠️ **MIGRATION USE ONLY**: Allows preserving historical creation dates when migrating from legacy systems
  - Added `createdAt` field to `ContactCreateOptions` interface (Date type, automatically converted to ISO string)
  - Added comprehensive documentation and examples with warnings about proper usage
  - Designed specifically for one-time migrations (e.g., from Jungle or other legacy systems)
  - **WARNING**: Incorrect usage can corrupt analytics and reporting data

## [1.2.1] - 2025-01-21

### Fixed

- **Type Exports**: Added missing exports for `EmailIdentity`, `DomainIdentity`, and `EmailIdentityStatus` types
  - These types are now properly exported from the main package for external use
  - Fixes TypeScript compilation errors when using the enhanced email identities API

## [1.2.0] - 2025-01-21

### Added

- **Enhanced Email Identities API**: Updated `domains.getVerifiedIdentities()` to include status information
  - Each email now returns `{ email: string, status: EmailIdentityStatus }`
  - Each domain now returns `{ domain: string, status: EmailIdentityStatus }`
  - Status types: `"VERIFIED" | "PENDING" | "FAILED"`
  - Currently only VERIFIED identities are returned, but structure supports future expansion
  - Updated JSDoc documentation with new examples

### Changed

- **BREAKING**: `VerifiedEmailIdentities` interface updated from simple string arrays to objects with status
  - `emails: string[]` → `emails: EmailIdentity[]`
  - `domains: string[]` → `domains: DomainIdentity[]`

### Migration Guide

**Before:**

```typescript
const identities = await smashsend.domains.getVerifiedIdentities();
console.log(identities.emails); // ['user@domain.com']
console.log(identities.domains); // ['domain.com']
```

**After:**

```typescript
const identities = await smashsend.domains.getVerifiedIdentities();
console.log(identities.emails); // [{ email: 'user@domain.com', status: 'VERIFIED' }]
console.log(identities.domains); // [{ domain: 'domain.com', status: 'VERIFIED' }]

// To get just the email strings (for backward compatibility):
const emailStrings = identities.emails.map((e) => e.email);
const domainStrings = identities.domains.map((d) => d.domain);
```

## [1.1.0] - 2025-01-21

### Added

- **Domains API**: New `domains` resource with `getVerifiedIdentities()` method
  - Returns verified email addresses and domains for the workspace
  - Includes default workspace email and custom verified domains
  - Used by Zapier integration for dynamic "From" field population

### Documentation

- Added comprehensive documentation for the Domains API in JSDoc comments

## [1.0.2] - 2025-01-21

### Added

- Added `typeConfig` parameter to `CustomPropertyCreateOptions` interface to support property configuration during creation
  - `multiple`: boolean - Enable multiple values for SELECT/MULTI_SELECT types
  - `options`: string[] - Define predefined options for SELECT/MULTI_SELECT types
  - `isRequired`: boolean - Mark property as required
  - `isDeletable`: boolean - Control whether property can be deleted

### Fixed

- Fixed issue where `typeConfig` was not being passed when creating contact properties

## [1.0.1] - 2025-01-21

_Note: Version 1.0.1 was the actual initial release. Version 1.0.0 was not published._

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
