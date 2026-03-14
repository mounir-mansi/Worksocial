import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  editSection: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
  editButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#DBEAFE',
    backgroundColor: '#E2E8F0',
  },
  username: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
  },
  name: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 2,
  },
  email: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  phone: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  biography: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  age: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  birthDate: {
    fontSize: 13,
    color: '#94A3B8',
  },
  address: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  gender: {
    fontSize: 13,
    color: '#64748B',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
