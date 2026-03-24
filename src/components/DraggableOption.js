import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import theme from '../constants/theme';

const DraggableOption = ({ 
    option, 
    index, 
    onSelect, 
    isSelected, 
    isCorrect, 
    showAsCorrect, 
    showAsWrong,
    disabled,
    style,
    onDragStateChange,
}) => {
    const handlePress = () => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect(option);
    };

    return (
        <TouchableOpacity
            style={[styles.optionBtn, style, showAsCorrect && styles.correctOption, showAsWrong && styles.wrongOption]}
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {!showAsCorrect && !showAsWrong && (
                <LinearGradient
                    colors={['#ffffff', '#f8f8f8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}
            
            {showAsCorrect && (
                <LinearGradient
                    colors={['#6BCB77', '#5AB869']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}
            
            {showAsWrong && (
                <LinearGradient
                    colors={['#FF6B6B', '#E55555']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}

            <Text style={[
                styles.optionText,
                (showAsCorrect || showAsWrong) && styles.optionTextSelected,
            ]}>
                {option}
            </Text>
            
            {showAsCorrect && <Text style={styles.checkMark}>✓</Text>}
            {showAsWrong && <Text style={styles.wrongMark}>✗</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    optionBtn: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 22,
        minHeight: 70,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    correctOption: {
        borderColor: '#6BCB77',
    },
    wrongOption: {
        borderColor: '#FF6B6B',
    },
    optionText: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: '#ffffff',
        fontWeight: '900',
    },
    checkMark: {
        position: 'absolute',
        top: 12,
        right: 12,
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    wrongMark: {
        position: 'absolute',
        top: 12,
        right: 12,
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
});

export default DraggableOption;
