const ButtonEdit = document.querySelector(".button-edit");
const ModalPerusahaan = document.querySelector(".overlay-perusahaan");
const ModalTambah = `
    <div class="overlay-perusahaan" id="modal-container">
        <div class="modal-box-perusahaan">
            <div class="modal-header-perusahaan">
                <h2>Buat perusahaan</h2>
                <button class="close-btn-perushaan" onclick="document.querySelector('.overlay-perusahaan').remove()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-body-perusahaan">
                <label>Masukkan perusahaan baru mu</la  bel>
                <input type="text" placeholder="Ketikkan perusahaan baru..." class="input-nama-perusahaan">
                <button class="update-btn-perusahaan" onclick="ProsesDataBuatPerusahaan(event)">Buat Perusahaan</button>
            </div>
        </div>
    </div>
    `;

ButtonEdit.addEventListener("click", (event) => {
    event.preventDefault();
    const modalAktif = document.querySelector(".MainModalTambah");
    if (!modalAktif) {
        document.body.insertAdjacentHTML('beforeend', ModalTambah);
    } else {
        ModalAktif.remove();
    }
});

async function ProsesDataBuatPerusahaan(event) {
    event.preventDefault();
    const Inputnamaperusahaan = document.querySelector(".input-nama-perusahaan");
    const TombolUpdatePerusahaan = document.querySelector(".update-btn-perusahaan");

    let InputNamaPerusahaan = Inputnamaperusahaan.value.trim();
    if (!InputNamaPerusahaan) {
        alert("Nama perusahaan tidak boleh kosong!");
        return;
    }
    const regexHanyaHuruf = /^[a-zA-Z\s]+$/;
    if (!regexHanyaHuruf.test(InputNamaPerusahaan)) {
        alert("Nama perusahaan hanya boleh berisi huruf dan spasi! Tidak boleh ada angka atau simbol.");
        return;
    }

    // =========================================================================
    // LOGIKA TAMBAHAN: KONFIRMASI BIAYA BERDASARKAN TOTAL PERUSAHAAN DI EJS
    // =========================================================================
    // Mencari tombol tambah yang menyimpan atribut data-total
    const btnTambah = document.getElementById("btnTambahCompany") || document.querySelector(".button-edit");
    const totalSekarang = btnTambah ? (parseInt(btnTambah.getAttribute("data-total")) || 0) : 0;
    const nomorBerikutnya = totalSekarang + 1;
    const biayaPembuatan = nomorBerikutnya === 1 ? 0 : nomorBerikutnya;

    // Siapkan teks konfirmasi sesuai aturan biaya
    const teksBiaya = biayaPembuatan === 0
        ? "Pembuatan perusahaan pertama Anda bersifat GRATIS."
        : `Pembuatan perusahaan ke-${nomorBerikutnya} akan memotong balance akun Anda sebesar $${biayaPembuatan}.`;

    const konfirmasi = confirm(`${teksBiaya}\n\nApakah Anda yakin ingin melanjutkan pembuatan perusahaan "${InputNamaPerusahaan}"?`);
    if (!konfirmasi) {
        return; // Batalkan proses jika user memilih 'Cancel'
    }
    // =========================================================================

    try {
        TombolUpdatePerusahaan.disabled = true;
        TombolUpdatePerusahaan.innerText = "Memproses...";

        const respons = await fetch('/dashboard/api/nama-perusahaan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ namaPerusahaan: InputNamaPerusahaan })
        });
        const hasil = await respons.json();
        if (!respons.ok) {
            alert(hasil.pesan);
            return;
        } else {
            alert(hasil.pesan);
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        alert("Terjadi kesalahan koneksi ke server.");
    } finally {
        TombolUpdatePerusahaan.disabled = false;
        TombolUpdatePerusahaan.innerText = "Buat Perusahaan";
    }
}

const IconList = document.getElementById("icon-list");
const MenuList = document.getElementById("sidebarMenu");
const sidebarOverlay = document.getElementById('sidebarOverlay');

IconList.addEventListener("click", () => {
    MenuList.classList.toggle("sembunyikan");
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    MenuList.classList.add('sembunyikan');
    sidebarOverlay.classList.remove('active');
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
});

function tampilkanJam() {
    const waktu = new Date();
    const jamSekarang = waktu.toLocaleTimeString('id-ID');

    const elemenJam = document.querySelector('.jam');

    if (elemenJam) {
        elemenJam.innerText = jamSekarang;
    }
}
tampilkanJam();
setInterval(tampilkanJam, 1000);

const gearprofile = document.getElementById("gear-profile");
const menuProfile = document.querySelector(".profile");

gearprofile.addEventListener('click', () => {
    if (menuProfile.style.display === "none" || menuProfile.style.display === "") {
        menuProfile.style.display = "flex";
    } else {
        menuProfile.style.display = "none";
    }
});

const bsettings = document.getElementById("settings");
async function tombolalert(event) {
    event.preventDefault();
    alert('Fitur ini masih dalam tahap pengembangan');
}
bsettings.addEventListener("click", tombolalert);