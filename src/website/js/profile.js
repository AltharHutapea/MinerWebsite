const IconList = document.getElementById("icon-list");
const MenuList = document.getElementById("sidebarMenu");
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (IconList && MenuList && sidebarOverlay) {
    IconList.addEventListener("click", () => {
        MenuList.classList.toggle("sembunyikan");
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        MenuList.classList.add('sembunyikan');
        sidebarOverlay.classList.remove('active');
    });
}

function tampilkanJam() {
    const waktu = new Date();
    const jamSekarang = waktu.toLocaleTimeString('id-ID');
    const elemenJam = document.querySelector('.jam');
    if (elemenJam) elemenJam.innerText = jamSekarang;
}
tampilkanJam();
setInterval(tampilkanJam, 1000);

const gearprofile = document.getElementById("gear-profile");
const menuProfile = document.getElementById("profileMenu");
if (gearprofile && menuProfile) {
    gearprofile.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menuProfile.style.display === "none" || menuProfile.style.display === "") {
            menuProfile.style.display = "flex";
        } else {
            menuProfile.style.display = "none";
        }
    });
    document.addEventListener('click', function (event) {
        if (!gearprofile.contains(event.target) && !menuProfile.contains(event.target)) {
            menuProfile.style.display = "none";
        }
    });
}

const bsettings = document.getElementById("settings");
if (bsettings) {
    bsettings.addEventListener("click", (event) => {
        event.preventDefault();
        alert('Fitur ini masih dalam tahap pengembangan');
    });
}

// ======================= Tombol mata =======================
document.addEventListener("DOMContentLoaded", function () {
    const tombolMata = document.getElementById('tombol-mata-password');
    const teksPassword = document.getElementById('teks-password');
    if (teksPassword && tombolMata) {
        const passwordAsli = teksPassword.getAttribute('data-real') || '*****';
        const passwordSensor = '•'.repeat(passwordAsli.length);
        teksPassword.innerText = passwordSensor;

        tombolMata.addEventListener('click', function () {
            const ikon = this.querySelector('i');
            if (teksPassword.innerText === passwordSensor) {
                teksPassword.innerText = passwordAsli;
                ikon.classList.remove('fa-eye');
                ikon.classList.add('fa-eye-slash');
            } else {
                teksPassword.innerText = passwordSensor;
                ikon.classList.remove('fa-eye-slash');
                ikon.classList.add('fa-eye');
            }
        });
    }

    const tombolEmail = document.getElementById("tombol-mata-email");
    const teksEmail = document.getElementById("teks-email");
    if (teksEmail && tombolEmail) {
        const emailAsli = teksEmail.getAttribute('data-real') || 'email@example.com';
        const emailSensor = '•'.repeat(emailAsli.length);
        teksEmail.innerText = emailSensor;
        tombolEmail.addEventListener("click", function () {
            const ikon = this.querySelector('i');
            if (teksEmail.innerText === emailSensor) {
                teksEmail.innerText = emailAsli;
                ikon.classList.remove('fa-eye');
                ikon.classList.add('fa-eye-slash');
            } else {
                teksEmail.innerText = emailSensor;
                ikon.classList.remove('fa-eye-slash');
                ikon.classList.add('fa-eye');
            }
        });
    }
});

// Profile
document.addEventListener("DOMContentLoaded", function(){
    // ========================================================
    // BAGIAN 1: SINKRONISASI WARNA AVATAR (PROFIL UTAMA & USER INFO)
    // ========================================================
    const profileAvatar = document.getElementById("profile-avatar");
    const headerAvatar = document.getElementById("header-avatar");
    
    // Fungsi universal untuk mendeteksi nama file gambar dan mengubah warnanya
    function setelWarnaElemen(avatarElement) {
        if (avatarElement) {
            const namaFileDatabase = avatarElement.getAttribute("data-avatar-file");
            let warnaTerpilih = "#e94560"; // Warna bawaan awal dari CSS

            if (namaFileDatabase && namaFileDatabase !== "default-avatar.png") {
                if (namaFileDatabase.includes("blue")) { warnaTerpilih = "#3b82f6"; }
                else if (namaFileDatabase.includes("green")) { warnaTerpilih = "#10b981"; }
                else if (namaFileDatabase.includes("yellow")) { warnaTerpilih = "#f59e0b"; }
                else if (namaFileDatabase.includes("purple")) { warnaTerpilih = "#8b5cf6"; }
                else if (namaFileDatabase.includes("red-muda")) { warnaTerpilih = "#e94560"; }
                else if (namaFileDatabase.includes("red")) { warnaTerpilih = "#ef4444"; }
                else if (namaFileDatabase.includes("pink")) { warnaTerpilih = "#ec4899"; }
                else if (namaFileDatabase.includes("cyan")) { warnaTerpilih = "#06b6d4"; }
            }
            // Terapkan perubahan warna latar belakang langsung ke DOM elemen
            avatarElement.style.backgroundColor = warnaTerpilih;
        }
    }

    // Eksekusi pewarnaan otomatis serempak untuk kedua avatar
    setelWarnaElemen(profileAvatar);
    setelWarnaElemen(headerAvatar);


    // ========================================================
    // BAGIAN 2: LOGIKA POP-UP MODAL GANTI AVATAR
    // ========================================================
    const ButtonBio = document.getElementById("btn-avatar");
    
    const modalAvatarHTML = `
    <div class="overlay" id="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <h2><i class="fas fa-image"></i> Ubah Avatar</h2>
                <span class="close-btn" id="closeAvatarModal">&times;</span>
            </div>
            <form id="formUbahAvatar" onsubmit="ProsesWarnaAvatar(event)">
                <div class="modal-body">
                    <label for="avatarColor">Warna Avatar</label>
                    
                    <select id="input-profile" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; margin-bottom: 20px; font-weight: bold; font-size: 16px;">
                        <option value="#e94560">Merah Muda</option>
                        <option value="#3b82f6">Biru</option>
                        <option value="#10b981">Hijau</option>
                        <option value="#f59e0b">Kuning</option>
                        <option value="#8b5cf6">Ungu</option>
                        <option value="#ef4444">Merah</option>
                        <option value="#ec4899">Pink</option>
                        <option value="#06b6d4">Cyan</option>
                    </select>
                    
                    <button type="submit" class="update-btn"><i class="fas fa-save"></i> Update Avatar</button>
                </div>
            </form>
        </div>
    </div>`;

    if (ButtonBio) {
        ButtonBio.addEventListener('click', function(event) {
            event.preventDefault();
            
            const existingModal = document.getElementById("modal-container");
            if (!existingModal) {
                document.body.insertAdjacentHTML('beforeend', modalAvatarHTML);
                
                const closeBtn = document.getElementById("closeAvatarModal");
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        document.getElementById("modal-container").remove();
                    });
                }
            } else {
                existingModal.remove();
            }
        });
    }
});


async function ProsesWarnaAvatar(event){
    event.preventDefault();

    // Mengambil elemen berdasarkan ID baru yaitu "input-profile"
    const selectWarna = document.getElementById("input-profile");
    let warnaTerpilih = selectWarna ? selectWarna.value : "";

    try {
        const respons = await fetch('/profile/api/avatar-color', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ color: warnaTerpilih })
        });
        
        const hasil = await respons.json();
        
        if(!respons.ok){
            alert(hasil.pesan);  
            return;
        } else {
            alert(hasil.pesan);
            
            const modal = document.getElementById("modal-container");
            if (modal) modal.remove();

            window.location.reload();
        }
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
}

// Username
document.addEventListener("DOMContentLoaded", function(){
    const ButtonBio = document.getElementById("btn-username");
    const DataBio = `
    <div class="overlay" id="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <h2>Ubah Username Anda</h2>
                <span class="close-btn" onclick="document.getElementById('modal-container').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <label>Masukkan Username baru mu</label>
                <input type="text" placeholder="ketikkan username baru" id="input-username">
                <button class="update-btn" id="update-username" onclick="ProsesDataUsername(event)">Update username</button>
            </div>
        </div>
    </div>
    `;

    if (ButtonBio) {
        ButtonBio.addEventListener('click', function(event) {
            event.preventDefault();
            
            const contentBody = document.querySelector(".content-body");
            
            if (contentBody) {
                const existingModal = document.getElementById("modal-container");
                
                if (!existingModal) {
                    document.body.insertAdjacentHTML('beforeend', DataBio);
                } else {
                    existingModal.remove();
                }
            }
        });
    }
});

async function ProsesDataUsername(event){
    event.preventDefault();

    const Inputusername = document.getElementById("input-username");
    const Buttonusername = document.getElementById("update-username");
    let InputUsername = Inputusername.value;
    try {
        const respons = await fetch('/profile/api/username', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: InputUsername})
        });
        const hasil = await respons.json();
        if(!respons.ok){
            alert(hasil.pesan)  
            return;
        } else {
            alert(hasil.pesan)
            window.location.reload();
        }
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
}

// Password
document.addEventListener("DOMContentLoaded", function(){
    const ButtonBio = document.getElementById("btn-password");
    const DataBio = `
    <div class="overlay" id="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <h2>Ubah Password Anda</h2>
                <span class="close-btn" onclick="document.getElementById('modal-container').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <label>Password Lama</label>
                <input type="text" placeholder="ketikkan password baru" id="input-password" class="input-password-lama">

                <label>Password</label>
                <input type="text" placeholder="ketikkan password baru" id="input-password" class="input-Password-baru">
                
                <label>Password Confirm</label>
                <input type"text" placeholder="ketikkan password konfirmasi baru" id="input-password" class="input-password-konfirmasi">

                <button class="update-btn" id="update-password" onclick="ProsesDataPassword(event)">Update Password</button>
            </div>
        </div>
    </div>
    `;

    if (ButtonBio) {
        ButtonBio.addEventListener('click', function(event) {
            event.preventDefault();
            
            const contentBody = document.querySelector(".content-body");
            
            if (contentBody) {
                const existingModal = document.getElementById("modal-container");
                
                if (!existingModal) {
                    document.body.insertAdjacentHTML('beforeend', DataBio);
                } else {
                    existingModal.remove();
                }
            }
        });
    }
});

async function ProsesDataPassword(event){
    event.preventDefault();
    const Inputpasswordlama = document.querySelector(".input-password-lama");
    const Inputpassword = document.querySelector(".input-Password-baru");
    const Inputpasswordkonfirmasi = document.querySelector(".input-password-konfirmasi");
    let InputPasswordLama = Inputpasswordlama ? Inputpasswordlama.value : "";
    let InputPassword = Inputpassword ? Inputpassword.value : "";
    let InputPasswordKonfirmasi = Inputpasswordkonfirmasi ? Inputpasswordkonfirmasi.value : "";

    try {
        const respons = await fetch('/profile/api/password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                passwordLama: InputPasswordLama,
                passwordBaru: InputPassword,
                passwordKonfirmasi: InputPasswordKonfirmasi
            })
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
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
}


// Email
document.addEventListener("DOMContentLoaded", function(){
    const ButtonBio = document.getElementById("btn-email");
    const DataBio = `
    <div class="overlay" id="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <h2>Ubah Email Anda</h2>
                <span class="close-btn" onclick="document.getElementById('modal-container').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <label>Masukkan email baru mu</label>
                <input type="text" placeholder="ketikkan email baru" id="input-email">
                <button class="update-btn" id="update-email" onclick="ProsesDataEmail(event)">Update Email</button>
            </div>
        </div>
    </div>
    `;

    if (ButtonBio) {
        ButtonBio.addEventListener('click', function(event) {
            event.preventDefault();
            
            const contentBody = document.querySelector(".content-body");
            
            if (contentBody) {
                const existingModal = document.getElementById("modal-container");
                
                if (!existingModal) {
                    document.body.insertAdjacentHTML('beforeend', DataBio);
                } else {
                    existingModal.remove();
                }
            }
        });
    }
});

async function ProsesDataEmail(event){
    event.preventDefault();

    const Inputemail = document.getElementById("input-email");
    const ButtonBio = document.getElementById("update-email");
    let InputEmail = Inputemail.value;
    const namaDepanEmail = InputEmail.split('@')[0];
    if (!InputEmail.endsWith('@gmail.com') || namaDepanEmail === "") {
        alert("Update Email Gagal! Format email tidak valid (Contoh: nama@gmail.com)");
        return;
    }
    if (InputEmail.length > 35) {
        alert("Update Email Gagal! Email terlalu panjang (Maksimal 25 karakter diluar @gmail.com)");
        return;
    }
    try {
        const respons = await fetch('/profile/api/email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: InputEmail})
        });
        const hasil = await respons.json();
        if(!respons.ok){
            alert(hasil.pesan)  
            return;
        } else {
            alert(hasil.pesan)
            window.location.reload();
        }
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
}

// Bio
document.addEventListener("DOMContentLoaded", function(){
    const ButtonBio = document.getElementById("btn-bio");
    const DataBio = `
    <div class="overlay" id="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <h2>Ubah Bio Anda</h2>
                <span class="close-btn" onclick="document.getElementById('modal-container').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <label>Apa yang anda pikirkan?</label>
                <input type="text" placeholder="ketikkan bio baru" id="input-bio">
                <button class="update-btn" id="update-bio" onclick="ProsesDataBio(event)">Update Bio</button>
            </div>
        </div>
    </div>
    `;

    if (ButtonBio) {
        ButtonBio.addEventListener('click', function(event) {
            event.preventDefault();
            const contentBody = document.querySelector(".content-body");
            if (contentBody) {
                const existingModal = document.getElementById("modal-container");
                
                if (!existingModal) {
                    document.body.insertAdjacentHTML('beforeend', DataBio);
                } else {
                    existingModal.remove();
                }
            }
        });
    }
});

async function ProsesDataBio(event){
    event.preventDefault();

    const Inputbio = document.getElementById("input-bio");
    const ButtonBio = document.getElementById("update-bio");
    let InputBio = Inputbio.value;
    try {
        const respons = await fetch('/profile/api/bio', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({bio: InputBio})
        });
        const hasil = await respons.json();
        if(!respons.ok){
            alert(hasil.pesan)  
            return;
        } else {
            alert(hasil.pesan)
            window.location.reload();
        }
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
}