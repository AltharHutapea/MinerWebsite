const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("ph-eye");
    this.classList.toggle("ph-eye-slash");
});

const tombolMasuk = document.getElementById('masuk');
const re_username = document.getElementById('username');
const re_email = document.getElementById('email');
const re_password = document.getElementById('password');

async function prosesBuatAkun(event) {
    event.preventDefault();

    let Username = re_username.value;
    let Email = re_email.value;
    let Password = re_password.value;
    const namaDepanEmail = Email.split('@')[0];
    if (!Email.endsWith('@gmail.com') || namaDepanEmail === "") {
        alert("Pendaftaran gagal! Email harus diakhiri dengan @gmail.com");
        return;
    }
    if (Email.length > 35) {
        alert("Email terlalu panjang (maksimal 25 karakter diluar @gmail.com)")
    }
    try {
        const respons = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: Username, password: Password, email: Email })
        });
        const hasil = await respons.json();
        if (hasil.sukses) {
            alert(hasil.pesan || "Pendaftaran berhasil!");
            window.location.href = '/';
        } else {
            alert(hasil.pesan);
        }
    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi masalah koneksi ke server.");
    }
};
tombolMasuk.addEventListener("click", prosesBuatAkun);