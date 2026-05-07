import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { 
  Bell, Search, Filter, Home, Layout, 
  Calendar, User, Users, Bookmark, Share2, 
  ChevronRight, Info, ShieldCheck, Zap 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// تفعيل اتجاه الكتابة من اليمين لليسان (RTL)
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

/**
 * مكون شاشة تفاصيل المقال (يظهر عند الضغط على مقال)
 */
const ArticleDetail = ({ article, onBack }) => {
  return (
    <SafeAreaView style={styles.detailContainer}>
      {/* Header الترويسة */}
      <View style={styles.detailHeader}>
        <View style={styles.headerRightIcons}>
           <TouchableOpacity style={styles.headerIconCircle}><Bookmark color="#1B4332" size={20} /></TouchableOpacity>
           <TouchableOpacity style={styles.headerIconCircle}><Share2 color="#1B4332" size={20} /></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.headerIconCircle}>
          <ChevronRight color="#1B4332" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* الصورة الرئيسية مع العنوان */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: article.image }} style={styles.detailImage} />
          <View style={styles.imageOverlay}>
             <View style={styles.detailBadge}>
               <Text style={styles.detailBadgeText}>{article.category}</Text>
             </View>
             <Text style={styles.detailTitleMain}>{article.title}</Text>
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* قسم نظرة عامة */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitleDetail}>نظرة عامة</Text>
            <Info color="#2D6A4F" size={20} />
          </View>
          <Text style={styles.detailText}>
            تعتبر التغذية السليمة حجر الزاوية لصحة أليفك. {article.description} 
            هذا المقال يستعرض أهم النقاط التي يجب مراعاتها لضمان نمو صحي وجهاز مناعي قوي.
          </Text>

          {/* قسم العناصر الغذائية */}
          <View style={[styles.sectionRow, {marginTop: 25}]}>
            <Text style={styles.sectionTitleDetail}>العناصر الغذائية الضرورية</Text>
            <Zap color="#2D6A4F" size={20} />
          </View>
          
          <View style={styles.infoCard}>
             <Text style={styles.infoCardTitle}>البروتينات</Text>
             <Text style={styles.infoCardText}>يحتاج أليفك إلى البروتين الحيواني لبناء العضلات وتجديد الأنسجة بشكل يومي.</Text>
          </View>

          <View style={styles.infoCard}>
             <Text style={styles.infoCardTitle}>الدهون الصحية</Text>
             <Text style={styles.infoCardText}>مصدر أساسي للطاقة وتساعد في الحفاظ على جلد صحي وفراء لامع وجذاب.</Text>
          </View>

          {/* نصائح صحية */}
          <View style={[styles.sectionRow, {marginTop: 25}]}>
            <Text style={styles.sectionTitleDetail}>نصائح صحية</Text>
            <ShieldCheck color="#2D6A4F" size={20} />
          </View>
          <View style={styles.tipRow}>
             <Text style={styles.tipText}>توفير مياه عذبة ونظيفة على مدار الساعة.</Text>
             <View style={styles.dotIndicator} />
          </View>

          {/* زر حفظ المقال */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>حفظ المقال</Text>
            <Bookmark color="#FFF" size={18} style={{marginLeft: 10}} />
          </TouchableOpacity>
        </View>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * المكون الرئيسي للتطبيق
 */
const PetCareApp = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null); // الحالة المسؤولة عن فتح التفاصيل

  const categories = ['الكل', 'قطط', 'كلاب'];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const [catImgRes, dogImgRes, catFactRes, dogFactRes] = await Promise.all([
        fetch('https://api.thecatapi.com/v1/images/search?limit=5'),
        fetch('https://api.thedogapi.com/v1/images/search?limit=5'),
        fetch('https://catfact.ninja/facts?limit=5'),
        fetch('https://dog-api.kinduff.com/api/facts?number=5')
      ]);

      const catImages = await catImgRes.json();
      const dogImages = await dogImgRes.json();
      const catFactsData = await catFactRes.json();
      const dogFactsData = await dogFactRes.json();

      const catArticles = catImages.map((item, index) => ({
        id: `cat-${item.id}-${index}`,
        category: 'قطط',
        tag: 'تغذية',
        title: 'أساسيات التغذية السليمة لقطتك',
        description: catFactsData.data[index]?.fact || "القطط كائنات مذهلة تحتاج لرعاية خاصة.",
        time: `5 دقائق قراءة`,
        source: 'دليل الأليف',
        image: item.url,
      }));

      const dogArticles = dogImages.map((item, index) => ({
        id: `dog-${item.id}-${index}`,
        category: 'كلاب',
        tag: 'صحة',
        title: 'كيف تحافظ على نشاط كلبك',
        description: dogFactsData.facts[index] || "الكلاب تحتاج لممارسة الرياضة يومياً.",
        time: `7 دقائق قراءة`,
        source: 'عالم الكلاب',
        image: item.url,
      }));

      setArticles([...catArticles, ...dogArticles].sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === 'الكل'
    ? articles
    : articles.filter((art) => art.category === selectedCategory);

  // إذا تم اختيار مقال، اعرض شاشة التفاصيل
  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text style={{ marginTop: 10, color: '#2D6A4F' }}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle}>
          <Bell color="#1B4332" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>دليل العناية</Text>
        <TouchableOpacity>
           <ChevronRight color="#1B4332" size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search color="#A0A0A0" size={18} />
            <TextInput placeholder="ابحث عن مقالات..." style={styles.searchInput} textAlign="right" />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#FFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryChip, selectedCategory === cat && styles.activeChip]}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.activeChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => setSelectedCategory('الكل')}>
            <Text style={styles.viewAll}>عرض الكل</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>أحدث المقالات</Text>
        </View>

        {/* Articles List */}
        {filteredArticles.map((article) => (
          <TouchableOpacity 
            key={article.id} 
            style={styles.card}
            onPress={() => setSelectedArticle(article)} // فتح التفاصيل عند الضغط
          >
            <Image source={{ uri: article.image }} style={styles.cardImage} />
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{article.tag}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text numberOfLines={2} style={styles.cardDescription}>{article.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardSource}>{article.source}</Text>
                <Text style={styles.dot}> • </Text>
                <Text style={styles.cardTime}>{article.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        <TabItem icon={<User color="#A0A0A0" size={22} />} label="حسابي" />
        <TabItem icon={<Calendar color="#A0A0A0" size={22} />} label="المواعيد" />
        <TabItem icon={<Layout color="#2D6A4F" size={22} />} label="المقالات" active />
        <TabItem icon={<Home color="#A0A0A0" size={22} />} label="الرئيسية" />
      </View>
    </SafeAreaView>
  );
};

const TabItem = ({ icon, label, active }) => (
  <TouchableOpacity style={styles.tabItem}>
    {icon}
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // تنسيقات الشاشة الرئيسية
  container: { flex: 1, backgroundColor: '#FBFBFB' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B4332' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4F2', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchInputWrapper: { flex: 1, flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: 10, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', height: 50 },
  searchInput: { flex: 1, marginRight: 10 },
  filterButton: { marginLeft: 10, backgroundColor: '#2D6A4F', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  categoryList: { marginBottom: 20 },
  categoryChip: { paddingHorizontal: 25, paddingVertical: 10, backgroundColor: '#FFF', marginRight: 10, borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  activeChip: { backgroundColor: '#2D6A4F', borderColor: '#2D6A4F' },
  categoryText: { color: '#777', fontWeight: '600' },
  activeChipText: { color: '#FFF' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1B4332' },
  viewAll: { color: '#2D6A4F', fontWeight: '600' },
  card: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0', elevation: 3 },
  cardImage: { width: '100%', height: 180 },
  tagBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(45,106,79,0.9)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', textAlign: 'right', color: '#1B4332' },
  cardDescription: { fontSize: 14, color: '#555', textAlign: 'right', marginTop: 8, lineHeight: 20 },
  cardFooter: { flexDirection: 'row-reverse', marginTop: 12, alignItems: 'center' },
  cardSource: { color: '#E67E22', fontSize: 12, fontWeight: '600' },
  cardTime: { fontSize: 12, color: '#AAA' },
  dot: { marginHorizontal: 5, color: '#DDD' },
  tabBar: { position: 'absolute', bottom: 0, flexDirection: 'row', backgroundColor: '#FFF', width: '100%', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 11, color: '#A0A0A0', marginTop: 4 },
  activeTabLabel: { color: '#2D6A4F', fontWeight: 'bold' },

  
  detailContainer: { flex: 1, backgroundColor: '#FFF' },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  headerRightIcons: { flexDirection: 'row' },
  headerIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F7F6', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  imageWrapper: { width: '100%', height: 350, position: 'relative' },
  detailImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, backgroundColor: 'rgba(0,0,0,0.3)' },
  detailBadge: { backgroundColor: '#4CAF50', alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  detailBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  detailTitleMain: { color: '#FFF', fontSize: 24, fontWeight: 'bold', textAlign: 'right' },
  contentPadding: { padding: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12 },
  sectionTitleDetail: { fontSize: 19, fontWeight: 'bold', color: '#1B4332', marginRight: 10 },
  detailText: { textAlign: 'right', color: '#555', lineHeight: 24, fontSize: 15 },
  infoCard: { backgroundColor: '#F9F9F9', padding: 16, borderRadius: 15, marginBottom: 12, borderRightWidth: 5, borderRightColor: '#2D6A4F' },
  infoCardTitle: { fontWeight: 'bold', textAlign: 'right', color: '#1B4332', marginBottom: 4 },
  infoCardText: { textAlign: 'right', fontSize: 14, color: '#666' },
  tipRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 },
  tipText: { textAlign: 'right', color: '#555', marginRight: 10 },
  dotIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2D6A4F' },
  saveButton: { backgroundColor: '#2D6A4F', flexDirection: 'row', padding: 16, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 30 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default PetCareApp;
