import Swal from 'sweetalert2';

export class FormAddNote extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <style>
        .form-add-note {
            background-color: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        input, textarea {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            width: calc(100% - 22px);
        }
        button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
        .error-message {
            color: red;
            font-size: 0.8em;
        }
      </style>
      <form class="form-add-note">
        <input id="titleInput" type="text" placeholder="Beri Judul" required>
        <div id="titleError" class="error-message"></div>
        <textarea id="bodyInput" placeholder="Isi Catatan" required></textarea>
        <div id="bodyError" class="error-message"></div>
        <button type="submit">Tambahkan Notes</button>
      </form>
    `;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = this.querySelector('form');
        form.addEventListener('submit', this.onSubmit.bind(this));
    }

    async onSubmit(event) {
        event.preventDefault();

        const titleInput = this.querySelector('#titleInput');
        const bodyInput = this.querySelector('#bodyInput');
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();

        try {
            const response = await fetch(
                'https://notes-api.dicoding.dev/v2/notes',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, body }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to create note');
            }

            const newNoteResponse = await response.json();
            const newNote = newNoteResponse.data;

            this.dispatchEvent(
                new CustomEvent('noteAdded', { detail: newNote }),
            );

            console.log('New note added:', newNote);

            Swal.fire({
                icon: 'success',
                title: 'Note berhasil dibuat',
                text: 'Note berhasil dibuat🫶',
            });

            titleInput.value = '';
            bodyInput.value = '';

            this.fetchNotesFromAPI();
        } catch (error) {
            console.error('Error creating note:', error);
        }
    }

    async fetchNotesFromAPI() {
        try {
            const [archivedResponse, unarchivedResponse] = await Promise.all([
                fetch('https://notes-api.dicoding.dev/v2/notes/archived'),
                fetch('https://notes-api.dicoding.dev/v2/notes'),
            ]);

            if (!archivedResponse.ok || !unarchivedResponse.ok) {
                throw new Error('Failed to fetch notes from API');
            }

            const archivedData = await archivedResponse.json();
            const unarchivedData = await unarchivedResponse.json();

            const allNotesData = [...archivedData.data, ...unarchivedData.data];

            this.dispatchEvent(
                new CustomEvent('notesFetched', { detail: allNotesData }),
            );
        } catch (error) {
            console.error('Error fetching notes from API:', error.message);
        }
    }
}

customElements.define('form-add-note', FormAddNote);
