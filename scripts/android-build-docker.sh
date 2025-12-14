#!/bin/bash
# Script to build Android app using Docker
# This avoids installing Java and Android SDK locally

set -e

echo "🐳 Building Android app using Docker..."

# Build Docker image if needed
if ! docker images | grep -q "pipeflow-android"; then
    echo "📦 Building Docker image (first time only)..."
    docker build -t pipeflow-android -f Dockerfile.android .
fi

# Run the build inside Docker container
echo "🔨 Running Gradle build..."
docker run --rm \
    -v "$(pwd):/app" \
    -v "$HOME/.gradle:/root/.gradle" \
    -w /app \
    pipeflow-android \
    bash -c "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"

echo "✅ Android build complete!"
echo "📱 APKs are in: android/app/build/outputs/apk/"
