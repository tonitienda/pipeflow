import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Text} from 'react-native';
import {Canvas} from '@shopify/react-native-skia';
import GameCanvas from './components/GameCanvas';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>PipeFlow</Text>
        <Text style={styles.subtitle}>Connect the pipes!</Text>
      </View>
      <View style={styles.gameContainer}>
        <GameCanvas />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
