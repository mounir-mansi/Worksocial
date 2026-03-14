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

const CalendrierScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${hostname}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        const sorted = [...data].sort(
          (a, b) => new Date(a.StartDate) - new Date(b.StartDate)
        );
        setEvents(sorted);
      } catch (err) {
        console.error('Erreur chargement calendrier:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.StartDate) >= today);
  const past = events.filter((e) => new Date(e.StartDate) < today);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  const renderEvent = (event) => (
    <View key={event.Event_ID} style={styles.card}>
      <View style={styles.dateColumn}>
        <Text style={styles.dateDay}>
          {new Date(event.StartDate).getDate()}
        </Text>
        <Text style={styles.dateMonth}>
          {new Date(event.StartDate).toLocaleDateString('fr-FR', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.infoColumn}>
        <Text style={styles.cardTitle}>{event.EventName}</Text>
        {event.StartTime ? (
          <Text style={styles.cardTime}>{event.StartTime} — {event.EndTime}</Text>
        ) : null}
        {event.Description ? (
          <Text style={styles.cardDesc} numberOfLines={2}>{event.Description}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Calendrier</Text>

      <Text style={styles.sectionTitle}>À venir</Text>
      {upcoming.length === 0 ? (
        <Text style={styles.empty}>Aucun événement à venir.</Text>
      ) : (
        upcoming.map(renderEvent)
      )}

      {past.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Passés</Text>
          {past.map(renderEvent)}
        </>
      )}
    </ScrollView>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginHorizontal: 14,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: { textAlign: 'center', marginTop: 20, color: '#94A3B8', marginBottom: 12, fontSize: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  dateColumn: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 6,
  },
  dateDay: { fontSize: 22, fontWeight: '800', color: '#2563EB' },
  dateMonth: { fontSize: 11, color: '#2563EB', textTransform: 'uppercase', fontWeight: '600' },
  infoColumn: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  cardTime: { fontSize: 13, color: '#2563EB', fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },
});

export default CalendrierScreen;
