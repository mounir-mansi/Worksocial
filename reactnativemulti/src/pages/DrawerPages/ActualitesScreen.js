import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostname } from '../../components/HostnameConnect/Hostname';

const ActualitesScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${hostname}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Erreur chargement actualités:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualités</Text>
      <ScrollView>
        {posts.length === 0 ? (
          <Text style={styles.empty}>Aucune actualité pour le moment.</Text>
        ) : (
          posts.map((post) => (
            <View key={post.Post_ID} style={styles.card}>
              <Text style={styles.cardTitle}>{post.Title}</Text>
              <Text style={styles.cardContent}>{post.Content}</Text>
              <Text style={styles.cardDate}>
                {new Date(post.Created_At).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  empty: { textAlign: 'center', marginTop: 60, color: '#94A3B8', fontSize: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  cardContent: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 10 },
  cardDate: { fontSize: 12, color: '#94A3B8' },
});

export default ActualitesScreen;
