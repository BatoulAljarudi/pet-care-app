import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Layout, FileText, Map, Bell, Grid, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header - لوحة التحكم */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.adminAvatar} 
        />
        <Text style={styles.headerTitle}>لوحة التحكم</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>مرحباً بك، مشرف النظام 👋</Text>
          <Text style={styles.subText}>إليك نظرة سريعة على ما يحدث في Little Pet اليوم.</Text>
        </View>

        {/* Urgent Alerts Card - بلاغات تحتاج مراجعة */}
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
             <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>تنبيه هام</Text>
             </View>
             <Text style={styles.alertCount}>08</Text>
          </View>
          
          <Text style={styles.alertTitle}>بلاغات جديدة تحتاج مراجعة</Text>
          <Text style={styles.alertDescription}>
            هناك بلاغات متعلقة بمواقع رعاية الحيوانات تم إرسالها مؤخراً، يرجى التحقق من محتواها واتخاذ الإجراء اللازم.
          </Text>
          
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>مراجعة البلاغات</Text>
          </TouchableOpacity>
        </View>

        {/* Map Locations Card - مواقع الخريطة */}
        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <View style={styles.mapIconCircle}>
               <Map color="#E67E22" size={20} />
            </View>
            <View>
              <Text style={styles.mapTitle}>مواقع الخريطة</Text>
              <Text style={styles.mapSubTitle}>42 موقعاً نشطاً</Text>
            </View>
          </View>
          
          <View style={styles.mapPreviewRow}>
             <View style={styles.mapSideImg} />
             <Image 
               source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/39.20,21.50,12,0/300x200?access_token=YOUR_TOKEN' }} 
               style={styles.mainMapImg} 
             />
             <View style={styles.mapSideImg} />
          </View>

          <TouchableOpacity style={styles.editLocationsBtn}>
            <Text style={styles.editLocationsText}>تعديل المواقع</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row - الإحصائيات */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>مستخدم مسجل</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>850</Text>
            <Text style={styles.statLabel}>حيوان مسجل</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.bottomTab}>
        <TabItem icon={Bell} label="البلاغات" />
        <TabItem icon={Map} label="الخريطة" />
        <TabItem icon={FileText} label="المقالات" />
        <TabItem icon={Grid} label="الرئيسية" active />
      </View>
    </SafeAreaView>
  );
};

const TabItem = ({ icon: Icon, label, active }) => (
  <TouchableOpacity style={styles.tabItem}>
    <View style={[styles.tabIconContainer, active && styles.activeTabBg]}>
      <Icon color={active ? "#FFF" : "#A0A0A0"} size={20} />
    </View>
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  adminAvatar: { width: 35, height: 35, borderRadius: 10, marginLeft: 12 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B4332' },
  
  scrollContent: { paddingHorizontal: 20 },
  
  welcomeSection: { marginTop: 10, marginBottom: 25 },
  welcomeText: { fontSize: 22, fontWeight: '800', color: '#1B4332', textAlign: 'right', marginBottom: 5 },
  subText: { fontSize: 13, color: '#777', textAlign: 'right', lineHeight: 20 },

  // Alert Card
  alertCard: {
    backgroundColor: '#F5F7F6',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  urgentBadge: { backgroundColor: '#FFEDED', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  urgentBadgeText: { color: '#E74C3C', fontSize: 10, fontWeight: 'bold' },
  alertCount: { fontSize: 32, fontWeight: '900', color: '#DDD' },
  alertTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B4332', textAlign: 'right', marginBottom: 10 },
  alertDescription: { fontSize: 13, color: '#666', textAlign: 'right', lineHeight: 20, marginBottom: 20 },
  reviewButton: { backgroundColor: '#2D6A4F', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  reviewButtonText: { color: '#FFF', fontWeight: 'bold' },

  // Map Card
  mapCard: { backgroundColor: '#FDFCFB', borderRadius: 30, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  mapHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 15 },
  mapIconCircle: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#FEF5ED', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  mapTitle: { fontSize: 14, fontWeight: 'bold', color: '#1B4332', textAlign: 'right' },
  mapSubTitle: { fontSize: 11, color: '#AAA', textAlign: 'right' },
  mapPreviewRow: { flexDirection: 'row', justifyContent: 'space-between', height: 100, marginBottom: 15 },
  mainMapImg: { flex: 2, height: '100%', borderRadius: 15, marginHorizontal: 8 },
  mapSideImg: { flex: 0.5, backgroundColor: '#E8F0ED', borderRadius: 12 },
  editLocationsBtn: { backgroundColor: '#E8F0ED', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  editLocationsText: { color: '#2D6A4F', fontWeight: 'bold', fontSize: 13 },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#1B4332' },
  statLabel: { fontSize: 11, color: '#AAA', marginTop: 4 },

  // Bottom Tab
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row-reverse',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    width: '100%',
    justifyContent: 'space-around'
  },
  tabItem: { alignItems: 'center' },
  tabIconContainer: { padding: 8, borderRadius: 12 },
  activeTabBg: { backgroundColor: '#2D6A4F' },
  tabLabel: { fontSize: 10, color: '#A0A0A0', marginTop: 4 },
  activeTabLabel: { color: '#2D6A4F', fontWeight: 'bold' }
});

export default AdminDashboard;

