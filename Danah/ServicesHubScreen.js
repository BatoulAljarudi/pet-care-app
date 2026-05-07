import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SERVICES = [
  {
    id: '1',
    title: 'العيادات البيطرية',
    description: 'رعاية طبية احترافية وفحوصات دورية لحيواناتك الأليفة',
    icon: 'medkit-outline',
    screen: 'Map',
  },
  {
    id: '2',
    title: 'دليل الرعاية',
    description: 'دليلك الأول والشامل لتتعرف على حيوانك الأليف والعناية به وتدريبه',
    icon: 'paw-outline',
    screen: 'PetCareGuide',
  },
  {
    id: '3',
    title: 'استضافة',
    description: 'مكان آمن ومريح لحيوانك الأليف أثناء غيابك',
    icon: 'home-outline',
    screen: 'HostingBrowse',
  },
  {
    id: '4',
    title: 'تبني',
    description: 'تبن الآن وأنقذ حياة',
    icon: 'heart-outline',
    screen: 'AdoptionBrowse',
  },
];

const ServiceCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Ionicons name={item.icon} size={28} color="#5C8D6E" />
    </View>
    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </View>
    <Ionicons name="chevron-back-outline" size={20} color="#C0C0C0" />
  </TouchableOpacity>
);

export default function ServicesHubScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>الخدمات</Text>
        {SERVICES.map((item) => (
          <ServiceCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: '#F5F0E8' },
  container: { flex: 1, backgroundColor: '#F5F0E8', padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2933',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EAF3E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { flex: 1, alignItems: 'flex-end' },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2933',
    textAlign: 'right',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
    lineHeight: 20,
  },
});
