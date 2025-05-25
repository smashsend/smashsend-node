#!/bin/bash

# Build and Publish Script for SmashSend Node SDK
echo "🚀 Building and publishing @smashsend/node package..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linter..."
npm run lint:fix

# Run tests
echo "🧪 Running tests..."
npm test

# Build the package
echo "🔨 Building package..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not created"
    exit 1
fi

echo "✅ Build completed successfully!"

# Show what will be published
echo "📋 Files that will be published:"
npm pack --dry-run

# Ask for confirmation before publishing
read -p "🤔 Do you want to publish this version to npm? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Publishing to npm..."
    npm publish
    echo "🎉 Package published successfully!"
    echo "📝 Don't forget to update the Zapier project to use the new version!"
else
    echo "⏸️  Publishing cancelled. You can publish later with: npm publish"
fi

echo "✨ Done!" 