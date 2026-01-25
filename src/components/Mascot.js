import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle, Rect, Path, Ellipse, Polygon } from 'react-native-svg';

const Mascot = ({ emotion = 'happy', type = 'robot', style }) => {
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -10,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const renderRobot = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Rect x="20" y="30" width="60" height="50" rx="10" fill="#FF6B6B" />
            <Circle cx="50" cy="30" r="25" fill="#FFD93D" />
            <Path d="M50 5 L50 10" stroke="#2C3333" strokeWidth="2" />
            <Circle cx="50" cy="5" r="3" fill="#4D96FF" />
            <Circle cx="40" cy="25" r="5" fill="white" />
            <Circle cx="40" cy="25" r="2" fill="black" />
            <Circle cx="60" cy="25" r="5" fill="white" />
            <Circle cx="60" cy="25" r="2" fill="black" />
            {emotion === 'happy' ? (
                <Path d="M40 40 Q50 50 60 40" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M40 45 Q50 35 60 45" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
            <Path d="M20 40 Q10 50 20 60" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" />
            <Path d="M80 40 Q90 50 80 60" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" />
        </Svg>
    );

    const renderCat = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Polygon points="30,20 40,40 20,40" fill="#FFA500" />
            <Polygon points="70,20 60,40 80,40" fill="#FFA500" />
            <Circle cx="50" cy="50" r="30" fill="#FFA500" />
            <Circle cx="40" cy="45" r="5" fill="white" />
            <Circle cx="40" cy="45" r="2" fill="black" />
            <Circle cx="60" cy="45" r="5" fill="white" />
            <Circle cx="60" cy="45" r="2" fill="black" />
            <Circle cx="50" cy="55" r="3" fill="pink" />
            <Path d="M20 55 L35 55" stroke="black" strokeWidth="1" />
            <Path d="M20 60 L35 58" stroke="black" strokeWidth="1" />
            <Path d="M80 55 L65 55" stroke="black" strokeWidth="1" />
            <Path d="M80 60 L65 58" stroke="black" strokeWidth="1" />
            {emotion === 'happy' ? (
                <Path d="M45 60 Q50 65 55 60" stroke="black" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M45 65 Q50 60 55 65" stroke="black" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    const renderDino = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Path d="M30 60 Q30 30 60 30 Q80 30 80 50 Q80 70 60 70 L30 70 Z" fill="#6BCB77" />
            <Path d="M30 60 Q10 50 20 80" stroke="#6BCB77" strokeWidth="5" fill="none" />
            <Polygon points="40,30 45,20 50,30" fill="#2C3333" />
            <Polygon points="55,30 60,20 65,30" fill="#2C3333" />
            <Circle cx="65" cy="40" r="3" fill="white" />
            <Circle cx="65" cy="40" r="1" fill="black" />
            {emotion === 'happy' ? (
                <Path d="M70 55 Q75 60 80 55" stroke="black" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M70 60 Q75 55 80 60" stroke="black" strokeWidth="2" fill="none" />
            )}
            <Rect x="40" y="70" width="5" height="10" fill="#6BCB77" />
            <Rect x="60" y="70" width="5" height="10" fill="#6BCB77" />
        </Svg>
    );

    // 🦊 Tilki - Fox
    const renderFox = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Polygon points="25,25 35,45 15,45" fill="#FF7043" />
            <Polygon points="75,25 65,45 85,45" fill="#FF7043" />
            <Circle cx="50" cy="55" r="30" fill="#FF7043" />
            <Circle cx="50" cy="65" r="15" fill="white" />
            <Circle cx="40" cy="50" r="4" fill="white" />
            <Circle cx="40" cy="50" r="2" fill="#2C3333" />
            <Circle cx="60" cy="50" r="4" fill="white" />
            <Circle cx="60" cy="50" r="2" fill="#2C3333" />
            <Circle cx="50" cy="60" r="4" fill="#2C3333" />
            {emotion === 'happy' ? (
                <Path d="M45 68 Q50 73 55 68" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M45 72 Q50 67 55 72" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🐰 Tavşan - Bunny
    const renderBunny = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Ellipse cx="35" cy="25" rx="8" ry="20" fill="#E0E0E0" />
            <Ellipse cx="35" cy="25" rx="4" ry="15" fill="pink" />
            <Ellipse cx="65" cy="25" rx="8" ry="20" fill="#E0E0E0" />
            <Ellipse cx="65" cy="25" rx="4" ry="15" fill="pink" />
            <Circle cx="50" cy="55" r="28" fill="#E0E0E0" />
            <Circle cx="40" cy="50" r="4" fill="white" />
            <Circle cx="40" cy="50" r="2" fill="black" />
            <Circle cx="60" cy="50" r="4" fill="white" />
            <Circle cx="60" cy="50" r="2" fill="black" />
            <Circle cx="50" cy="60" r="4" fill="pink" />
            <Circle cx="35" cy="58" r="6" fill="pink" opacity="0.5" />
            <Circle cx="65" cy="58" r="6" fill="pink" opacity="0.5" />
            {emotion === 'happy' ? (
                <Path d="M45 67 Q50 72 55 67" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M45 70 Q50 66 55 70" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🐻 Ayı - Bear
    const renderBear = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Circle cx="25" cy="30" r="12" fill="#8B4513" />
            <Circle cx="75" cy="30" r="12" fill="#8B4513" />
            <Circle cx="50" cy="50" r="30" fill="#A0522D" />
            <Circle cx="50" cy="60" r="15" fill="#DEB887" />
            <Circle cx="40" cy="45" r="4" fill="white" />
            <Circle cx="40" cy="45" r="2" fill="black" />
            <Circle cx="60" cy="45" r="4" fill="white" />
            <Circle cx="60" cy="45" r="2" fill="black" />
            <Ellipse cx="50" cy="58" rx="6" ry="4" fill="#2C3333" />
            {emotion === 'happy' ? (
                <Path d="M44 68 Q50 73 56 68" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M44 72 Q50 67 56 72" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🦁 Aslan - Lion
    const renderLion = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="35" fill="#D4A373" />
            <Circle cx="50" cy="55" r="25" fill="#FFB347" />
            <Circle cx="40" cy="50" r="4" fill="white" />
            <Circle cx="40" cy="50" r="2" fill="#2C3333" />
            <Circle cx="60" cy="50" r="4" fill="white" />
            <Circle cx="60" cy="50" r="2" fill="#2C3333" />
            <Ellipse cx="50" cy="60" rx="5" ry="3" fill="#2C3333" />
            <Path d="M45 65 L50 70 L55 65" stroke="#2C3333" strokeWidth="2" fill="none" />
            {emotion === 'happy' ? (
                <Path d="M42 72 Q50 78 58 72" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M42 76 Q50 72 58 76" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🦉 Baykuş - Owl
    const renderOwl = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Polygon points="25,35 35,50 20,50" fill="#8B5A2B" />
            <Polygon points="75,35 80,50 65,50" fill="#8B5A2B" />
            <Ellipse cx="50" cy="55" rx="28" ry="30" fill="#A0522D" />
            <Ellipse cx="50" cy="58" rx="18" ry="20" fill="#DEB887" />
            <Circle cx="38" cy="48" r="10" fill="white" />
            <Circle cx="38" cy="48" r="5" fill="#FFD700" />
            <Circle cx="38" cy="48" r="2" fill="black" />
            <Circle cx="62" cy="48" r="10" fill="white" />
            <Circle cx="62" cy="48" r="5" fill="#FFD700" />
            <Circle cx="62" cy="48" r="2" fill="black" />
            <Polygon points="50,58 45,68 55,68" fill="#FF8C00" />
            {emotion === 'happy' ? (
                <Path d="M45 75 Q50 78 55 75" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M45 78 Q50 75 55 78" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🐼 Panda
    const renderPanda = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Circle cx="25" cy="30" r="12" fill="#2C3333" />
            <Circle cx="75" cy="30" r="12" fill="#2C3333" />
            <Circle cx="50" cy="55" r="30" fill="white" />
            <Ellipse cx="38" cy="48" rx="10" ry="8" fill="#2C3333" />
            <Ellipse cx="62" cy="48" rx="10" ry="8" fill="#2C3333" />
            <Circle cx="38" cy="48" r="4" fill="white" />
            <Circle cx="38" cy="48" r="2" fill="black" />
            <Circle cx="62" cy="48" r="4" fill="white" />
            <Circle cx="62" cy="48" r="2" fill="black" />
            <Ellipse cx="50" cy="62" rx="5" ry="3" fill="#2C3333" />
            {emotion === 'happy' ? (
                <Path d="M44 70 Q50 76 56 70" stroke="#2C3333" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M44 74 Q50 70 56 74" stroke="#2C3333" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    // 🦄 Unicorn
    const renderUnicorn = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            <Polygon points="50,5 45,35 55,35" fill="#FFD700" />
            <Circle cx="50" cy="55" r="28" fill="#FFB6C1" />
            <Ellipse cx="30" cy="30" rx="6" ry="12" fill="#FFB6C1" />
            <Ellipse cx="70" cy="30" rx="6" ry="12" fill="#FFB6C1" />
            <Circle cx="40" cy="50" r="4" fill="white" />
            <Circle cx="40" cy="50" r="2" fill="#9B59B6" />
            <Circle cx="60" cy="50" r="4" fill="white" />
            <Circle cx="60" cy="50" r="2" fill="#9B59B6" />
            <Circle cx="50" cy="60" r="3" fill="#FF69B4" />
            <Path d="M30 35 Q20 40 25 50" stroke="#FF69B4" strokeWidth="3" fill="none" />
            <Path d="M70 35 Q80 40 75 50" stroke="#9B59B6" strokeWidth="3" fill="none" />
            {emotion === 'happy' ? (
                <Path d="M45 68 Q50 73 55 68" stroke="#9B59B6" strokeWidth="2" fill="none" />
            ) : (
                <Path d="M45 72 Q50 68 55 72" stroke="#9B59B6" strokeWidth="2" fill="none" />
            )}
        </Svg>
    );

    const renderMascot = () => {
        switch (type) {
            case 'robot': return renderRobot();
            case 'cat': return renderCat();
            case 'dino': return renderDino();
            case 'fox': return renderFox();
            case 'bunny': return renderBunny();
            case 'bear': return renderBear();
            case 'lion': return renderLion();
            case 'owl': return renderOwl();
            case 'panda': return renderPanda();
            case 'unicorn': return renderUnicorn();
            default: return renderRobot();
        }
    };

    return (
        <Animated.View style={[{ transform: [{ translateY: bounceAnim }] }, style]}>
            {renderMascot()}
        </Animated.View>
    );
};

export default Mascot;
