import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Alert, // لإظهار نوافذ التعديل والحذف
} from 'react-native';
import { Search, Trash2, Edit3, Grid, FileText, Map, Bell } from 'lucide-react-native';

const ManageArticles = () => {
  // 1. البيانات مخزنة في State لضمان التحديث التفاعلي
  const [articles, setArticles] = useState([
    {
      id: '1',
      title: 'أفضل 10 أطعمة لنمو صحي للجرو',
      date: 'منذ يومين',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=200',
    },
    {
      id: '2',
      title: 'لماذا تموء القطط؟ لغة التواصل الخفية',
      date: 'منذ 5 أيام',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200',
    },
    {
      id: '3',
      title: 'جدول التطعيمات السنوي الموصى به',
      date: 'منذ أسبوع واحد',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=200',
    },
    {
      id: '4',
      title: 'تجهيز حوض السمك الأول: دليل المبتدئين',
      date: 'منذ أسبوعين',
      image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=200',
    },
  ]);

  // --- وظيفة التعديل التفاعلية ---
  const handleEdit = (id, oldTitle) => {
    Alert.prompt(
      'تعديل المقال',
      'أدخل العنوان الجديد للمقال أدناه:',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حفظ التعديل',
          onPress: (newTitle) => {
            if (newTitle && newTitle.trim() !== "") {
              setArticles(prev => prev.map(item => 
                item.id === id ? { ...item, title: newTitle } : item
              ));
            }
          },
        },
      ],
      'plain-text',
      oldTitle
    );
  };

  // --- وظيفة الحذف التفاعلية ---
  const handleDelete = (id) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا المقال؟', [
      { text: 'إلغاء', style: 'cancel' },
      { 
        text: 'حذف', 
        style: 'destructive', 
        onPress: () => setArticles(prev => prev.filter(item => item.id !== id)) 
      },
    ]);
  };

  // --- وظيفة تحميل المزيد ---
  const loadMore = () => {
    const nextId = (articles.length + 1).toString();
    const newArticle = {
      id: nextId,
      title: `مقال إضافي رقم ${nextId}`,
      date: 'الآن',
      image: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=200',
    };
    setArticles([...articles, newArticle]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
        <Text style={styles.headerTitle}>لوحة التحكم</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search color="#A0A0A0" size={18} />
          <TextInput placeholder="البحث عن المقالات..." style={styles.searchInput} textAlign="right" />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>مكتبة المقالات</Text>
          <Text style={styles.subTitle}>إدارة وتنسيق المحتوى التثقيفي لمجتمع Little Pet.</Text>
        </View>

        {/* Articles List */}
        {articles.map((item) => (
          <View key={item.id} style={styles.articleCard}>
            <Image source={{ uri: item.image }} style={styles.articleImage} />
            <View style={styles.cardInfo}>
              <View style={styles.cardTopRow}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <Text style={styles.articleTitleText}>{item.title}</Text>
              
              {/* أزرار الإدارة */}
              <View style={styles.actionsRow}>
                {/* زر التعديل (أيقونة القلم) */}
                <TouchableOpacity 
                  style={styles.actionIcon} 
                  onPress={() => handleEdit(item.id, item.title)}
                >
                  <Edit3 color="#666" size={16} />
                </TouchableOpacity>

                {/* زر الحذف (سلة المهملات) */}
                <TouchableOpacity 
                  style={[styles.actionIcon, { marginRight: 10 }]} 
                  onPress={() => handleDelete(item.id)}
                >
                  <Trash2 color="#E74C3C" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* زر تحميل المزيد */}
        <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMore}>
          <Text style={styles.loadMoreText}>تحميل المزيد من المقالات</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTab}>
        <TabItem icon={Bell} label="البلاغات" />
        <TabItem icon={Map} label="الخريطة" />
        <TabItem icon={FileText} label="المقالات" active />
        <TabItem icon={Grid} label="الرئيسية" />
      </View>
    </SafeAreaView>
  );
};

const TabItem = ({ icon: Icon, label, active }) => (
  <TouchableOpacity style={styles.tabItem}>
    <Icon color={active ? "#2D6A4F" : "#A0A0A0"} size={22} />
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  header: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  avatar: { width: 32, height: 32, borderRadius: 10, marginLeft: 10 },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: '#1B4332' },
  scrollContent: { paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, height: 45, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 25 },
  searchInput: { flex: 1, fontSize: 13, marginRight: 10 },
  titleSection: { marginBottom: 25 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#1B4332', textAlign: 'right', marginBottom: 5 },
  subTitle: { fontSize: 12, color: '#777', textAlign: 'right', lineHeight: 18 },
  articleCard: { flexDirection: 'row-reverse', backgroundColor: '#FFF', borderRadius: 20, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center' },
  articleImage: { width: 80, height: 80, borderRadius: 15 },
  cardInfo: { flex: 1, marginRight: 15, alignItems: 'flex-start' },
  cardTopRow: { width: '100%', alignItems: 'flex-end', marginBottom: 4 },
  dateText: { fontSize: 10, color: '#AAA' },
  articleTitleText: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'right', marginBottom: 10 },
  actionsRow: { flexDirection: 'row' },
  actionIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  loadMoreBtn: { paddingVertical: 15, alignItems: 'center', backgroundColor: '#F5F7F6', borderRadius: 12, marginTop: 10 },
  loadMoreText: { color: '#2D6A4F', fontSize: 12, fontWeight: 'bold' },
  bottomTab: { position: 'absolute', bottom: 0, flexDirection: 'row-reverse', backgroundColor: '#FFF', paddingVertical: 12, paddingBottom: 25, borderTopWidth: 1, borderTopColor: '#EEE', width: '100%', justifyContent: 'space-around' },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 10, color: '#A0A0A0', marginTop: 4 },
  activeTabLabel: { color: '#2D6A4F', fontWeight: 'bold' }
});

export default ManageArticles;
