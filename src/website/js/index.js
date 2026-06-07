document.addEventListener("DOMContentLoaded", function() {
    const tombol = document.getElementById("enter");
    const inputUser = document.getElementById("username");
    const inputPassword = document.getElementById("password");

    if (!tombol) {
        console.error("Tombol #enter tidak ditemukan!");
        return;
    }

    async function prosesMasukAkun(event) {
        event.preventDefault();

        let User = inputUser.value;
        let Pass = inputPassword.value;

        const respon = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: User, password: Pass })
        });

        const hasil = await respon.json();

        if (hasil.sukses) {
            window.location.href = '/dashboard';
        } else {
            alert(hasil.pesan);
        }
    }

    tombol.addEventListener("click", prosesMasukAkun);
});
