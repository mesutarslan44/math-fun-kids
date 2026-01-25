import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logger from './Logger';

let soundObject = null;
let isMusicEnabled = true;
let isSoundEnabled = true;

// Ses efektleri için cache ve durum takibi
let soundEffectsCache = {};
let soundPlayingState = {}; // Hangi sesler şu anda çalıyor

// Yerel arka plan müziği
const BACKGROUND_MUSIC = require('../../assets/derscalismaodaklanma.mp3');

// Ses efektleri
const SOUND_EFFECTS = {
    success: require('../../assets/success.mp3'),
    failure: require('../../assets/failure.mp3'),
    click: require('../../assets/click.wav'),
};

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
        Logger.warn('Audio init failed', e);
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
        Logger.warn('Music playback failed', e);
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

// Ses efekti çal (dosya yoksa haptic kullan)
const playSoundEffect = async (soundKey) => {
    if (!isSoundEnabled) return;
    
    const soundFile = SOUND_EFFECTS[soundKey];
    if (!soundFile) {
        // Ses dosyası yoksa haptic feedback kullan
        return;
    }

    // Eğer bu ses zaten çalıyorsa, yeni bir tane başlatma (çift ses önleme)
    if (soundPlayingState[soundKey]) {
        return;
    }

    try {
        let sound = soundEffectsCache[soundKey];
        
        // Cache'de yoksa oluştur
        if (!sound) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                soundFile,
                { volume: 0.5 }
            );
            sound = newSound;
            soundEffectsCache[soundKey] = sound;
            
            // Ses bittiğinde durumu temizle
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    soundPlayingState[soundKey] = false;
                } else if (status.isPlaying) {
                    soundPlayingState[soundKey] = true;
                }
            });
        }

        // Ses çalma durumunu işaretle
        soundPlayingState[soundKey] = true;
        
        // Sesi baştan çal (eğer çalıyorsa durdur ve baştan başlat)
        try {
            await sound.stopAsync();
        } catch (e) {
            // Zaten durmuş olabilir, sorun değil
        }
        
        await sound.playAsync();
        
    } catch (e) {
        Logger.warn(`Failed to play ${soundKey} sound`, e);
        soundPlayingState[soundKey] = false;
        // Hata durumunda haptic kullan
    }
};

// Başarı sesi + haptic
export const playSuccess = async () => {
    if (!isSoundEnabled) return;
    
    // Önce haptic (anında)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Sonra ses efekti (varsa)
    await playSoundEffect('success');
};

// Hata sesi + haptic
export const playFailure = async () => {
    if (!isSoundEnabled) return;
    
    // Önce haptic (anında)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    
    // Sonra ses efekti (varsa)
    await playSoundEffect('failure');
};

// Seçim/Click sesi + haptic
export const playSelection = async () => {
    if (!isSoundEnabled) return;
    
    // Önce haptic (anında)
    Haptics.selectionAsync();
    
    // Sonra ses efekti (varsa)
    await playSoundEffect('click');
};
