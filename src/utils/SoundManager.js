import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

let soundObject = null;
let isMusicEnabled = true;
let isSoundEnabled = true;

// Yerel arka plan müziği
const BACKGROUND_MUSIC = require('../../assets/derscalismaodaklanma.mp3');

export const initAudio = async () => {
    try {
        const musicSetting = await AsyncStorage.getItem('musicEnabled');
        const soundSetting = await AsyncStorage.getItem('soundEnabled');

        isMusicEnabled = musicSetting !== 'false';
        isSoundEnabled = soundSetting !== 'false';

        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
        });

        if (isMusicEnabled) {
            playBackgroundMusic();
        }
    } catch (e) {
        console.warn('Audio init failed', e);
    }
};

export const playBackgroundMusic = async () => {
    if (!isMusicEnabled) return;
    try {
        if (soundObject) {
            await soundObject.playAsync();
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            BACKGROUND_MUSIC,
            { isLooping: true, volume: 0.3 }
        );
        soundObject = sound;
        await sound.playAsync();
    } catch (e) {
        console.warn('Music playback failed', e);
    }
};

export const stopBackgroundMusic = async () => {
    try {
        if (soundObject) {
            await soundObject.pauseAsync();
        }
    } catch (e) { }
};

export const setMusicEnabled = async (enabled) => {
    isMusicEnabled = enabled;
    await AsyncStorage.setItem('musicEnabled', enabled.toString());
    if (enabled) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
};

export const setSoundEnabled = async (enabled) => {
    isSoundEnabled = enabled;
    await AsyncStorage.setItem('soundEnabled', enabled.toString());
};

export const getAudioSettings = () => ({
    music: isMusicEnabled,
    sound: isSoundEnabled,
});

// Only haptic feedback - no robotic TTS
export const playSuccess = () => {
    if (!isSoundEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const playFailure = () => {
    if (!isSoundEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

export const playSelection = () => {
    if (!isSoundEnabled) return;
    Haptics.selectionAsync();
};
