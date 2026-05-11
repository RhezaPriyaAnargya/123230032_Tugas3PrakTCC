# Tugas 3 - Deployment Aplikasi Notes ke App Engine dan Cloud Run

Repositori ini berisi kode sumber untuk tugas modernisasi arsitektur aplikasi "Notebook Harian" (Aplikasi Notes dari Tugas 2). Pengerjaan ini berfokus pada *deployment* aplikasi berbasis *Platform as a Service* (PaaS) menggunakan ekosistem Google Cloud Platform (GCP).

**Disusun Oleh:**
* **Nama:** Rheza Priya Anargya
* **NIM:** 123230032
* **Program Studi:** Informatika, UPN "Veteran" Yogyakarta

---

## 🏗️ Skenario Deployment & Teknologi

Proyek ini mengadopsi **Skenario 2** sesuai dengan ketentuan penugasan, yaitu memisahkan layanan menjadi dua bagian yang terisolasi:

1. **Frontend (Google App Engine)**
   * **Teknologi:** HTML5, CSS3, dan Vanilla JavaScript.
   * **Konfigurasi:** Menggunakan file `app.yaml` dengan *custom service name* (`fe-rheza-123230032`) untuk menghindari penimpaan *resource* (overwriting) di *shared project* GCP.
2. **Backend (Google Cloud Run)**
   * **Teknologi:** Node.js dengan *framework* Express.js.
   * **Konfigurasi:** Dikemas ke dalam *container* menggunakan `Dockerfile` (Base image: `node:20-alpine`) untuk memastikan *runtime* yang konsisten dan skalabilitas otomatis.
3. **Database (Google Cloud SQL)**
   * **Teknologi:** Managed MySQL.
   * **Database Target:** `notes_123230032` (Pangkalan data mandiri khusus untuk pengerjaan ini).

---

## 📂 Struktur Direktori

Repositori ini menggunakan pendekatan *Monorepo* di mana kode *frontend* dan *backend* dikelola dalam satu repositori yang sama, namun terpisah di dalam direktorinya masing-masing.

```text
APLIKASI-NOTES-TUGAS3/
│
├── backend/                  # Direktori layanan API (Cloud Run)
│   ├── .dockerignore         # Pengecualian file saat proses build image
│   ├── cloudbuild.yaml       # Pipeline CI/CD untuk Backend
│   ├── Dockerfile            # Instruksi containerization Express.js
│   ├── package.json          # Manajemen dependensi Node.js
│   └── server.js             # Logika utama server, rute API, dan koneksi DB
│
└── frontend/                 # Direktori layanan UI (App Engine)
    ├── app.yaml              # Konfigurasi deployment App Engine
    ├── cloudbuild.yaml       # Pipeline CI/CD untuk Frontend
    ├── index.html            # Struktur antarmuka pengguna
    ├── script.js             # Logika DOM dan pemanggilan API (Fetch)
    └── style.css             # Desain antarmuka

```

---

## ⚙️ Alur CI/CD (Continuous Integration & Deployment)

Proses unggah kode (*deployment*) telah diotomatisasi secara penuh menggunakan **Google Cloud Build Triggers**.

* **Trigger Frontend:** Akan tereksekusi secara otomatis setiap kali terdapat perintah `git push` yang mendeteksi perubahan pada direktori `/frontend`. Proses membaca file `cloudbuild.yaml` dan mengeksekusi perintah `gcloud app deploy`.
* **Trigger Backend:** Akan tereksekusi secara otomatis saat terdapat pembaruan di direktori `/backend`. Proses akan melakukan *build Docker image*, *push* ke Artifact Registry, dan melakukan *deploy* ke layanan Cloud Run.

---

## 🚀 Fitur Aplikasi (CRUD)

Aplikasi ini dapat melakukan manipulasi data secara *real-time* ke basis data Cloud SQL melalui REST API:

* **Create:** Menambahkan catatan harian baru dengan judul dan isi.
* **Read:** Menampilkan seluruh daftar catatan secara asinkron saat halaman dimuat.
* **Update:** Mengedit konten (judul/isi) pada catatan yang sudah ada menggunakan ID spesifik.
* **Delete:** Menghapus catatan secara permanen dari basis data.

---

## 🔗 URL Akses Layanan (Live)

*(Catatan: Silakan klik tautan di bawah ini untuk menguji aplikasi secara langsung)*

* **Frontend (App Engine):** https://fe-rheza-123230032-dot-e-44-488914.uc.r.appspot.com/
* **Backend API (Cloud Run):** [Masukkan URL backend kamu di sini, contoh: https://backend-notes-xxxxx.run.app/notes]
