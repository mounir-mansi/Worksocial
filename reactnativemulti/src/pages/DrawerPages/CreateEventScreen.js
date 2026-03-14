import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { hostname } from '../../components/HostnameConnect/Hostname';

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    EventName: '',
    StartDate: '',
    EndDate: '',
    StartTime: '',
    EndTime: '',
    Description: '',
    Visibility: 'public',
    ParticipantCount: '',
  });
  const [saving, setSaving] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.EventName || !form.StartDate || !form.EndDate) {
      Alert.alert('Champs manquants', 'Le nom, la date de début et de fin sont obligatoires.');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${hostname}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          ParticipantCount: form.ParticipantCount ? parseInt(form.ParticipantCount, 10) : null,
        }),
      });

      if (response.status === 201) {
        Alert.alert('Succès', 'Événement créé !', [
          { text: 'OK', onPress: () => navigation.navigate('Evenements') },
        ]);
      } else {
        Alert.alert('Erreur', "Impossible de créer l'événement.");
      }
    } catch (err) {
      console.error('Erreur création événement:', err);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Créer un événement</Text>

      <Text style={styles.label}>Nom de l'événement *</Text>
      <TextInput
        style={styles.input}
        value={form.EventName}
        onChangeText={(v) => update('EventName', v)}
        placeholder="Nom de l'événement"
      />

      <Text style={styles.label}>Date de début * (JJ/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={form.StartDate}
        onChangeText={(v) => update('StartDate', v)}
        placeholder="ex: 15/06/2026"
      />

      <Text style={styles.label}>Date de fin * (JJ/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={form.EndDate}
        onChangeText={(v) => update('EndDate', v)}
        placeholder="ex: 16/06/2026"
      />

      <Text style={styles.label}>Heure de début</Text>
      <TextInput
        style={styles.input}
        value={form.StartTime}
        onChangeText={(v) => update('StartTime', v)}
        placeholder="ex: 09:00"
      />

      <Text style={styles.label}>Heure de fin</Text>
      <TextInput
        style={styles.input}
        value={form.EndTime}
        onChangeText={(v) => update('EndTime', v)}
        placeholder="ex: 18:00"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.Description}
        onChangeText={(v) => update('Description', v)}
        placeholder="Décrivez votre événement..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Nombre de participants max</Text>
      <TextInput
        style={styles.input}
        value={form.ParticipantCount}
        onChangeText={(v) => update('ParticipantCount', v)}
        placeholder="ex: 50"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Visibilité</Text>
      <View style={styles.visibilityRow}>
        {['public', 'private'].map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.visibilityBtn, form.Visibility === v && styles.visibilityBtnActive]}
            onPress={() => update('Visibility', v)}
          >
            <Text style={[styles.visibilityText, form.Visibility === v && styles.visibilityTextActive]}>
              {v === 'public' ? 'Public' : 'Privé'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, saving && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.submitButtonText}>
          {saving ? 'Création...' : "Créer l'événement"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#0F172A',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  visibilityRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  visibilityBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  visibilityBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  visibilityText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
  visibilityTextActive: { color: '#fff' },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 40,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: { backgroundColor: '#93C5FD', shadowOpacity: 0 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CreateEventScreen;
