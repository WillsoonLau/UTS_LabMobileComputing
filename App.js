import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import InfoCard from './src/components/InfoCard';

const DAFTAR_TUGAS = [
  { id: 't1', title: 'Jobsheet 04: Props & Komponen', status: 'selesai', tenggat: '20 Oktober 2026' },
  { id: 't2', title: 'Jobsheet 05: FlatList & Filter', status: 'proses', tenggat: '28 Oktober 2026' },
  { id: 't3', title: 'Laporan UTS Mobile Computing', status: 'proses', tenggat: '30 Oktober 2026' },
  { id: 't4', title: 'Praktikum Navigasi & State', status: 'selesai', tenggat: '22 Oktober 2026' },
];

const DAFTAR_MAHASISWA = [
  { id: '1', nama: 'Alifia Putri', prodi: 'Sistem Informasi' },
  { id: '2', nama: 'Budi Santoso', prodi: 'Teknologi Informasi' },
  { id: '3', nama: 'Citra Dewi', prodi: 'Sistem Informasi' },
  { id: '4', nama: 'Dimas Anggara', prodi: 'Teknik Informatika' },
  { id: '5', nama: 'Eka Nur Safitri', prodi: 'Sistem Informasi' },
];

const PILIHAN_PRODI = ['Sistem Informasi', 'Teknologi Informasi', 'Teknik Informatika'];

const TABS = [
  { key: 'tugas', label: 'Tugas', ikon: '📋' },
  { key: 'mahasiswa', label: 'Mahasiswa', ikon: '👥' },
];

const ambilInisial = (nama) =>
  nama
    .split(' ')
    .slice(0, 2)
    .map((kata) => kata[0])
    .join('')
    .toUpperCase();

function NamaSorot({ nama, keyword }) {
  const kunci = keyword.trim().toLowerCase();
  const posisi = kunci ? nama.toLowerCase().indexOf(kunci) : -1;
  if (posisi === -1) return <Text style={styles.nama}>{nama}</Text>;
  const akhir = posisi + kunci.length;
  return (
    <Text style={styles.nama}>
      {nama.slice(0, posisi)}
      <Text style={styles.sorot}>{nama.slice(posisi, akhir)}</Text>
      {nama.slice(akhir)}
    </Text>
  );
}

function JudulLayar({ judul, sub }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.eyebrow}>DASHBOARD MAHASISWA</Text>
      <Text style={styles.judulLayar}>{judul}</Text>
      <Text style={styles.subLayar}>{sub}</Text>
    </View>
  );
}

function TugasScreen() {
  const [daftar, setDaftar] = useState(DAFTAR_TUGAS);
  const [terpilih, setTerpilih] = useState(null); // tugas yang sedang dibuka di dialog

  const total = daftar.length;
  const selesai = daftar.filter((t) => t.status === 'selesai').length;
  const proses = total - selesai;
  const persen = total === 0 ? 0 : Math.round((selesai / total) * 100);

  const tandaiSelesai = () => {
    setDaftar(daftar.map((t) => (t.id === terpilih.id ? { ...t, status: 'selesai' } : t)));
    setTerpilih(null);
  };

  const sudahSelesai = terpilih && terpilih.status === 'selesai';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.list}>
        <JudulLayar judul="Daftar Tugas" sub="Kelola tugasmu dengan mudah." />

        <View style={styles.progresCard}>
          <Text style={styles.progresLabel}>Progres kamu</Text>
          <Text style={styles.progresAngka}>{persen}%</Text>
          <View style={styles.barLatar}>
            <View style={[styles.barIsi, { width: `${persen}%` }]} />
          </View>
          <View style={styles.statRow}>
            <View style={styles.statTile}>
              <Text style={styles.statAngka}>{selesai}</Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statAngka}>{proses}</Text>
              <Text style={styles.statLabel}>Dalam proses</Text>
            </View>
          </View>
        </View>

        <Text style={styles.seksi}>Tugas Saya</Text>

        {daftar.map((tugas) => (
          <InfoCard
            key={tugas.id}
            title={tugas.title}
            status={tugas.status}
            onPress={() => setTerpilih(tugas)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={terpilih !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTerpilih(null)}
      >
        <Pressable style={styles.backdropTengah} onPress={() => setTerpilih(null)}>
          <Pressable style={styles.dialog} onPress={() => {}}>
            {terpilih && (
              <>
                <Text style={styles.dialogJudul}>Detail</Text>
                <Text style={styles.dialogNama}>{terpilih.title}</Text>
                <Text style={styles.dialogIsi}>
                  {sudahSelesai
                    ? 'Tugas sudah selesai! Kerja bagus 🎉'
                    : 'Tugas sedang dikerjakan!'}
                </Text>
                <Text style={styles.dialogIsi}>
                  {sudahSelesai ? 'Dikumpulkan sebelum: ' : 'Tenggat: '}
                  {terpilih.tenggat}
                </Text>

                {!sudahSelesai && (
                  <TouchableOpacity style={styles.btnUtama} onPress={tandaiSelesai}>
                    <Text style={styles.btnUtamaText}>Tandai Selesai ✓</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.btnTeks} onPress={() => setTerpilih(null)}>
                  <Text style={styles.btnTeksText}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function MahasiswaScreen() {
  const [daftar, setDaftar] = useState(DAFTAR_MAHASISWA);
  const [keyword, setKeyword] = useState('');

  const [formTampil, setFormTampil] = useState(false);
  const [namaBaru, setNamaBaru] = useState('');
  const [prodiBaru, setProdiBaru] = useState(PILIHAN_PRODI[0]);
  const [galat, setGalat] = useState('');

  const hasil = daftar.filter((mhs) =>
    mhs.nama.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const tutupForm = () => {
    setFormTampil(false);
    setNamaBaru('');
    setProdiBaru(PILIHAN_PRODI[0]);
    setGalat('');
  };

  const simpan = () => {
    const nama = namaBaru.trim();
    if (nama === '') {
      setGalat('Nama wajib diisi.');
      return;
    }
    setDaftar([...daftar, { id: String(daftar.length + 1), nama, prodi: prodiBaru }]);
    setKeyword('');
    tutupForm();
  };

  const header = (
    <View>
      <JudulLayar judul="Daftar Mahasiswa" sub="Temukan mahasiswa dengan mudah." />

      <View style={styles.totalCard}>
        <View>
          <Text style={styles.progresLabel}>Total Mahasiswa</Text>
          <Text style={styles.progresAngka}>{daftar.length}</Text>
          <Text style={styles.totalSub}>Mahasiswa terdaftar</Text>
        </View>
        <View style={styles.totalIkon}>
          <Text style={{ fontSize: 28 }}>👥</Text>
        </View>
      </View>

      <View style={styles.inputWrap}>
        <Text style={styles.inputIkon}>⌕</Text>
        <TextInput
          style={styles.input}
          placeholder="Cari nama mahasiswa..."
          placeholderTextColor="#7A8FB0"
          value={keyword}
          onChangeText={setKeyword}
          autoCorrect={false}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword('')}>
            <Text style={styles.hapus}>Hapus</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.seksiRow}>
        <View>
          <Text style={styles.seksi}>Semua mahasiswa</Text>
          <Text style={styles.hasilJumlah}>
            {hasil.length} dari {daftar.length} ditampilkan
          </Text>
        </View>
        <TouchableOpacity style={styles.tambahBtn} onPress={() => setFormTampil(true)}>
          <Text style={styles.tambahText}>+ Tambah Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={hasil}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.baris}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{ambilInisial(item.nama)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <NamaSorot nama={item.nama} keyword={keyword} />
              <Text style={styles.prodi}>{item.prodi}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={styles.kosong}>
            <Text style={styles.kosongIkon}>⌕</Text>
            <Text style={styles.kosongText}>Data tidak ditemukan!</Text>
            <Text style={styles.kosongSub}>Coba kata kunci nama lainnya.</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />

      <Modal visible={formTampil} transparent animationType="slide" onRequestClose={tutupForm}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.backdropBawah} onPress={tutupForm}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <View style={styles.handle} />
              <Text style={styles.sheetJudul}>Tambah Mahasiswa</Text>

              <Text style={styles.formLabel}>Nama lengkap</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Contoh: Hana Pertiwi"
                placeholderTextColor="#7A8FB0"
                value={namaBaru}
                onChangeText={(t) => {
                  setNamaBaru(t);
                  if (galat) setGalat('');
                }}
              />
              {galat !== '' && <Text style={styles.galat}>{galat}</Text>}

              <Text style={styles.formLabel}>Program studi</Text>
              <View style={styles.chipRow}>
                {PILIHAN_PRODI.map((p) => {
                  const aktif = p === prodiBaru;
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setProdiBaru(p)}
                      style={[styles.chip, aktif && styles.chipAktif]}
                    >
                      <Text style={[styles.chipText, aktif && styles.chipTextAktif]}>{p}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.btnUtama} onPress={simpan}>
                <Text style={styles.btnUtamaText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnTeks} onPress={tutupForm}>
                <Text style={styles.btnTeksText}>Batal</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState('tugas');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.layar, tab !== 'tugas' && styles.sembunyi]}>
        <TugasScreen />
      </View>
      <View style={[styles.layar, tab !== 'mahasiswa' && styles.sembunyi]}>
        <MahasiswaScreen />
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabInner}>
          {TABS.map((t) => {
            const aktif = t.key === tab;
            return (
              <TouchableOpacity
                key={t.key}
                style={styles.tabItem}
                onPress={() => setTab(t.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabIkonBox, aktif && styles.tabIkonAktif]}>
                  <Text style={styles.tabIkon}>{t.ikon}</Text>
                </View>
                <Text style={[styles.tabLabel, aktif && styles.tabLabelAktif]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const BIRU = '#1E4FBF';
const NAVY = '#0F2547';
const MUTED = '#5B7094';
const BORDER = '#CFE0F8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 50,
  },
  layar: { flex: 1 },
  sembunyi: { display: 'none' },
  list: { padding: 18, paddingBottom: 30, width: '100%', maxWidth: 520, alignSelf: 'center' },

  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: '#3F66B0' },
  judulLayar: { fontSize: 28, fontWeight: '900', color: NAVY, marginTop: 6 },
  subLayar: { fontSize: 14, color: MUTED, marginTop: 4 },

  progresCard: { backgroundColor: BIRU, borderRadius: 26, padding: 20, marginBottom: 26 },
  progresLabel: { fontSize: 13, color: '#BFD4FF', fontWeight: '600' },
  progresAngka: { fontSize: 44, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  barLatar: { height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 8, overflow: 'hidden' },
  barIsi: { height: '100%', borderRadius: 999, backgroundColor: '#FFFFFF' },
  statRow: { flexDirection: 'row', marginTop: 16 },
  statTile: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 16, padding: 14, marginRight: 10 },
  statAngka: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: '#D6E4FF', marginTop: 2 },

  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BIRU,
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
  },
  totalSub: { fontSize: 12, color: '#D6E4FF', marginTop: 2 },
  totalIkon: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  seksi: { fontSize: 20, fontWeight: '900', color: NAVY, marginBottom: 14 },
  seksiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 14 },
  hasilJumlah: { fontSize: 12, color: MUTED, marginTop: -10 },
  tambahBtn: { backgroundColor: '#D4E3FA', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  tambahText: { fontSize: 13, fontWeight: '800', color: BIRU },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
  },
  inputIkon: { fontSize: 22, color: '#3F66B0', marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: NAVY,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  hapus: { fontSize: 13, fontWeight: '800', color: BIRU },

  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 10,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E3EEFF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { fontWeight: '800', color: BIRU },
  nama: { fontSize: 16, fontWeight: '800', color: NAVY },
  sorot: { backgroundColor: '#BFD7FF', color: '#0B2E7A' },
  prodi: { fontSize: 13, color: MUTED, marginTop: 2 },

  kosong: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    paddingVertical: 30,
  },
  kosongIkon: { fontSize: 40, color: BIRU },
  kosongText: { fontSize: 16, fontWeight: '800', color: NAVY, marginTop: 6 },
  kosongSub: { fontSize: 13, color: MUTED, marginTop: 4 },

  backdropTengah: { flex: 1, backgroundColor: 'rgba(8,20,50,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 340, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22 },
  dialogJudul: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#3F66B0' },
  dialogNama: { fontSize: 18, fontWeight: '900', color: NAVY, marginTop: 6, marginBottom: 10 },
  dialogIsi: { fontSize: 14, color: MUTED, lineHeight: 21 },

  btnUtama: { backgroundColor: BIRU, borderRadius: 14, paddingVertical: 13, alignItems: 'center', marginTop: 18 },
  btnUtamaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  btnTeks: { paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnTeksText: { color: BIRU, fontWeight: '800', fontSize: 14 },

  backdropBawah: { flex: 1, backgroundColor: 'rgba(8,20,50,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 30,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: '#D5DFF5', alignSelf: 'center', marginBottom: 16 },
  sheetJudul: { fontSize: 20, fontWeight: '900', color: NAVY, marginBottom: 6 },
  formLabel: { fontSize: 13, fontWeight: '700', color: MUTED, marginTop: 14, marginBottom: 8 },
  formInput: {
    backgroundColor: '#F2F7FF',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: NAVY,
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  galat: { color: '#D14343', fontSize: 12, fontWeight: '700', marginTop: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { backgroundColor: '#E3ECFF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  chipAktif: { backgroundColor: BIRU },
  chipText: { fontSize: 13, fontWeight: '700', color: '#3B5BA8' },
  chipTextAktif: { color: '#FFFFFF' },

  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    paddingTop: 8,
  },
  tabInner: { flexDirection: 'row', width: '100%', maxWidth: 520, alignSelf: 'center' },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIkonBox: { paddingHorizontal: 18, paddingVertical: 4, borderRadius: 999 },
  tabIkonAktif: { backgroundColor: '#D4E3FA' },
  tabIkon: { fontSize: 20 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#7A8FB0', marginTop: 2 },
  tabLabelAktif: { color: BIRU },
});
