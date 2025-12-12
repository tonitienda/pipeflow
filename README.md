# PipeFlow

A small puzzle game built with React Native and Skia.

## Description

PipeFlow is a puzzle game where you need to connect pipes from a source (green) to a target (red) by rotating pipe segments. The game uses Skia for rendering the game canvas with smooth graphics.

## Features

- **Skia-powered graphics**: Uses `@shopify/react-native-skia` for high-performance canvas rendering
- **Interactive gameplay**: Tap on pipes to rotate them and create connections
- **Puzzle mechanics**: Multiple pipe types (straight, corner, T-junction, cross)
- **Visual feedback**: Color-coded source (green) and target (red) pipes

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run on iOS:
   ```bash
   npm run ios
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

## Game Elements

- **Pipe Types**:
  - Straight pipes (2 connections)
  - Corner pipes (2 connections at 90°)
  - T-junction pipes (3 connections)
  - Cross pipes (4 connections)

- **Controls**: Tap any pipe (except source and target) to rotate it 90° clockwise

## Technology Stack

- React Native 0.72.6
- @shopify/react-native-skia for canvas rendering
- TypeScript for type safety
- React hooks for state management
