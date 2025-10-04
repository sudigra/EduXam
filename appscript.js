function doGet(e) {
  const aksi = e.parameter.aksi || "";
  const ss = SpreadsheetApp.openById("1lApcKShZUf1U_1vZ4xDbGgzQUJUd2accBJet8X8jIew");

  if (aksi === "login") {
    return handleLogin(e, ss);
  } else if (aksi === "selesai") {
    return handleSelesai(e, ss);
  } else {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Aksi tidak dikenali" })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// === LOGIN ===
function handleLogin(e, ss) {
  const username = e.parameter.username || "";
  const password = e.parameter.password || "";

  const userSheet = ss.getSheetByName("data_siswa");
  const soalSheet = ss.getSheetByName("bank_soal");

  // cek user
  const users = userSheet.getDataRange().getValues();
  let nama = null;
  let userKelas = null;
  for (let i = 1; i < users.length; i++) {
    if (users[i][0] == username && users[i][1] == password) {
      nama = users[i][2];
      userKelas = users[i][3];
      break;
    }
  }

  if (!userKelas) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "User tidak ditemukan atau password salah" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const tingkat = userKelas.replace(/\D/g,"");

  // ambil soal sesuai kelas
  const data = soalSheet.getDataRange().getValues();
  const soal = [];
  let arrMapel = new Set();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] == tingkat) {
      arrMapel.add(data[i][1]);
      soal.push({
        id: data[i][0],
        mapel: data[i][1],
        kelas: data[i][2],
        soal_teks: data[i][3],
        soal_img: data[i][4],
        opsia: data[i][5],
        opsia_img: data[i][6],
        opsib: data[i][7],
        opsib_img: data[i][8],
        opsic: data[i][9],
        opsic_img: data[i][10],
        opsid: data[i][11],
        opsid_img: data[i][12]
      });
    }
  }

  const uniqueMapel = Array.from(arrMapel);

  // status ujian
  const shStatus = ss.getSheetByName("status_ujian");
  const statusRows = shStatus.getDataRange().getValues();
  statusRows.shift();
  let statusMapel = [];

  uniqueMapel.forEach(m => {
    const exist = statusRows.find(r => r[0] == username && r[1] == m);
    if (!exist) {
      shStatus.appendRow([username, m, "belum"]);
      statusMapel.push({ mapel: m, status: "belum" });
    } else {
      statusMapel.push({ mapel: exist[1], status: exist[2] });
    }
  });

  const output = {
    success: true,
    username: username,
    nama: nama,
    kelas: userKelas,
    statusMapel: statusMapel,
    soal: soal
  };

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// === SIMPAN JAWABAN & HITUNG NILAI ===
function handleSelesai(e, ss) {
  const username = e.parameter.username || "";
  const mapel = e.parameter.mapel || "";
  const jwb = e.parameter.jwb || ""; // format: "1:A,2:B,3:D"

  if (!username || !mapel || !jwb) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "Data tidak lengkap" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const shJawaban = ss.getSheetByName("jawaban");
  const shSoal = ss.getSheetByName("bank_soal");
  const shNilai = ss.getSheetByName("Nilai");
  const shStatus = ss.getSheetByName("status_ujian");
  const shUser   = ss.getSheetByName("data_siswa");
  
  // cari nama siswa berdasarkan username
  const users = shUser.getDataRange().getValues();
  let nama = "";
  for (let i = 1; i < users.length; i++) {
    if (users[i][0] == username) {
      nama = users[i][2]; // kolom ke-3 = nama
      break;
    }
  }

  const jawabanArr = jwb.split(","); // pecah per soal
  const dataJawaban = shJawaban.getDataRange().getValues();

  // simpan/update jawaban siswa
  jawabanArr.forEach(item => {
    const [idSoal, ans] = item.split(":");
    if (!idSoal || !ans) return;

    let found = false;
    for (let i = 1; i < dataJawaban.length; i++) {
      if (dataJawaban[i][0] == username && dataJawaban[i][1] == mapel && dataJawaban[i][2] == idSoal) {
        shJawaban.getRange(i + 1, 4).setValue(ans); // update jawaban
        shJawaban.getRange(i + 1, 5).setValue(new Date()); // update timestamp
        found = true;
        break;
      }
    }

    if (!found) {
      shJawaban.appendRow([username, mapel, idSoal, ans, new Date()]);
    }
  });

  // ambil data soal untuk cek kunci
  const dataSoal = shSoal.getDataRange().getValues();
  let benar = 0, total = 0;

  jawabanArr.forEach(item => {
    const [idSoal, jawaban] = item.split(":");
    if (!idSoal || !jawaban) return;

    // cari soal di bank_soal
    const soal = dataSoal.find(r => r[0] == idSoal);
    if (soal) {
      const kunci = soal[15]; // kolom P = index 15 (0-based)
      total++;
      if (jawaban.toUpperCase() == String(kunci).toUpperCase()) {
        benar++;
      }
    }
  });

  const salah = total - benar;
  const nilai = total > 0 ? Math.round((benar / total) * 100) : 0;

  // update sheet Nilai
  const dataNilai = shNilai.getDataRange().getValues();
  let updated = false;
  for (let i = 1; i < dataNilai.length; i++) {
    if (dataNilai[i][0] == username && dataNilai[i][1] == mapel) {
      shNilai.getRange(i + 1, 3).setValue(benar);
      shNilai.getRange(i + 1, 4).setValue(salah);
      shNilai.getRange(i + 1, 5).setValue(total);
      shNilai.getRange(i + 1, 6).setValue(nilai);
      updated = true;
      break;
    }
  }
  if (!updated) {
    shNilai.appendRow([username, nama, mapel, benar, salah, total, nilai]);
  }

// === Update status ujian jadi "selesai" ===
  const dataStatus = shStatus.getDataRange().getValues();
  for (let i = 1; i < dataStatus.length; i++) {
    if (dataStatus[i][0] == username && dataStatus[i][1] == mapel) {
      shStatus.getRange(i + 1, 3).setValue("selesai");
      break;
    }
  }
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: "Jawaban tersimpan & nilai dihitung" })
  ).setMimeType(ContentService.MimeType.JSON);
}
