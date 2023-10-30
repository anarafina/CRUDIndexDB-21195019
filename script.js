// Membuat atau membuka database IndexedDB
var db;
var request = indexedDB.open("mahasiswaDB", 1);

request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
    db = event.target.result;
    tampilData();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("mahasiswa")) {
        var objectStore = db.createObjectStore("mahasiswa", { keyPath: "nim" });
        objectStore.createIndex("nama", "nama", { unique: false });
        objectStore.createIndex("alamat", "alamat", { unique: false });
        objectStore.createIndex("asalSekolah", "asalSekolah", { unique: false });
        objectStore.createIndex("noTelp", "noTelp", { unique: false });
    }
};

// Fungsi untuk menambahkan data
function tambahData() {
    var nim = document.getElementById("nim").value;
    var nama = document.getElementById("nama").value;
    var alamat = document.getElementById("alamat").value;
    var asalSekolah = document.getElementById("asal_sekolah").value;
    var noTelp = document.getElementById("no_telp").value;

    if (!nim || !nama || !alamat || !asalSekolah || !noTelp) {
        console.error("Semua field harus diisi.");
        return;
    }

    var transaction = db.transaction(["mahasiswa"], "readwrite");
    var objectStore = transaction.objectStore("mahasiswa");
    var request = objectStore.add({
        nim: nim,
        nama: nama,
        alamat: alamat,
        asalSekolah: asalSekolah,
        noTelp: noTelp
    });

    request.onsuccess = function(event) {
        document.getElementById("nim").value = "";
        document.getElementById("nama").value = "";
        document.getElementById("alamat").value = "";
        document.getElementById("asal_sekolah").value = "";
        document.getElementById("no_telp").value = "";
        tampilData();
    };
}

// Fungsi untuk menampilkan data
function tampilData() {
    var objectStore = db.transaction("mahasiswa").objectStore("mahasiswa");
    var dataMahasiswa = document.getElementById("data-mahasiswa");
    dataMahasiswa.innerHTML = "";

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            var row = document.createElement("tr");
            var cellNama = document.createElement("td");
            var cellNIM = document.createElement("td");
            var cellAlamat = document.createElement("td");
            var cellAsalSekolah = document.createElement("td");
            var cellNoTelp = document.createElement("td");
            var cellAksi = document.createElement("td");
            var btnHapus = document.createElement("button");
            var btnEdit = document.createElement("button");

            cellNama.textContent = cursor.value.nama;
            cellNIM.textContent = cursor.value.nim;
            cellAlamat.textContent = cursor.value.alamat;
            cellAsalSekolah.textContent = cursor.value.asalSekolah;
            cellNoTelp.textContent = cursor.value.noTelp;

            btnHapus.textContent = "Hapus";
            btnHapus.addEventListener("click", function() {
                hapusData(cursor.value.nim);
            });

            btnEdit.textContent = "Edit";
            btnEdit.addEventListener("click", function() {
                editData(cursor.value.nim, cursor.value.nama, cursor.value.alamat, cursor.value.asalSekolah, cursor.value.noTelp);
            });

            cellAksi.appendChild(btnEdit);
            cellAksi.appendChild(btnHapus);
            row.appendChild(cellNama);
            row.appendChild(cellNIM);
            row.appendChild(cellAlamat);
            row.appendChild(cellAsalSekolah);
            row.appendChild(cellNoTelp);
            row.appendChild(cellAksi);

            dataMahasiswa.appendChild(row);

            cursor.continue();
        }
    };
}

// Fungsi untuk menghapus data
function hapusData(nim) {
    var transaction = db.transaction(["mahasiswa"], "readwrite");
    var objectStore = transaction.objectStore("mahasiswa");
    var request = objectStore.delete(nim);

    request.onsuccess = function(event) {
        tampilData();
    };
}

// Fungsi untuk mengedit data
function editData(nim, namaAwal, alamatAwal, asalSekolahAwal, noTelpAwal) {
    var newNama = prompt("Edit Nama", namaAwal);
    var newAlamat = prompt("Edit Alamat", alamatAwal);
    var newAsalSekolah = prompt("Edit Asal Sekolah", asalSekolahAwal);
    var newNoTelp = prompt("Edit Nomor Telepon", noTelpAwal);

    if (newNama !== null) {
        var transaction = db.transaction(["mahasiswa"], "readwrite");
        var objectStore = transaction.objectStore("mahasiswa");
        var request = objectStore.get(nim);

        request.onsuccess = function(event) {
            var data = event.target.result;
            data.nama = newNama;
            data.alamat = newAlamat;
            data.asalSekolah = newAsalSekolah;
            data.noTelp = newNoTelp;
            var updateRequest = objectStore.put(data);

            updateRequest.onsuccess = function() {
                tampilData();
            };
        };
    }
}
