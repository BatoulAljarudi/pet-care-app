// NotificationsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = '@little_pet_notifications_v2';

const DEFAULT_NOTIFICATIONS = [
  {
    id: '1',
    type: 'adoption',
    title: 'طلب تبني جديد',
    message: 'لديك طلب تواصل جديد بخصوص إعلان التبني',
    time: 'منذ 3 ساعات',
    read: false,
    screen: 'AdoptionBrowse',
  },
  {
    id: '2',
    type: 'hosting',
    title: 'رسالة استضافة',
    message: 'وصلتك رسالة جديدة من صاحب طلب الاستضافة',
    time: 'منذ 5 ساعات',
    read: false,
    screen: 'HostingBrowse',
  },
  {
    id: '3',
    type: 'reminder',
    title: 'تنبيه تذكير',
    message: 'اقترب موعد تطعيم ليو السنوي',
    time: 'اليوم',
    read: true,
    screen: 'Reminders',
  },
  {
    id: '4',
    type: 'article',
    title: 'مقال جديد',
    message: 'تمت إضافة مقال جديد عن تغذية القطط',
    time: 'أمس',
    read: true,
    screen: 'PetCareGuide',
  },
];

function getIcon(type) {
  if (type === 'adoption') return { name: 'heart-outline', lib: 'ion', color: '#E97474' };
  if (type === 'hosting') return { name: 'home-heart', lib: 'mc', color: '#5C8F63' };
  if (type === 'reminder') return { name: 'alarm-outline', lib: 'ion', color: '#4B8FDE' };
  if (type === 'article') return { name: 'newspaper-outline', lib: 'ion', color: '#D99A5B' };
  return { name: 'notifications-outline', lib: 'ion', color: '#5C8F63' };
}

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        setNotifications(JSON.parse(saved));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (list) => {
    setNotifications(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    saveNotifications(updated);
  };

 
const openNotification = (item) => {
  const updated = notifications.map((n) =>
    n.id === item.id
      ? { ...n, read: true }
      : n
  );

  saveNotifications(updated);

  if (item.screen === 'AdoptionBrowse') {
    navigation.navigate('Services', {
      screen: 'AdoptionBrowse',
    });

  } else if (item.screen === 'HostingBrowse') {
    navigation.navigate('Services', {
      screen: 'HostingBrowse',
    });

  } else if (item.screen === 'PetCareGuide') {
    navigation.navigate('Services', {
      screen: 'PetCareGuide',
    });

  } else if (item.screen === 'Reminders') {
    navigation.navigate('Services', {
      screen: 'Reminders',
    });
  }
};

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((item) => item.type === filter);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const renderItem = ({ item }) => {
    const icon = getIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.unreadCard]}
        activeOpacity={0.85}
        onPress={() => openNotification(item)}
      >
        <View style={styles.iconContainer}>
          {icon.lib === 'mc' ? (
            <MaterialCommunityIcons name={icon.name} size={26} color={icon.color} />
          ) : (
            <Ionicons name={icon.name} size={26} color={icon.color} />
          )}

          {!item.read && <View style={styles.smallDot} />}
        </View>

        <View style={styles.textBox}>
          <Text style={[styles.cardTitle, !item.read && styles.boldTitle]}>
            {item.title}
          </Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>

        <View style={styles.timeBox}>
          <Text style={[styles.time, !item.read && styles.activeTime]}>
            {item.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color="#5C8F63" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>الإشعارات</Text>
          <Text style={styles.subtitle}>{unreadCount} إشعارات غير مقروءة</Text>
        </View>

        <TouchableOpacity style={styles.settingsBtn} onPress={markAllAsRead}>
          <Ionicons name="checkmark-done-outline" size={24} color="#5C8F63" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            الكل
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === 'adoption' && styles.activeFilter]}
          onPress={() => setFilter('adoption')}
        >
          <Text style={[styles.filterText, filter === 'adoption' && styles.activeFilterText]}>
            التبني
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === 'hosting' && styles.activeFilter]}
          onPress={() => setFilter('hosting')}
        >
          <Text style={[styles.filterText, filter === 'hosting' && styles.activeFilterText]}>
            الاستضافة
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === 'reminder' && styles.activeFilter]}
          onPress={() => setFilter('reminder')}
        >
          <Text style={[styles.filterText, filter === 'reminder' && styles.activeFilterText]}>
            التذكيرات
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.sectionTitle}>اليوم</Text>

      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-off-outline" size={48} color="#A8B8AA" />
            <Text style={styles.emptyText}>لا توجد إشعارات</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#F7F7F4',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#5C8F63',
    marginTop: 4,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 22,
    paddingVertical: 18,
    gap: 12,
  },
  filterBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE5DD',
  },
  activeFilter: {
    backgroundColor: '#5C8F63',
    borderColor: '#5C8F63',
  },
  filterText: {
    color: '#526173',
    fontSize: 15,
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    textAlign: 'right',
    paddingHorizontal: 26,
    marginBottom: 10,
    fontSize: 17,
    color: '#607086',
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  card: {
    minHeight: 104,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: '#D9E8DA',
  },
  iconContainer: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F0F4F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  smallDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4B8FDE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  textBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 17,
    color: '#1F2937',
    fontWeight: '700',
    textAlign: 'right',
  },
  boldTitle: {
    fontWeight: '900',
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    color: '#718096',
    textAlign: 'right',
    lineHeight: 21,
  },
  timeBox: {
    width: 62,
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
    textAlign: 'left',
  },
  activeTime: {
    color: '#5C8F63',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7B8A7D',
    fontWeight: '700',
  },
});
