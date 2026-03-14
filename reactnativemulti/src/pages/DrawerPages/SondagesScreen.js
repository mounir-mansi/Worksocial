import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostname } from '../../components/HostnameConnect/Hostname';

const SondagesScreen = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [votes, setVotes] = useState({}); // { surveyId: optionVoted }

  useEffect(() => {
    const init = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUserId = await AsyncStorage.getItem('userId');
      setToken(storedToken);
      setUserId(storedUserId);

      try {
        const response = await fetch(`${hostname}/surveys`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setSurveys(data);
      } catch (err) {
        console.error('Erreur chargement sondages:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleVote = async (surveyId, option) => {
    if (votes[surveyId]) {
      Alert.alert('Déjà voté', 'Vous avez déjà voté pour ce sondage.');
      return;
    }

    try {
      const response = await fetch(`${hostname}/surveys/${surveyId}/votes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: parseInt(userId, 10), votedOption: option }),
      });

      if (response.status === 204) {
        setVotes((prev) => ({ ...prev, [surveyId]: option }));
      } else {
        Alert.alert('Erreur', 'Impossible de voter.');
      }
    } catch (err) {
      console.error('Erreur vote:', err);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sondages</Text>
      <ScrollView>
        {surveys.length === 0 ? (
          <Text style={styles.empty}>Aucun sondage pour le moment.</Text>
        ) : (
          surveys.map((survey) => {
            const myVote = votes[survey.Survey_ID];
            const options = [
              survey.Option1,
              survey.Option2,
              survey.Option3,
              survey.Option4,
            ].filter(Boolean);

            return (
              <View key={survey.Survey_ID} style={styles.card}>
                <Text style={styles.cardTitle}>{survey.Title}</Text>
                {survey.Content ? (
                  <Text style={styles.cardContent}>{survey.Content}</Text>
                ) : null}
                {survey.EndDate ? (
                  <Text style={styles.cardDate}>
                    Fin : {new Date(survey.EndDate).toLocaleDateString('fr-FR')}
                  </Text>
                ) : null}

                <View style={styles.optionsContainer}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionBtn,
                        myVote === option && styles.optionBtnVoted,
                      ]}
                      onPress={() => handleVote(survey.Survey_ID, option)}
                      disabled={!!myVote}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          myVote === option && styles.optionTextVoted,
                        ]}
                      >
                        {myVote === option ? '✓ ' : ''}{option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })
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
  cardContent: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 6 },
  cardDate: { fontSize: 12, color: '#94A3B8', marginBottom: 12 },
  optionsContainer: { gap: 8 },
  optionBtn: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  optionBtnVoted: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  optionText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
  optionTextVoted: { color: '#fff' },
});

export default SondagesScreen;
