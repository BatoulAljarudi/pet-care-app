import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const TIPS = [
  {
    id: '1',
    title: 'حافظ على ترطيب أليفك',
    body: 'تأكد من توفير مياه باردة ونظيفة لأليفك خلال ساعات الظهيرة لتجنب ضربات الشمس والجفاف.',
  },
  {
    id: '2',
    title: 'العناية بفراء القطط',
    body: 'قم بتمشيط فراء قطتك يومياً لتجنب تكتل الشعر وتقليل كرات الشعر في معدتها.',
  },
  {
    id: '3',
    title: 'التطعيمات الدورية',
    body: 'احرص على تطعيم حيوانك الأليف بانتظام للحفاظ على صحته وحمايته من الأمراض.',
  },
];

const QUICK_ACCESS = [
  {
    id: '1',
    label: 'دليل الرعاية',
    icon: 'book-outline',
    screen: 'PetCareGuide',
  },
  {
    id: '2',
    label: 'البحث عن عيادة',
    icon: 'medkit-outline',
    screen: 'Map',
  },
  {
    id: '3',
    label: 'التذكيرات',
    icon: 'calendar-outline',
    screen: 'Reminders',
  },
  {
    id: '4',
    label: 'التبني',
    icon: 'heart-outline',
    screen: 'AdoptionBrowse',
  },
  {
    id: '5',
    label: 'الاستضافة',
    icon: 'home-outline',
    screen: 'HostingBrowse',
  },
  {
    id: '6',
    label: 'المجتمع',
    icon: 'people-outline',
    screen: 'Community',
  },
];

const ARTICLES = [
  {
    id: '1',
    title: 'كيف تجهز منزلك لاستقبال قطة جديدة؟',
    readTime: '5 دقائق قراءة',
    views: '٢٤٠ مشاهدة',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
    isNew: true,
  },
  {
    id: '2',
    title: 'أفضل 5 تمارين لكلبك في الصيف',
    readTime: '8 دقائق قراءة',
    views: '١٨٠ مشاهدة',
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
    isNew: false,
  },
];

const ArticleCard = ({ item }) => (
  <TouchableOpacity
    style={styles.articleCard}
    activeOpacity={0.85}
    onPress={() => Alert.alert(item.title)}
  >
    <View style={styles.articleImageContainer}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      {item.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>جديد</Text>
        </View>
      )}
    </View>

    <View style={styles.articleInfo}>
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.articleMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="eye-outline" size={12} color="#999" />
          <Text style={styles.metaText}>{item.views}</Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color="#999" />
          <Text style={styles.metaText}>{item.readTime}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const QuickAccessItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.gridItem} activeOpacity={0.8} onPress={onPress}>
    <View style={styles.gridIconBox}>
      <Ionicons name={item.icon} size={28} color="#5C8D6E" />
    </View>
    <Text style={styles.gridLabel}>{item.label}</Text>
  </TouchableOpacity>
);

export default function HomeDashboardScreen({ navigation }) {
  const { user } = useAuth();

  const [currentTip] = useState(
    () => TIPS[Math.floor(Math.random() * TIPS.length)]
  );

  const handleReadMore = () => {
    Alert.alert(currentTip.title, currentTip.body, [
      { text: 'إغلاق', style: 'cancel' },
    ]);
  };

  const goToScreen = (screenName) => {
    if (screenName === 'Community') {
      navigation.navigate('Community');
    } else if (
      screenName === 'PetCareGuide' ||
      screenName === 'Map' ||
      screenName === 'AdoptionBrowse' ||
      screenName === 'HostingBrowse' ||
      screenName === 'Reminders'
    ) {
      navigation.navigate('Services', {
        screen: screenName,
      });
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color="#333" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.welcomeSmall}>أهلاً بك مجدداً</Text>
            <Text style={styles.welcomeName}>
              مرحباً، {user?.name || 'مستخدم'}
            </Text>
          </View>

          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>نصيحة اليوم 💡</Text>
          <Text style={styles.tipTitle}>{currentTip.title}</Text>
          <Text style={styles.tipBody}>{currentTip.body}</Text>

          <TouchableOpacity
            style={styles.tipBtn}
            onPress={handleReadMore}
            activeOpacity={0.8}
          >
            <Text style={styles.tipBtnText}>قراءة المزيد</Text>
          </TouchableOpacity>

          <Text style={styles.pawDecor}>🐾</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.seeAll}>عرض الكل</Text>
          <Text style={styles.sectionTitle}>الوصول السريع</Text>
        </View>

        <View style={styles.gridContainer}>
          {QUICK_ACCESS.map((item) => (
            <QuickAccessItem
              key={item.id}
              item={item}
              onPress={() => goToScreen(item.screen)}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.seeAll}>المزيد</Text>
          <Text style={styles.sectionTitle}>مقالات مختارة</Text>
        </View>

        <FlatList
          horizontal
          inverted
          data={ARTICLES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.articlesList}
          renderItem={({ item }) => <ArticleCard item={item} />}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#F2AE7E',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 10,
  },
  welcomeSmall: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  welcomeName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1F2933',
    textAlign: 'right',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D8E2D3',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5C8D6E',
    borderWidth: 1.5,
    borderColor: '#F5F0E8',
  },
  tipCard: {
    backgroundColor: '#5C8D6E',
    marginHorizontal: 18,
    marginTop: 8,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    minHeight: 210,
  },
  tipLabel: {
    color: '#DDEBDD',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 10,
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
    lineHeight: 34,
  },
  tipBody: {
    color: '#F2F6F0',
    fontSize: 15,
    textAlign: 'right',
    lineHeight: 27,
    marginBottom: 20,
  },
  tipBtn: {
    backgroundColor: '#F2AE7E',
    alignSelf: 'flex-start',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  tipBtnText: {
    color: '#2D2D2D',
    fontWeight: '700',
    fontSize: 14,
  },
  pawDecor: {
    position: 'absolute',
    bottom: -12,
    left: -8,
    fontSize: 90,
    opacity: 0.15,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2933',
  },
  seeAll: {
    fontSize: 14,
    color: '#5C8D6E',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 18,
  },
  gridIconBox: {
    width: '100%',
    height: 108,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  gridLabel: {
    fontSize: 13,
    color: '#1F2933',
    fontWeight: '600',
    textAlign: 'center',
  },
  articlesList: {
    paddingHorizontal: 18,
    gap: 14,
  },
  articleCard: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 2,
  },
  articleImageContainer: {
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: 145,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 13,
  },
  newBadgeText: {
    fontSize: 11,
    color: '#5C8D6E',
    fontWeight: 'bold',
  },
  articleInfo: {
    padding: 13,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2933',
    textAlign: 'right',
    lineHeight: 23,
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: '#8A94A6',
  },
});
