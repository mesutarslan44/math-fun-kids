import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/components/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ParentStatsScreen from './src/screens/ParentStatsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import TimeRaceScreen from './src/screens/TimeRaceScreen';
import ThemeStoreScreen from './src/screens/ThemeStoreScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import BilsemLevelScreen from './src/screens/BilsemLevelScreen';
import BilsemGameScreen from './src/screens/BilsemGameScreen';
import MemoryLevelScreen from './src/screens/MemoryLevelScreen';
import MemoryGameScreen from './src/screens/MemoryGameScreen';
import CubeLevelScreen from './src/screens/CubeLevelScreen';
import CubeGameScreen from './src/screens/CubeGameScreen';
import SymmetryLevelScreen from './src/screens/SymmetryLevelScreen';
import SymmetryGameScreen from './src/screens/SymmetryGameScreen';
import CipherLevelScreen from './src/screens/CipherLevelScreen';
import CipherGameScreen from './src/screens/CipherGameScreen';
import ShadowLevelScreen from './src/screens/ShadowLevelScreen';
import ShadowGameScreen from './src/screens/ShadowGameScreen';
import ParentInfoScreen from './src/screens/ParentInfoScreen';
import { initAudio } from './src/utils/SoundManager';
import { initErrorReporting } from './src/utils/ErrorReporting';
import ErrorBoundary from './src/components/ErrorBoundary';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize error reporting first
    initErrorReporting();
    // Then initialize audio
    initAudio();
  }, []);

  if (showSplash) {
    return (
      <ErrorBoundary>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ParentStats" component={ParentStatsScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="TimeRace" component={TimeRaceScreen} />
          <Stack.Screen name="ThemeStore" component={ThemeStoreScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="BilsemLevels" component={BilsemLevelScreen} />
          <Stack.Screen name="BilsemGame" component={BilsemGameScreen} />
          <Stack.Screen name="MemoryLevels" component={MemoryLevelScreen} />
          <Stack.Screen name="MemoryGame" component={MemoryGameScreen} />
          <Stack.Screen name="CubeLevels" component={CubeLevelScreen} />
          <Stack.Screen name="CubeGame" component={CubeGameScreen} />
          <Stack.Screen name="SymmetryLevels" component={SymmetryLevelScreen} />
          <Stack.Screen name="SymmetryGame" component={SymmetryGameScreen} />
          <Stack.Screen name="CipherLevels" component={CipherLevelScreen} />
          <Stack.Screen name="CipherGame" component={CipherGameScreen} />
          <Stack.Screen name="ShadowLevels" component={ShadowLevelScreen} />
          <Stack.Screen name="ShadowGame" component={ShadowGameScreen} />
          <Stack.Screen name="ParentInfo" component={ParentInfoScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
