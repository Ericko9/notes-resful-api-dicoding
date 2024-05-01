import './styles/styles.css';
import { NoteList } from './components/List.js';
import { FormAddNote } from './components/AddNote.js';
import { ConfirmationDialog } from './components/Dialog.js';
import { Loader } from './components/LoadAnimation.js';
import gsap from 'gsap';

class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        container.innerHTML = `
        <style>
          .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-image: linear-gradient(to right, #007bff, #0056b3);
            backdrop-filter: blur(10px);
            padding: 10px;
            color: white;
            z-index: 1000;
          }
        </style>
        <div class="navbar">
          <h1>Notes Restful API Dicoding</h1>
        </div>
      `;
        shadow.appendChild(container);
    }
}

const loader = document.createElement('app-spinner');
document.body.appendChild(loader);
document.addEventListener('DOMContentLoaded', async () => {
    customElements.define('note-list', NoteList);
    customElements.define('custom-navbar', CustomNavbar);

    loader.show(5000);
    try {
        const [archivedResponse, unarchivedResponse] = await Promise.all([
            fetch('https://notes-api.dicoding.dev/v2/notes/archived'),
            fetch('https://notes-api.dicoding.dev/v2/notes'),
        ]);

        if (!archivedResponse.ok || !unarchivedResponse.ok) {
            throw new Error('Failed to fetch notes');
        }

        const archivedData = await archivedResponse.json();
        const unarchivedData = await unarchivedResponse.json();

        const allNotesData = [...archivedData.data, ...unarchivedData.data];

        const noteList = document.querySelector('note-list');
        noteList.notes = allNotesData;

        let eventListenerAdded = false;
        const formAddNote = document.querySelector('form-add-note');
        if (!eventListenerAdded) {
            formAddNote.addEventListener('noteAdded', async (event) => {
                try {
                    const newNote = event.detail;

                    if (newNote.archived) {
                        archivedData.data.push(newNote);
                    } else {
                        unarchivedData.data.push(newNote);
                    }
                    const [archivedResponse, unarchivedResponse] =
                        await Promise.all([
                            fetch(
                                'https://notes-api.dicoding.dev/v2/notes/archived',
                            ),
                            fetch('https://notes-api.dicoding.dev/v2/notes'),
                        ]);

                    if (!archivedResponse.ok || !unarchivedResponse.ok) {
                        throw new Error('Failed to fetch notes from API');
                    }

                    const rearchivedData = await archivedResponse.json();
                    const reunarchivedData = await unarchivedResponse.json();

                    noteList.notes = [
                        ...rearchivedData.data,
                        ...reunarchivedData.data,
                    ];
                } catch (error) {
                    console.error('Error updating notes:', error.message);
                }
            });
            eventListenerAdded = true;
        }
    } catch (error) {
        console.error('Error fetching notes:', error.message);
    }
});
