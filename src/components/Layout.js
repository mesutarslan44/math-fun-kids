import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../constants/theme';
import Background from './Background';

const Layout = ({ children, style }) => {
    return (
        <Background>
            <SafeAreaView style={[styles.container, style]}>
                <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
                <View style={styles.content}>
                    {children}
                </View>
            </SafeAreaView>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        padding: theme.spacing.m,
    },
});

export default Layout;
