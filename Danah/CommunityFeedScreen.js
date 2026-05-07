import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const POSTS_KEY = '@little_pet_posts';
const REPORTS_KEY = '@little_pet_reports';

const DEFAULT_POSTS = [
  {
    id: '1',
    userName: 'سارة',
    userAvatar: null,
    content: 'قطتي ليو اليوم أخذت تطعيمها السنوي 🐱💚',
    imageUri: null,
    createdAt: 'منذ 3 ساعات',
    likes: 12,
    comments: 4,
  },
  {
    id: '2',
    userName: 'نورة',
    userAvatar: null,
    content: 'هل تنصحوني بأفضل أكل للقطط الصغيرة؟',
    imageUri: null,
    createdAt: 'أمس',
    likes: 8,
    comments: 6,
  },
];

export default function CommunityFeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const loadPosts = async () => {
    try {
      const saved = await AsyncStorage.getItem(POSTS_KEY);

      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        setPosts(DEFAULT_POSTS);
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
      }
    } catch (error) {
      console.log('Error loading posts:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const reportPost = async (post) => {
    try {
      const savedReports = await AsyncStorage.getItem(REPORTS_KEY);
      const reports = savedReports ? JSON.parse(savedReports) : [];

      const newReport = {
        id: Date.now().toString(),
        postId: post.id,
        postContent: post.content,
        reportedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify([newReport, ...reports]));

      Alert.alert('تم الإبلاغ', 'تم إرسال البلاغ بنجاح.');
    } catch (error) {
      console.log('Error reporting post:', error);
    }
  };

  const likePost = async (postId) => {
    const updated = posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );

    setPosts(updated);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.reportBtn} onPress={() => reportPost(item)}>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.time}>{item.createdAt}</Text>
          </View>

          <View style={styles.avatar}>
            {item.userAvatar ? (
              <Image source={{ uri: item.userAvatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={24} color="#5C8F63" />
            )}
          </View>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.postImage} />
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => likePost(item.id)}>
          <Ionicons name="heart-outline" size={20} color="#5C8F63" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <View style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={19} color="#7B8798" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.newPostBtn}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.newPostText}>New Post</Text>
        </TouchableOpacity>

        <Text style={styles.title}>المجتمع</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={54} color="#A8B8AA" />
            <Text style={styles.emptyText}>لا توجد منشورات بعد</Text>
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
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#F7F7F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  newPostBtn: {
    backgroundColor: '#5C8F63',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newPostText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  list: {
    padding: 20,
    paddingBottom: 90,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'right',
  },
  time: {
    fontSize: 12,
    color: '#8A97A8',
    marginTop: 3,
    textAlign: 'right',
  },
  reportBtn: {
    backgroundColor: '#FFF1F1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  reportText: {
    color: '#D45B5B',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 24,
    color: '#344054',
    textAlign: 'right',
  },
  postImage: {
    width: '100%',
    height: 190,
    borderRadius: 20,
    marginTop: 14,
    backgroundColor: '#EEE',
  },
  actionsRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
    flexDirection: 'row-reverse',
    gap: 18,
  },
  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#7B8798',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 90,
  },
  emptyText: {
    marginTop: 12,
    color: '#7B8A7D',
    fontSize: 16,
    fontWeight: '800',
  },
});
