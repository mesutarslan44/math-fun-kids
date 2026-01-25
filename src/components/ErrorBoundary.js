import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react-native';
import theme from '../constants/theme';
import { captureException } from '../utils/ErrorReporting';
import Logger from '../utils/Logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        Logger.error('ErrorBoundary caught an error', error, errorInfo);
        
        // Report to Sentry
        captureException(error, {
            componentStack: errorInfo.componentStack,
        });

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.iconContainer}>
                            <AlertTriangle color={theme.colors.secondary} size={64} />
                        </View>
                        
                        <Text style={styles.title}>Bir Hata Oluştu</Text>
                        <Text style={styles.message}>
                            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen uygulamayı yeniden başlatmayı deneyin.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Hata Detayları (Sadece Geliştirme):</Text>
                                <Text style={styles.errorText}>
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.errorText}>
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </View>
                        )}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={this.handleReset}
                            >
                                <RefreshCw color={theme.colors.white} size={20} />
                                <Text style={styles.buttonText}>Yeniden Dene</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.secondaryButton]}
                                onPress={() => {
                                    // Navigate to home if navigation is available
                                    if (this.props.onNavigateHome) {
                                        this.props.onNavigateHome();
                                    }
                                    this.handleReset();
                                }}
                            >
                                <Home color={theme.colors.primary} size={20} />
                                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Ana Sayfa</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    errorDetails: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        width: '100%',
        maxHeight: 200,
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.textLight,
        fontFamily: 'monospace',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 10,
    },
    primaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    secondaryButtonText: {
        color: theme.colors.primary,
    },
});

export default ErrorBoundary;
