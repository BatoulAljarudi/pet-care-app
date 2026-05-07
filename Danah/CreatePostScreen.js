import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const POSTS_KEY = '@little_pet_posts';

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const userName =
    user?.fullName || user?.name || user?.username || 'مستخدم Little Pet';

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('تنبيه', 'يجب السماح بالوصول للصور.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const createPost = async () => {
    if (!content.trim()) {
      Alert.alert('تنبيه', 'اكتبي نص المنشور أولاً.');
      return;
    }

    try {
      const saved = await AsyncStorage.getItem(POSTS_KEY);
      const posts = saved ? JSON.parse(saved) : [];

      const newPost = {
        id: Date.now().toString(),
        userName,
        userAvatar: null,
        content: content.trim(),
        imageUri,
        createdAt: 'الآن',
        likes: 0,
        comments: 0,
        createdAtRaw: new Date().toISOString(),
      };

      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify([newPost, ...posts]));

      setContent('');
      setImageUri(null);

      navigation.goBack();
    } catch (error) {
      console.log('Error creating post:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء نشر المنشور.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-forward" size={24} color="#5C8F63" />
          </TouchableOpacity>

          <Text style={styles.title}>منشور جديد</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.userRow}>
            <View>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.subText}>شاركي مجتمع Little Pet</Text>
            </View>

            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#5C8F63" />
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="اكتبي منشورك هنا..."
            placeholderTextColor="#A0A8B5"
            multiline
            value={content}
            onChangeText={setContent}
            textAlign="right"
          />

          {imageUri ? (
            <View style={styles.previewBox}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />

              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setImageUri(null)}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={22} color="#5C8F63" />
            <Text style={styles.uploadText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.publishBtn} onPress={createPost}>
          <Text style={styles.publishText}>نشر</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#F7F7F4',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF0EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'right',
    marginRight: 14,
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 28,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  userRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF3EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'right',
  },
  subText: {
    fontSize: 12,
    color: '#8A97A8',
    marginTop: 4,
    textAlign: 'right',
  },
  input: {
    minHeight: 150,
    backgroundColor: '#F8FAF8',
    borderRadius: 20,
    padding: 14,
    fontSize: 16,
    color: '#344054',
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  previewBox: {
    marginTop: 14,
  },
  previewImage: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    backgroundColor: '#EEE',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D45B5B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DDE5DD',
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 8,
  },
  uploadText: {
    color: '#5C8F63',
    fontSize: 15,
    fontWeight: '800',
  },
  publishBtn: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: '#5C8F63',
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
