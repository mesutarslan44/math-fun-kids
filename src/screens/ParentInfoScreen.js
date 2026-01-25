import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BookOpen, ArrowLeft, GraduationCap, Target, Search, Users, HelpCircle } from 'lucide-react-native';
import Layout from '../components/Layout';
import theme from '../constants/theme';

const ParentInfoScreen = ({ navigation }) => {
    return (
        <Layout>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color={theme.colors.text} size={24} />
                </TouchableOpacity>

                <View style={styles.titleSection}>
                    <BookOpen color={theme.colors.purple} size={28} />
                    <Text style={styles.title}>Veli Bilgilendirme</Text>
                </View>

                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* BİLSEM Nedir */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <GraduationCap color={theme.colors.purple} size={24} />
                        <Text style={styles.sectionTitle}>BİLSEM Nedir?</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>💡 Kısaca BİLSEM</Text>
                        <Text style={styles.cardText}>
                            BİLSEM; örgün eğitim kurumlarına (ilkokul, ortaokul, lise) devam eden ve genel zihinsel, resim veya müzik yetenek alanlarında "özel yetenekli" olarak tanılanan öğrencilere, okul saatleri dışında destek eğitimi veren devlete bağlı bir özel eğitim kurumudur.
                        </Text>
                    </View>
                </View>

                {/* Amaç */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Target color={theme.colors.success} size={24} />
                        <Text style={styles.sectionTitle}>BİLSEM'in Amacı</Text>
                    </View>

                    <View style={[styles.card, { borderLeftColor: theme.colors.success }]}>
                        <Text style={styles.cardTitle}>🎯 Temel Amaç</Text>
                        <Text style={styles.cardText}>
                            Çocuğunuzun sahip olduğu potansiyeli köreltmeden en üst seviyeye çıkarmaktır. BİLSEM, çocuğunuzun normal okulunun alternatifi değil, onu destekleyen bir ek eğitim kurumudur.
                        </Text>
                    </View>
                </View>

                {/* Süreç */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Search color={theme.colors.accent} size={24} />
                        <Text style={styles.sectionTitle}>Süreç Nasıl İşliyor?</Text>
                    </View>

                    <Text style={styles.sectionSubtitle}>🔍 3 Adımda BİLSEM</Text>
                    <Text style={styles.infoText}>
                        BİLSEM'e öğrenci seçimi her yıl Milli Eğitim Bakanlığı tarafından belirlenen takvime göre yapılır:
                    </Text>

                    <View style={[styles.stepCard, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={styles.stepNumber}>1️⃣</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Aday Gösterme (Gözlem)</Text>
                            <Text style={styles.stepText}>
                                Sınıf öğretmenleri, öğrencileri yetenek alanlarına göre (Genel Zihinsel, Resim veya Müzik) aday gösterir. Veliler bu süreçte öğretmene talepte bulunabilir ancak işlemi e-Okul üzerinden öğretmen yapar.
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.stepCard, { backgroundColor: '#E3F2FD' }]}>
                        <Text style={styles.stepNumber}>2️⃣</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Ön Değerlendirme (Tablet Sınavı)</Text>
                            <Text style={styles.stepText}>
                                Aday gösterilen öğrenciler, dijital ortamda bir tarama sınavına girer. Bu sınav bilgi değil; muhakeme, mantık ve görsel hafıza becerilerini ölçer.
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.stepCard, { backgroundColor: '#FFF3E0' }]}>
                        <Text style={styles.stepNumber}>3️⃣</Text>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Bireysel Değerlendirme (Mülakat)</Text>
                            <Text style={styles.stepText}>
                                Tablet sınavında barajı geçen öğrenciler, sertifikalı uzmanlar tarafından bireysel incelemeye alınır. Bu aşamada IQ testi veya yetenek sınavları uygulanır. Başarılı olanlar BİLSEM'e kayıt hakkı kazanır.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Eğitim Sistemi */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Users color={theme.colors.orange} size={24} />
                        <Text style={styles.sectionTitle}>Eğitim Sistemi</Text>
                    </View>

                    <Text style={styles.sectionSubtitle}>🎓 BİLSEM'de Eğitim Nasıldır?</Text>
                    <Text style={styles.infoText}>
                        BİLSEM, klasik okul mantığından çok farklıdır:
                    </Text>

                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📝</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Sınav ve Not Yoktur</Text>
                                <Text style={styles.featureText}>Öğrenciler karne almaz, sınav stresi yaşamaz.</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🔬</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Proje Tabanlı Eğitim</Text>
                                <Text style={styles.featureText}>Öğrenciler yaparak, yaşayarak ve projeler üreterek öğrenirler.</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>👤</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Kişiye Özel Program</Text>
                                <Text style={styles.featureText}>Her öğrencinin hızına ve yeteneğine göre bir program uygulanır.</Text>
                            </View>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📚</Text>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>Devamlılık Esastır</Text>
                                <Text style={styles.featureText}>Eğitim lise bitene kadar aşamalı olarak devam eder.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Sık Sorulan Sorular */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <HelpCircle color={theme.colors.secondary} size={24} />
                        <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
                    </View>

                    <Text style={styles.sectionSubtitle}>❓ Velilerin En Çok Sorduğu Sorular</Text>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>1. BİLSEM ücretli mi?</Text>
                        <Text style={styles.faqAnswer}>
                            Hayır. BİLSEM, devlete (MEB) bağlı resmi bir kurumdur ve eğitim tamamen ücretsizdir.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>2. Okul yerine BİLSEM'e mi gidecek?</Text>
                        <Text style={styles.faqAnswer}>
                            Hayır. Çocuğunuz kendi okuluna devam eder. BİLSEM eğitimi, okul dışı zamanlarda (hafta içi akşam veya hafta sonu) yarım gün olarak planlanır.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>3. Çocuğum BİLSEM'i kazanırsa ne avantajı olur?</Text>
                        <Text style={styles.faqAnswer}>
                            Kendi gibi özel yetenekli akranlarıyla bir arada olur. Robotik, kodlama, uzay bilimleri, yaratıcı yazarlık gibi standart müfredatta olmayan alanlarda kendini geliştirme fırsatı bulur.
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>4. BİLSEM sınavına nasıl hazırlanılır?</Text>
                        <Text style={styles.faqAnswer}>
                            BİLSEM bir bilgi sınavı değildir, bu yüzden konu anlatımlı kitaplarla çalışmak işe yaramaz. Bunun yerine;
                        </Text>
                        <View style={styles.tipsList}>
                            <Text style={styles.tipItem}>✅ Zeka oyunları oynamak</Text>
                            <Text style={styles.tipItem}>✅ Mantık-muhakeme soruları çözmek</Text>
                            <Text style={styles.tipItem}>✅ Bol kitap okumak</Text>
                            <Text style={styles.tipItem}>✅ Dikkat geliştirici egzersizler yapmak</Text>
                        </View>
                        <Text style={styles.faqHighlight}>
                            💡 Bu uygulama tam da bu becerileri geliştirmek için tasarlanmıştır!
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Bu uygulama ile çocuğunuzun BİLSEM hazırlık sürecini destekleyebilirsiniz! 🌟
                    </Text>
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.purple,
    },
    content: {
        paddingBottom: 30,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginBottom: 15,
        lineHeight: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 18,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.purple,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 22,
    },
    stepCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        elevation: 1,
    },
    stepNumber: {
        fontSize: 24,
        marginRight: 12,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 6,
    },
    stepText: {
        fontSize: 13,
        color: theme.colors.text,
        lineHeight: 20,
    },
    featureList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 14,
        padding: 14,
        elevation: 1,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 4,
    },
    featureText: {
        fontSize: 13,
        color: theme.colors.textLight,
    },
    faqItem: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.purple,
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: theme.colors.text,
        lineHeight: 22,
    },
    tipsList: {
        marginTop: 10,
        marginLeft: 10,
    },
    tipItem: {
        fontSize: 13,
        color: theme.colors.text,
        marginBottom: 4,
    },
    faqHighlight: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.success,
        marginTop: 12,
        textAlign: 'center',
    },
    footer: {
        backgroundColor: theme.colors.purple,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 15,
        color: theme.colors.white,
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default ParentInfoScreen;
