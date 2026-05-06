import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity,
  SafeAreaView, I18nManager, ActivityIndicator, Linking, Alert, ImageBackground, Dimensions, StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  Bell, Search, Filter, Home, Layout, Calendar, User, 
  ArrowLeft, Bookmark, Share2, Info, Salad, CheckCircle2, BookOpenText 
} from 'lucide-react-native';

// إعدادات اللغة والابعاد
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);
const { width } = Dimensions.get('window');
const Stack = createStackNavigator();

// --- شاشة القائمة الرئيسية (HomeScreen) ---
const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPetCareContent(); }, []);

  const fetchPetCareContent = async () => {
    setLoading(true);
    try {
      const apiKey = 'b34c925e223d4cb7b3d12764dc930823';
      const query = '(pets OR cats OR dogs) AND (grooming OR nutrition OR "pet health")';
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=10&apiKey=${apiKey}`);
      const data = await response.json();

      if (data.articles) {
        const formatted = data.articles.map((item, index) => {
          let category = item.title.toLowerCase().includes('cat') ? 'قطط' : 'كلاب';
          return {
            id: `care-${index}`,
            category: category,
            tag: 'دليل الخبراء',
            title: item.title,
            // بيانات إضافية لصفحة التفاصيل
            overview: item.description || "لا يوجد وصف متاح لهذا المقال حالياً.",
            image: `https://loremflickr.com/800/500/${category === 'قطط' ? 'cat' : 'dog'},pets/all?lock=${index}`,
            url: item.url,
            essentials: [
              { name: 'نصيحة هامة', description: 'تأكد دائماً من مراجعة الطبيب البيطري قبل تغيير النظام الغذائي.' },
              { name: 'بيئة أليفك', description: 'النظافة والبيئة المحيطة تلعب دوراً كبيراً في صحة الحيوان.' }
            ],
            tips: ['توفير مياه نظيفة دائماً', 'الفحص الدوري عند الطبيب', 'الاهتمام بالنظافة اليومية']
          };
        });
        setArticles(formatted);
      }
    } catch (error) { Alert.alert('خطأ', 'فشل الاتصال بالخادم'); }
    finally { setLoading(false); }
  };

  const filteredArticles = selectedCategory === 'الكل' ? articles : articles.filter(a => a.category === selectedCategory);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2D6A4F" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle}><Bell color="#1B4332" size={22} /></TouchableOpacity>
        <Text style={styles.headerTitle}>دليل رعاية أليفك</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {/* البحث والتصنيفات (اختصاراً) */}
        <View style={styles.categoryList}>
          {['الكل', 'قطط', 'كلاب'].map((cat) => (
            <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryChip, selectedCategory === cat && styles.activeChip]}>
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredArticles.map((article) => (
          <TouchableOpacity 
            key={article.id} 
            style={styles.card} 
            onPress={() => navigation.navigate('Details', { article })}
          >
            <Image source={{ uri: article.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text numberOfLines={2} style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardSource}>{article.category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- شاشة تفاصيل المقال (ArticleDetailScreen) ---
const ArticleDetailScreen = ({ route, navigation }) => {
  const { article } = route.params; // استقبال بيانات المقال

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: article.image }} style={styles.headerImage}>
          <View style={styles.overlay} />
          <SafeAreaView style={styles.safeHeader}>
            <View style={styles.topActions}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circularButton}>
                <ArrowLeft color="#1B4332" size={22} />
              </TouchableOpacity>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.circularButton}><Share2 color="#1B4332" size={20} /></TouchableOpacity>
                <TouchableOpacity style={[styles.circularButton, { marginRight: 10 }]}><Bookmark color="#1B4332" size={20} /></TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
          <View style={styles.titleContainer}>
            <View style={styles.tagBadge}><Text style={styles.tagText}>{article.tag}</Text></View>
            <Text style={styles.articleTitle}>{article.title}</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentBody}>
          <SectionHeader icon={Info} title="نظرة عامة" />
          <Text style={styles.paragraphText}>{article.overview}</Text>

          <SectionHeader icon={Salad} title="العناصر الضرورية" />
          {article.essentials.map((item, i) => (
            <View key={i} style={styles.essentialCard}>
              <Text style={styles.essentialName}>{item.name}</Text>
              <Text style={styles.essentialDesc}>{item.description}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.saveArticleButton} onPress={() => Linking.openURL(article.url)}>
            <Text style={styles.saveArticleText}>قراءة المقال بالكامل</Text>
            <BookOpenText color="#FFF" size={20} style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const SectionHeader = ({ icon: Icon, title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Icon color="#2D6A4F" size={20} style={{ marginLeft: 10 }} />
  </View>
);

// --- إعداد التنقل (Navigation Setup) ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={ArticleDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F2', justifyContent: 'center', alignItems: 'center' },
  categoryList: { flexDirection: 'row', marginVertical: 15 },
  categoryChip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#FFF', borderRadius: 20, marginLeft: 10, borderWidth: 1, borderColor: '#EEE' },
  activeChip: { backgroundColor: '#2D6A4F' },
  activeChipText: { color: '#FFF' },
  card: { backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, overflow: 'hidden', elevation: 3 },
  cardImage: { width: '100%', height: 150 },
  cardContent: { padding: 12 },
  cardTitle: { fontWeight: 'bold', textAlign: 'right' },
  cardSource: { color: '#E67E22', fontSize: 12, textAlign: 'right', marginTop: 5 },
  // تفاصيل المقال
  headerImage: { width: width, height: 340, justifyContent: 'space-between' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  circularButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  titleContainer: { padding: 20, marginBottom: 20 },
  tagBadge: { backgroundColor: '#2D6A4F', alignSelf: 'flex-start', padding: 5, borderRadius: 5 },
  tagText: { color: '#FFF', fontSize: 12 },
  articleTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', textAlign: 'left' },
  contentBody: { paddingHorizontal: 20, paddingTop: 30, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'right' },
  paragraphText: { textAlign: 'right', color: '#555', lineHeight: 22 },
  essentialCard: { backgroundColor: '#F9FBF9', padding: 15, borderRadius: 12, marginBottom: 10 },
  essentialName: { fontWeight: 'bold', color: '#2D6A4F', textAlign: 'right' },
  essentialDesc: { textAlign: 'right', fontSize: 13 },
  saveArticleButton: { backgroundColor: '#527C62', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  saveArticleText: { color: '#FFF', fontWeight: 'bold' }
});