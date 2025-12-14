# Quick Testing Guide

## ✅ What's Been Fixed

- **Kotlin version** updated from 1.8.0 to 1.9.20 in `android/build.gradle` to fix CI build errors

## 🧪 Testing Locally (Fast Iteration)

### 1. Quick Tests (Always run these before pushing)

```bash
npm run lint          # ESLint checks (4 warnings, 0 errors currently)
npm test              # Unit tests (all passing ✅)
npx tsc --noEmit      # TypeScript type checking
```

### 2. iOS E2E Tests (if you have Xcode)

```bash
npm run e2e:build     # Build iOS app
npm run e2e:test      # Run Detox tests on simulator
```

### 3. Android E2E Tests (Docker - No Java/Android SDK needed!)

```bash
# First time: Builds Docker image with React Native Android environment
./scripts/android-build-docker.sh

# To build E2E test APKs
./scripts/android-test-docker.sh
```

**Why Docker?**

- ✅ No need to install Java 17 locally
- ✅ No need to install Android SDK
- ✅ Uses official React Native Android image
- ✅ Caches Gradle dependencies between runs
- ⚠️ First run takes ~5-10 min to download image

## 📋 Pre-Push Checklist

Before pushing to GitHub (to avoid CI failures):

1. ✅ Run `npm run lint` - should have 0 errors (warnings OK)
2. ✅ Run `npm test` - all tests should pass
3. ✅ Optional: Build Android with Docker to verify Gradle build
4. ✅ Optional: Run iOS E2E tests if you modified UI

## 🐳 Docker Commands Reference

```bash
# Build just the Android debug APK
./scripts/android-build-docker.sh

# Build the E2E test APKs
./scripts/android-test-docker.sh

# Rebuild Docker image (if needed)
docker build -t pipeflow-android -f Dockerfile.android .

# Clean up Docker image
docker rmi pipeflow-android
```

## 🔧 Alternative: Native Android Setup

If you prefer not to use Docker:

```bash
# Install Java 17
brew install openjdk@17

# Add to ~/.zshrc
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"

# Reload shell
source ~/.zshrc

# Build Android
cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug
```

## 🚀 Fastest Iteration Cycle

For most development work:

1. Make changes
2. Run `npm run lint && npm test` (takes ~5 seconds)
3. If linting/tests pass, push to GitHub
4. CI will run the full Android E2E build

Only run the full Android build locally when:

- You're debugging Android-specific issues
- You want to verify the build before creating a PR
- CI keeps failing and you need to debug

## 📝 Current Test Status

- ✅ **Unit tests**: 10/10 passing
- ✅ **Linting**: 0 errors, 4 warnings (acceptable)
- ✅ **TypeScript**: No compilation errors
- 🔨 **iOS E2E**: Should work (you have Xcode)
- 🐳 **Android E2E**: Can use Docker approach
