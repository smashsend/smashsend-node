# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-21

### 🚨 BREAKING CHANGES

- **contacts.create()** now returns an object with `{ contact, operationType }` instead of just the contact
  - This allows you to know whether a contact was created or updated
  - `operationType` will be either `"CREATED"` or `"UPDATED"`
  - See [examples/breaking-change-v1.0.0.ts](examples/breaking-change-v1.0.0.ts) for migration guide

### Changed

- The `contacts.create()` method response format has changed:

  ```typescript
  // Before (old)
  const contact = await client.contacts.create(options);
  console.log(contact.id);

  // After (v1.0.0)
  const { contact, operationType } = await client.contacts.create(options);
  console.log(contact.id);
  console.log(operationType); // "CREATED" or "UPDATED"
  ```

### Added

- New type `ContactCreateResponse` with contact and operation metadata
- New enum `SmashsendContactOperationType` with values `CREATED` and `UPDATED`

### Fixed

- Property type naming now uses underscores for multi-word types:
  ```typescript
  // Custom property types are now consistent
  type: SmashsendPropertyType.MULTI_SELECT;
  ```

## [0.3.1] - 2024-12-04

### Fixed

- Typo in SmashsendCountryCode (Vietnam): VE -> VN

## [0.3.0] - 2024-12-04

### Added

- Support for custom contact properties
- New methods for managing custom properties:
  - `contacts.listProperties()` - List all custom contact properties
  - `contacts.createProperty()` - Create a new custom property
  - `contacts.updateProperty()` - Update an existing custom property
- Custom properties can be included when creating or updating contacts

## [0.2.1] - 2024-11-29

### Fixed

- Export SmashsendCountryCode

## [0.2.0] - 2024-11-29

### Added

- Added all missing countries to SmashsendCountryCode enum

## [0.1.0] - 2024-11-28

Initial release
