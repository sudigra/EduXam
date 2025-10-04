# EduXam
Aplikasi ujian berbasis web menggunakan spreadsheet dengan javascript

halo semua, kali ini saya akan membagikan skrip yang bisa di gunakan sebagai alat yang bisa di gunakan sebagai penilaian akademis yang simpel dan free, tanpa harus mempunyai hosting ataupun membuat server, dan aplikasi ini bisa full online dengan memanfaatkan feature yang bisa kita gunakan dengan maksimal.

# Syarat yang dibutuhkan
- Google Spreadsheet
- Penyedia hosting free atau localhost atau github page

# Penggunaan
Buat struktur sheet di google spreadsheet dimana susunan sebagai berikut :

1. Nama Sheet "data_peserta"<br>
  Username | Password | Nama | Kelas | Jenis Kelamin

2. Nama Sheet "bank_soal"
   id_soal | mapel | tingkat | soal | soal_img | opsia | opsia_img | opsib | opsib_img | opsic | opsic_img | opsid | opsid_img | opsie | opsie_img

3. Nama Sheet "status_ujian"
   user | mapel | status
   
4. Nama Sheet "jawaban"
   user | mapel | id_soal | jawaban | timestamp
   
5. Nama Sheet "nilai"
   nama | mapel | benar | salah | total soal | nilai

setelah struktur sheet sudah selesai, silahkan lakukan copy-paste ke app script dengan kode yang ada pada repository dengan nama appscript.js setelah itu lakukan deploy script.

jika mengalami error cek isikan kode spreadsheet dengan mengecek pada url spreadsheet 
"https://docs.google.com/spreadsheets/d/xxx/edit?gid=64854960#gid=64854960" 
salin kode xxx ke appscript pada bagian 
const ss = SpreadsheetApp.openById("id_spreadsheet");
setelah itu lakukan uji coba dengan api, jika sudah sukses lanjutkan di file js/app.js ubah baris 
const API_URL = "https://script.google.com/macros/s/kode_api_dari_app_script/exec";
setelah itu lakukan uji coba dengan login menggunakan username dan password yang telah di masukkan pada spreadsheet

# Aturan
jumlah soal yang muncul berdasarkan nama mapel yang dimasukkan.
jika salah dalam menamai soal dan user terlanjur login, maka user harus logout terlebih dahulu dan melakukan login ulang, agar soal dapat terbaca
pada bagian bank_soal kolom soal_img / opsia_img / opsib_img / opsic_img / opsid_img / opsie_img berisi url link gambar bukan file gambar
