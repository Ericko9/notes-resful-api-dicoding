export class ConfirmationDialog extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <style>
            .dialog-konvirmasi {
                background-color: #e3f2fd;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                width: 300px;
                margin: auto;
            }
            .tombol-setuju, .tombol-batal {
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                transition-duration: 0.4s;
                cursor: pointer;
                border-radius: 5px;
            }
            .tombol-setuju {
                background-color: #007bff;
            }
            .tombol-setuju:hover {
                background-color: #0056b3;
            }
            .tombol-batal {
                background-color: #6c757d;
            }
            .tombol-batal:hover {
                background-color: #5a6268;
            }
          </style>
          <div class="dialog-konfirmasi">
              <p>Apakah Anda yakin menghapus note ini?</p>
              <button class="tombol-setuju">Yakin</button>
              <button class="tombol-batal">Batal</button>
          </div>
      `;
        this.querySelector('.tombol-setuju').addEventListener(
            'click',
            this.tandaiSetuju.bind(this),
        );
        this.querySelector('.tombol-batal').addEventListener(
            'click',
            this.tandaiBatal.bind(this),
        );
    }

    tandaiSetuju() {
        this.dispatchEvent(new CustomEvent('setujui'));
    }

    tandaiBatal() {
        this.dispatchEvent(new CustomEvent('batalkan'));
    }
}

customElements.define('dialog-konfirmasi', ConfirmationDialog);
