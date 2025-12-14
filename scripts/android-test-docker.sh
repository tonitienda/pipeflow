#!/bin/bash
# Script to run Android E2E tests using Docker
# Note: This builds the APKs, but actual tests need an emulator/device

set -e

echo "🐳 Running Android E2E build with Docker..."

# Build Docker image if needed
if ! docker images | grep -q "pipeflow-android"; then
    echo "📦 Building Docker image (first time only)..."
    docker build -t pipeflow-android -f Dockerfile.android .
fi

# Run the Detox build
echo "🔨 Running Detox build..."
docker run --rm \
    -v "$(pwd):/app" \
    -v "$HOME/.gradle:/root/.gradle" \
    -w /app \
    pipeflow-android \
    bash -c "npm run e2e:build:android"

echo "✅ Android E2E build complete!"
echo ""
echo "⚠️  Note: To run the actual tests, you need an Android emulator or device."
echo "The APKs are ready in: android/app/build/outputs/apk/"
