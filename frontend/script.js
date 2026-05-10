// Sesuaikan dengan port backend yang sudah kita ubah tadi
const API_URL = 'http://localhost:3001/notes';

const noteForm = document.getElementById('noteForm');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const noteIdInput = document.getElementById('noteId');
const notesList = document.getElementById('notesList');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Fungsi GET: Ambil dan tampilkan catatan
async function fetchNotes() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();
        
        notesList.innerHTML = ''; // Kosongkan list sebelum render ulang
        
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            
            // Format tanggal
            const tgl = new Date(note.tanggal_dibuat).toLocaleString('id-ID');
            
            noteDiv.innerHTML = `
                <h3>${note.judul}</h3>
                <small>${tgl}</small>
                <p>${note.isi}</p>
                <div>
                    <button class="btn-edit" onclick="editNote(${note.id}, '${note.judul}', '${note.isi.replace(/\n/g, '\\n')}')">Edit</button>
                    <button class="btn-delete" onclick="deleteNote(${note.id})">Hapus</button>
                </div>
            `;
            notesList.appendChild(noteDiv);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Fungsi POST / PUT: Tambah atau Update catatan
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Cegah halaman reload
    
    const id = noteIdInput.value;
    const judul = judulInput.value;
    const isi = isiInput.value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
        
        resetForm();
        fetchNotes(); // Render ulang daftar
    } catch (error) {
        console.error('Error saving note:', error);
    }
});

// Fungsi siapkan form untuk Edit
function editNote(id, judul, isi) {
    noteIdInput.value = id;
    judulInput.value = judul;
    isiInput.value = isi;
    
    saveBtn.textContent = 'Update Catatan';
    cancelBtn.style.display = 'block';
}

// Fungsi batal edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
    noteIdInput.value = '';
    judulInput.value = '';
    isiInput.value = '';
    saveBtn.textContent = 'Simpan Catatan';
    cancelBtn.style.display = 'none';
}

// Fungsi DELETE: Hapus catatan
async function deleteNote(id) {
    if (confirm('Apakah kamu yakin ingin menghapus catatan ini?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchNotes(); // Render ulang daftar setelah dihapus
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }
}

// Load data pertama kali saat halaman dibuka
fetchNotes();