# EduXam
Aplikasi ujian berbasis web menggunakan spreadsheet dengan javascript
<br>
halo semua, kali ini saya akan membagikan skrip yang bisa di gunakan sebagai alat yang bisa di gunakan sebagai penilaian akademis yang simpel dan free, tanpa harus mempunyai hosting ataupun membuat server, dan aplikasi ini bisa full online dengan memanfaatkan feature yang bisa kita gunakan dengan maksimal.
<br>
# Syarat yang dibutuhkan
- Google Spreadsheet
- Penyedia hosting free atau localhost atau github page
<br>
# Penggunaan
Buat struktur sheet di google spreadsheet dimana susunan sebagai berikut :
<br>
1. Nama Sheet "data_peserta"<br>
  Username | Password | Nama | Kelas | Jenis Kelamin
<br>
2. Nama Sheet "bank_soal"<br>
   id_soal | mapel | tingkat | soal | soal_img | opsia | opsia_img | opsib | opsib_img | opsic | opsic_img | opsid | opsid_img | opsie | opsie_img
<br>
3. Nama Sheet "status_ujian"<br>
   user | mapel | status
   <br>
4. Nama Sheet "jawaban"<br>
   user | mapel | id_soal | jawaban | timestamp
   <br>
5. Nama Sheet "nilai"<br>
   nama | mapel | benar | salah | total soal | nilai
<br>
setelah struktur sheet sudah selesai, silahkan lakukan copy-paste ke app script dengan kode yang ada pada repository dengan nama appscript.js setelah itu lakukan deploy script.
<br>
jika mengalami error cek isikan kode spreadsheet dengan mengecek pada url spreadsheet <br>
"https://docs.google.com/spreadsheets/d/xxx/edit?gid=64854960#gid=64854960" 
salin kode xxx ke appscript pada bagian <br>
const ss = SpreadsheetApp.openById("id_spreadsheet");<br>
setelah itu lakukan uji coba dengan api, jika sudah sukses lanjutkan di file js/app.js ubah baris <br>
const API_URL = "https://script.google.com/macros/s/kode_api_dari_app_script/exec";<br>
setelah itu lakukan uji coba dengan login menggunakan username dan password yang telah di masukkan pada spreadsheet<br><br>

# Aturan
jumlah soal yang muncul berdasarkan nama mapel yang dimasukkan.<br>
jika salah dalam menamai soal dan user terlanjur login, maka user harus logout terlebih dahulu dan melakukan login ulang, agar soal dapat terbaca<br>
pada bagian bank_soal kolom soal_img / opsia_img / opsib_img / opsic_img / opsid_img / opsie_img berisi url link gambar bukan file gambar<br>
