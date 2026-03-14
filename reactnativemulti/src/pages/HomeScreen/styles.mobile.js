import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 28,
  },
  hero: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 8,
    letterSpacing: -1,
  },
  text: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  urlText: {
    fontSize: 11,
    color: '#94A3B8',
    position: 'absolute',
    top: 16,
  },
});
