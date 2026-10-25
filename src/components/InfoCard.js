import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TAMPILAN_STATUS = {
  selesai: { ikon: '✓', label: 'Selesai', bg: '#D7F5E3', teks: '#0F7A3E' },
  proses: { ikon: '◔', label: 'Dalam Proses', bg: '#FFE7C7', teks: '#B35C00' },
};

export default function InfoCard({ title, status, onPress }) {
  const tampil = TAMPILAN_STATUS[status] || TAMPILAN_STATUS.proses;

  return (
    <View style={styles.card}>
      <View style={styles.atas}>
        <View style={styles.ikonBox}>
          <Text style={styles.ikon}>{tampil.ikon}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: tampil.bg }]}>
          <Text style={[styles.badgeText, { color: tampil.teks }]}>{tampil.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Lihat Detail</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#CFE0F8',
    padding: 18,
    marginBottom: 14,
  },
  atas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ikonBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikon: { fontSize: 20, fontWeight: '800', color: '#1E4FBF' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '800' },
  title: { fontSize: 17, fontWeight: '800', color: '#0F2547', marginTop: 16, marginBottom: 16 },
  button: {
    backgroundColor: '#1E4FBF',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
