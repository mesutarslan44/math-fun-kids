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
            {/* Body - Daha canlı kırmızı */}
            <Rect x="20" y="30" width="60" height="50" rx="10" fill="#FF4757" />
            <Rect x="22" y="32" width="56" height="46" rx="8" fill="#FF6B6B" opacity="0.8" />
            {/* Head - Daha parlak sarı */}
            <Circle cx="50" cy="30" r="25" fill="#FFD700" />
            <Circle cx="50" cy="30" r="23" fill="#FFD93D" opacity="0.9" />
            {/* Antenna */}
            <Path d="M50 5 L50 10" stroke="#1A1A2E" strokeWidth="2.5" />
            <Circle cx="50" cy="5" r="4" fill="#4D96FF" />
            <Circle cx="50" cy="5" r="2" fill="#1A1A2E" />
            {/* Gözler - Daha büyük ve canlı */}
            <Circle cx="38" cy="25" r="7" fill="white" />
            <Circle cx="38" cy="25" r="5" fill="#4D96FF" />
            <Circle cx="38" cy="25" r="3" fill="#1A1A2E" />
            <Circle cx="38" cy="24" r="1.5" fill="white" />
            <Circle cx="62" cy="25" r="7" fill="white" />
            <Circle cx="62" cy="25" r="5" fill="#4D96FF" />
            <Circle cx="62" cy="25" r="3" fill="#1A1A2E" />
            <Circle cx="62" cy="24" r="1.5" fill="white" />
            {/* Ağız - Daha belirgin */}
            {emotion === 'happy' ? (
                <Path d="M38 42 Q50 52 62 42" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M38 47 Q50 37 62 47" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            {/* Kollar - Daha belirgin */}
            <Path d="M20 40 Q10 50 20 60" stroke="#FF4757" strokeWidth="6" strokeLinecap="round" />
            <Path d="M80 40 Q90 50 80 60" stroke="#FF4757" strokeWidth="6" strokeLinecap="round" />
        </Svg>
    );

    const renderCat = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulaklar - Daha canlı turuncu */}
            <Polygon points="30,20 40,40 20,40" fill="#FF8C00" />
            <Polygon points="30,22 38,38 22,38" fill="#FFA500" />
            <Polygon points="70,20 60,40 80,40" fill="#FF8C00" />
            <Polygon points="70,22 62,38 78,38" fill="#FFA500" />
            {/* Kafa */}
            <Circle cx="50" cy="50" r="30" fill="#FF8C00" />
            <Circle cx="50" cy="50" r="28" fill="#FFA500" opacity="0.9" />
            {/* Gözler - Daha büyük ve canlı */}
            <Circle cx="38" cy="45" r="8" fill="white" />
            <Circle cx="38" cy="45" r="6" fill="#4D96FF" />
            <Circle cx="38" cy="45" r="4" fill="#1A1A2E" />
            <Circle cx="38" cy="44" r="2" fill="white" />
            <Circle cx="62" cy="45" r="8" fill="white" />
            <Circle cx="62" cy="45" r="6" fill="#4D96FF" />
            <Circle cx="62" cy="45" r="4" fill="#1A1A2E" />
            <Circle cx="62" cy="44" r="2" fill="white" />
            {/* Burun */}
            <Circle cx="50" cy="55" r="4" fill="#FF69B4" />
            <Path d="M50 59 L48 63 L52 63 Z" fill="#FF69B4" />
            {/* Bıyıklar - Daha belirgin */}
            <Path d="M20 55 L35 55" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
            <Path d="M20 60 L35 58" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
            <Path d="M80 55 L65 55" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
            <Path d="M80 60 L65 58" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M45 62 Q50 68 55 62" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M45 67 Q50 62 55 67" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    const renderDino = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Vücut - Daha canlı yeşil */}
            <Path d="M30 60 Q30 30 60 30 Q80 30 80 50 Q80 70 60 70 L30 70 Z" fill="#48BB78" />
            <Path d="M32 62 Q32 32 60 32 Q78 32 78 50 Q78 68 60 68 L32 68 Z" fill="#6BCB77" opacity="0.9" />
            {/* Kuyruk */}
            <Path d="M30 60 Q10 50 20 80" stroke="#48BB78" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Dikenler - Daha belirgin */}
            <Polygon points="40,30 45,18 50,30" fill="#1A1A2E" />
            <Polygon points="55,30 60,18 65,30" fill="#1A1A2E" />
            {/* Gözler - Daha büyük */}
            <Circle cx="65" cy="40" r="6" fill="white" />
            <Circle cx="65" cy="40" r="4" fill="#4D96FF" />
            <Circle cx="65" cy="40" r="2.5" fill="#1A1A2E" />
            <Circle cx="65" cy="39" r="1" fill="white" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M70 55 Q75 62 80 55" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M70 60 Q75 57 80 60" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            {/* Ayaklar */}
            <Rect x="40" y="70" width="6" height="12" rx="2" fill="#48BB78" />
            <Rect x="60" y="70" width="6" height="12" rx="2" fill="#48BB78" />
        </Svg>
    );

    // 🦊 Tilki - Fox
    const renderFox = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulaklar - Daha canlı turuncu-kırmızı */}
            <Polygon points="25,25 35,45 15,45" fill="#FF5722" />
            <Polygon points="25,27 33,43 17,43" fill="#FF7043" />
            <Polygon points="75,25 65,45 85,45" fill="#FF5722" />
            <Polygon points="75,27 67,43 83,43" fill="#FF7043" />
            {/* Kafa */}
            <Circle cx="50" cy="55" r="30" fill="#FF5722" />
            <Circle cx="50" cy="55" r="28" fill="#FF7043" opacity="0.9" />
            {/* Yüz - Beyaz */}
            <Circle cx="50" cy="65" r="18" fill="white" />
            {/* Gözler - Daha büyük ve canlı */}
            <Circle cx="38" cy="50" r="7" fill="white" />
            <Circle cx="38" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="38" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="38" cy="49" r="1.5" fill="white" />
            <Circle cx="62" cy="50" r="7" fill="white" />
            <Circle cx="62" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="62" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="62" cy="49" r="1.5" fill="white" />
            {/* Burun */}
            <Circle cx="50" cy="60" r="5" fill="#1A1A2E" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M45 70 Q50 76 55 70" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M45 74 Q50 69 55 74" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🐰 Tavşan - Bunny
    const renderBunny = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulaklar - Daha belirgin */}
            <Ellipse cx="35" cy="25" rx="10" ry="22" fill="#F0F0F0" />
            <Ellipse cx="35" cy="25" rx="6" ry="18" fill="#FFB6C1" />
            <Ellipse cx="65" cy="25" rx="10" ry="22" fill="#F0F0F0" />
            <Ellipse cx="65" cy="25" rx="6" ry="18" fill="#FFB6C1" />
            {/* Kafa */}
            <Circle cx="50" cy="55" r="28" fill="#F5F5F5" />
            <Circle cx="50" cy="55" r="26" fill="#E0E0E0" opacity="0.9" />
            {/* Gözler - Daha büyük */}
            <Circle cx="38" cy="50" r="7" fill="white" />
            <Circle cx="38" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="38" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="38" cy="49" r="1.5" fill="white" />
            <Circle cx="62" cy="50" r="7" fill="white" />
            <Circle cx="62" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="62" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="62" cy="49" r="1.5" fill="white" />
            {/* Burun */}
            <Circle cx="50" cy="60" r="5" fill="#FFB6C1" />
            <Circle cx="50" cy="60" r="3" fill="#FF69B4" />
            {/* Yanaklar */}
            <Circle cx="33" cy="58" r="7" fill="#FFB6C1" opacity="0.6" />
            <Circle cx="67" cy="58" r="7" fill="#FFB6C1" opacity="0.6" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M45 69 Q50 75 55 69" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M45 72 Q50 68 55 72" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🐻 Ayı - Bear
    const renderBear = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulaklar - Daha belirgin kahverengi */}
            <Circle cx="25" cy="30" r="14" fill="#654321" />
            <Circle cx="25" cy="30" r="10" fill="#8B4513" />
            <Circle cx="75" cy="30" r="14" fill="#654321" />
            <Circle cx="75" cy="30" r="10" fill="#8B4513" />
            {/* Kafa */}
            <Circle cx="50" cy="50" r="30" fill="#8B4513" />
            <Circle cx="50" cy="50" r="28" fill="#A0522D" opacity="0.9" />
            {/* Yüz - Açık kahverengi */}
            <Circle cx="50" cy="60" r="18" fill="#DEB887" />
            {/* Gözler - Daha büyük */}
            <Circle cx="38" cy="45" r="7" fill="white" />
            <Circle cx="38" cy="45" r="5" fill="#4D96FF" />
            <Circle cx="38" cy="45" r="3" fill="#1A1A2E" />
            <Circle cx="38" cy="44" r="1.5" fill="white" />
            <Circle cx="62" cy="45" r="7" fill="white" />
            <Circle cx="62" cy="45" r="5" fill="#4D96FF" />
            <Circle cx="62" cy="45" r="3" fill="#1A1A2E" />
            <Circle cx="62" cy="44" r="1.5" fill="white" />
            {/* Burun */}
            <Ellipse cx="50" cy="58" rx="7" ry="5" fill="#1A1A2E" />
            <Circle cx="50" cy="58" r="3" fill="#654321" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M44 70 Q50 76 56 70" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M44 74 Q50 69 56 74" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🦁 Aslan - Lion
    const renderLion = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Yele - Daha belirgin */}
            <Circle cx="50" cy="50" r="35" fill="#D4A373" />
            <Circle cx="50" cy="50" r="33" fill="#CD853F" opacity="0.9" />
            {/* Kafa */}
            <Circle cx="50" cy="55" r="27" fill="#FFB347" />
            <Circle cx="50" cy="55" r="25" fill="#FFD700" opacity="0.9" />
            {/* Gözler - Daha büyük */}
            <Circle cx="38" cy="50" r="7" fill="white" />
            <Circle cx="38" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="38" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="38" cy="49" r="1.5" fill="white" />
            <Circle cx="62" cy="50" r="7" fill="white" />
            <Circle cx="62" cy="50" r="5" fill="#4D96FF" />
            <Circle cx="62" cy="50" r="3" fill="#1A1A2E" />
            <Circle cx="62" cy="49" r="1.5" fill="white" />
            {/* Burun */}
            <Ellipse cx="50" cy="60" rx="6" ry="4" fill="#1A1A2E" />
            <Path d="M45 65 L50 70 L55 65" stroke="#1A1A2E" strokeWidth="2.5" fill="none" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M42 74 Q50 80 58 74" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M42 78 Q50 74 58 78" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🦉 Baykuş - Owl
    const renderOwl = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulak tüyleri */}
            <Polygon points="25,35 35,50 20,50" fill="#654321" />
            <Polygon points="25,37 33,48 22,48" fill="#8B5A2B" />
            <Polygon points="75,35 80,50 65,50" fill="#654321" />
            <Polygon points="75,37 78,48 67,48" fill="#8B5A2B" />
            {/* Vücut */}
            <Ellipse cx="50" cy="55" rx="28" ry="30" fill="#8B5A2B" />
            <Ellipse cx="50" cy="55" rx="26" ry="28" fill="#A0522D" opacity="0.9" />
            {/* Yüz */}
            <Ellipse cx="50" cy="58" rx="20" ry="22" fill="#DEB887" />
            {/* Gözler - Çok büyük (baykuş özelliği) */}
            <Circle cx="38" cy="48" r="12" fill="white" />
            <Circle cx="38" cy="48" r="8" fill="#FFD700" />
            <Circle cx="38" cy="48" r="5" fill="#1A1A2E" />
            <Circle cx="38" cy="47" r="2" fill="white" />
            <Circle cx="62" cy="48" r="12" fill="white" />
            <Circle cx="62" cy="48" r="8" fill="#FFD700" />
            <Circle cx="62" cy="48" r="5" fill="#1A1A2E" />
            <Circle cx="62" cy="47" r="2" fill="white" />
            {/* Gaga */}
            <Polygon points="50,58 45,68 55,68" fill="#FF8C00" />
            <Polygon points="50,60 47,66 53,66" fill="#FFA500" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M45 77 Q50 81 55 77" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M45 80 Q50 77 55 80" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🐼 Panda
    const renderPanda = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Kulaklar */}
            <Circle cx="25" cy="30" r="14" fill="#1A1A2E" />
            <Circle cx="25" cy="30" r="10" fill="#2C3333" />
            <Circle cx="75" cy="30" r="14" fill="#1A1A2E" />
            <Circle cx="75" cy="30" r="10" fill="#2C3333" />
            {/* Kafa */}
            <Circle cx="50" cy="55" r="30" fill="#F5F5F5" />
            <Circle cx="50" cy="55" r="28" fill="white" opacity="0.95" />
            {/* Göz lekeleri */}
            <Ellipse cx="38" cy="48" rx="12" ry="10" fill="#1A1A2E" />
            <Ellipse cx="62" cy="48" rx="12" ry="10" fill="#1A1A2E" />
            {/* Gözler */}
            <Circle cx="38" cy="48" r="6" fill="white" />
            <Circle cx="38" cy="48" r="4" fill="#4D96FF" />
            <Circle cx="38" cy="48" r="2.5" fill="#1A1A2E" />
            <Circle cx="38" cy="47" r="1" fill="white" />
            <Circle cx="62" cy="48" r="6" fill="white" />
            <Circle cx="62" cy="48" r="4" fill="#4D96FF" />
            <Circle cx="62" cy="48" r="2.5" fill="#1A1A2E" />
            <Circle cx="62" cy="47" r="1" fill="white" />
            {/* Burun */}
            <Ellipse cx="50" cy="62" rx="6" ry="4" fill="#1A1A2E" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M44 72 Q50 79 56 72" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M44 76 Q50 72 56 76" stroke="#1A1A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
        </Svg>
    );

    // 🦄 Unicorn
    const renderUnicorn = () => (
        <Svg height="150" width="150" viewBox="0 0 100 100">
            {/* Boynuz - Daha parlak altın */}
            <Polygon points="50,5 45,35 55,35" fill="#FFD700" />
            <Polygon points="50,8 47,32 53,32" fill="#FFA500" />
            <Circle cx="50" cy="5" r="3" fill="#FFD700" />
            {/* Kafa */}
            <Circle cx="50" cy="55" r="28" fill="#FFB6C1" />
            <Circle cx="50" cy="55" r="26" fill="#FFC0CB" opacity="0.9" />
            {/* Kulaklar */}
            <Ellipse cx="30" cy="30" rx="8" ry="14" fill="#FFB6C1" />
            <Ellipse cx="30" cy="30" rx="5" ry="10" fill="#FFC0CB" />
            <Ellipse cx="70" cy="30" rx="8" ry="14" fill="#FFB6C1" />
            <Ellipse cx="70" cy="30" rx="5" ry="10" fill="#FFC0CB" />
            {/* Gözler - Mor renkli */}
            <Circle cx="38" cy="50" r="7" fill="white" />
            <Circle cx="38" cy="50" r="5" fill="#9B59B6" />
            <Circle cx="38" cy="50" r="3" fill="#6A1B9A" />
            <Circle cx="38" cy="49" r="1.5" fill="white" />
            <Circle cx="62" cy="50" r="7" fill="white" />
            <Circle cx="62" cy="50" r="5" fill="#9B59B6" />
            <Circle cx="62" cy="50" r="3" fill="#6A1B9A" />
            <Circle cx="62" cy="49" r="1.5" fill="white" />
            {/* Burun */}
            <Circle cx="50" cy="60" r="4" fill="#FF69B4" />
            {/* Yele - Renkli */}
            <Path d="M30 35 Q20 40 25 50" stroke="#FF69B4" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M70 35 Q80 40 75 50" stroke="#9B59B6" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Ağız */}
            {emotion === 'happy' ? (
                <Path d="M45 70 Q50 76 55 70" stroke="#9B59B6" strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <Path d="M45 74 Q50 70 55 74" stroke="#9B59B6" strokeWidth="3" fill="none" strokeLinecap="round" />
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
