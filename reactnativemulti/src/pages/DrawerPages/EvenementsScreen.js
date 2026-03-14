import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { hostname } from '../../components/HostnameConnect/Hostname';

const EvenementsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${hostname}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Erreur chargement événements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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
      <View style={styles.header}>
        <Text style={styles.title}>Événements</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreerEvenement')}
        >
          <Text style={styles.createButtonText}>+ Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {events.length === 0 ? (
          <Text style={styles.empty}>Aucun événement pour le moment.</Text>
        ) : (
          events.map((event) => (
            <View key={event.Event_ID} style={styles.card}>
              <Text style={styles.cardTitle}>{event.EventName}</Text>
              <Text style={styles.cardDates}>
                Du {new Date(event.StartDate).toLocaleDateString('fr-FR')} au{' '}
                {new Date(event.EndDate).toLocaleDateString('fr-FR')}
              </Text>
              {event.Description ? (
                <Text style={styles.cardContent}>{event.Description}</Text>
              ) : null}
              <Text style={styles.cardVisibility}>
                {event.Visibility === 'public' ? 'Public' : 'Privé'}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  createButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  createButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
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
  cardDates: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginBottom: 6 },
  cardContent: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 8 },
  cardVisibility: {
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
});

export default EvenementsScreen;
