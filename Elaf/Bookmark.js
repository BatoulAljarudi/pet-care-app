import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2, BookmarkX, ChevronRight, Inbox } from 'lucide-react-native';

const BookmarkScreen = ({ onBack }) => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);

  const categories = ['الكل', 'القطط', 'الكلاب', 'الطيور', 'الصقور', 'أخرى'];

  useEffect(() => {
    loadBookmarks();
  }, []);

  // فلترة المقالات عند تغيير الفئة أو القائمة
  useEffect(() => {
    if (selectedCategory === 'الكل') {
      setFilteredArticles(savedArticles);
    } else {
      setFilteredArticles(savedArticles.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, savedArticles]);

  // جلب البيانات من التخزين المحلي
  const loadBookmarks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@bookmarks');
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      setSavedArticles(data);
    } catch (e) {
      console.error("Error loading bookmarks", e);
    } finally {
      setLoading(false);
    }
  };

  // إزالة مقال واحد
  const removeBookmark = async (id) => {
    const newList = savedArticles.filter(item => item.id !== id);
    setSavedArticles(newList);
    await AsyncStorage.setItem('@bookmarks', JSON.stringify(newList));
  };

  // حذف جميع المحفوظات
  const clearAllBookmarks = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من رغبتك في مسح جميع المقالات المحفوظة؟",
      [
        { text: "إلغاء", style: "cancel" },
        { 
          text: "حذف الكل", 
          style: "destructive", 
          onPress: async () => {
            setSavedArticles([]);
            await AsyncStorage.removeItem('@bookmarks');
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.articleCard}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <View style={styles.articleInfo}>
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => removeBookmark(item.id)}>
            <BookmarkX color="#E74C3C" size={22} />
          </TouchableOpacity>
          <Text style={styles.categoryTag}>{item.category}</Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} /> 
        <Text style={styles.headerTitle}>المقالات المحفوظة</Text>
        <TouchableOpacity onPress={onBack}>
          <ChevronRight color="#1B4332" size={28} />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View>
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.filterChip,
                selectedCategory === item && styles.activeFilterChip
              ]}
            >
              <Text style={[
                styles.filterText,
                selectedCategory === item && styles.activeFilterText
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#2D6A4F" style={{ flex: 1 }} />
      ) : filteredArticles.length > 0 ? (
        <>
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          
          {/* Delete All Button */}
          <TouchableOpacity style={styles.clearButton} onPress={clearAllBookmarks}>
            <Text style={styles.clearButtonText}>حذف جميع المحفوظات</Text>
            <Trash2 color="#FFF" size={20} />
          </TouchableOpacity>
        </>
      ) : (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Inbox color="#CCC" size={80} />
          <Text style={styles.emptyText}>لا توجد مقالات محفوظة في هذه الفئة</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B4332' },
  filterList: { paddingHorizontal: 15, paddingVertical: 15 },
  filterChip: { 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  activeFilterChip: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  filterText: { color: '#777', fontWeight: '600' },
  activeFilterText: { color: '#FFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  articleCard: { 
    flexDirection: 'row-reverse', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    marginBottom: 15, 
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  articleImage: { width: 100, height: 100 },
  articleInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryTag: { color: '#2D6A4F', fontSize: 12, fontWeight: 'bold', backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  articleTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  clearButton: { 
    flexDirection: 'row', 
    backgroundColor: '#E74C3C', 
    margin: 20, 
    padding: 15, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  clearButtonText: { color: '#FFF', fontWeight: 'bold', marginRight: 10, fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyText: { marginTop: 15, color: '#999', fontSize: 16 },
});

export default BookmarkScreen;