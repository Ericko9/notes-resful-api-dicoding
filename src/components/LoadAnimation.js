class Loader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.progress = 0;
        this.totalSteps = 100;
        this.animationDuration = 0;
        this.interval = 0;

        const container = document.createElement('div');
        container.setAttribute('id', 'spinner-container');
        
        const progressBar = document.createElement('div');
        progressBar.setAttribute('id', 'progress-bar');

        const title = document.createElement('div');
        title.setAttribute('id', 'progress-title');

        const progress = document.createElement('div');
        progress.setAttribute('id', 'progress');

        const style = document.createElement('style');
        container.innerHTML = `
        <style>
        body {
            background: #000;
        }
        
        #spinner-container {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #load {
            position: absolute;
            width: 600px;
            height: 36px;
            left: 50%;
            top: 40%;
            margin-left: -300px;
            overflow: visible;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            cursor: default;
        }
        
        #load div {
            position: absolute;
            width: 40px; /* ukuran huruf diperbesar dua kali lipat */
            height: 36px;
            opacity: 0;
            font-family: Helvetica, Arial, sans-serif;
            animation: move 2s linear infinite;
            -o-animation: move 2s linear infinite;
            -moz-animation: move 2s linear infinite;
            -webkit-animation: move 2s linear infinite;
            transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            color: #35c4f0;
        }
        
        #load div:nth-child(2) {
            animation-delay: 0.2s;
            -o-animation-delay: 0.2s;
            -moz-animation-delay: 0.2s;
            -webkit-animation-delay: 0.2s;
        }
        #load div:nth-child(3) {
            animation-delay: 0.4s;
            -o-animation-delay: 0.4s;
            -webkit-animation-delay: 0.4s;
            -webkit-animation-delay: 0.4s;
        }
        #load div:nth-child(4) {
            animation-delay: 0.6s;
            -o-animation-delay: 0.6s;
            -moz-animation-delay: 0.6s;
            -webkit-animation-delay: 0.6s;
        }
        #load div:nth-child(5) {
            animation-delay: 0.8s;
            -o-animation-delay: 0.8s;
            -moz-animation-delay: 0.8s;
            -webkit-animation-delay: 0.8s;
        }
        #load div:nth-child(6) {
            animation-delay: 1s;
            -o-animation-delay: 1s;
            -moz-animation-delay: 1s;
            -webkit-animation-delay: 1s;
        }
        #load div:nth-child(7) {
            animation-delay: 1.2s;
            -o-animation-delay: 1.2s;
            -moz-animation-delay: 1.2s;
            -webkit-animation-delay: 1.2s;
        }
        
        @keyframes move {
            0% {
                left: 0;
                opacity: 0;
            }
            35% {
                left: 41%;
                -moz-transform: rotate(0deg);
                -webkit-transform: rotate(0deg);
                -o-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            65% {
                left: 59%;
                -moz-transform: rotate(0deg);
                -webkit-transform: rotate(0deg);
                -o-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            100% {
                left: 100%;
                -moz-transform: rotate(-180deg);
                -webkit-transform: rotate(-180deg);
                -o-transform: rotate(-180deg);
                transform: rotate(-180deg);
                opacity: 0;
            }
        }
        
        @-moz-keyframes move {
            0% {
                left: 0;
                opacity: 0;
            }
            35% {
                left: 41%;
                -moz-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            65% {
                left: 59%;
                -moz-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            100% {
                left: 100%;
                -moz-transform: rotate(-180deg);
                transform: rotate(-180deg);
                opacity: 0;
            }
        }
        
        @-webkit-keyframes move {
            0% {
                left: 0;
                opacity: 0;
            }
            35% {
                left: 41%;
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            65% {
                left: 59%;
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            100% {
                left: 100%;
                -webkit-transform: rotate(-180deg);
                transform: rotate(-180deg);
                opacity: 0;
            }
        }
        
        @-o-keyframes move {
            0% {
                left: 0;
                opacity: 0;
            }
            35% {
                left: 41%;
                -o-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            65% {
                left: 59%;
                -o-transform: rotate(0deg);
                transform: rotate(0deg);
                opacity: 1;
            }
            100% {
                left: 100%;
                -o-transform: rotate(-180deg);
                transform: rotate(-180deg);
                opacity: 0;
            }
        }
        </style>
        <div class="spinner">
            <div id="load">
                <div>G</div>
                <div>N</div>
                <div>I</div>
                <div>D</div>
                <div>A</div>
                <div>O</div>
                <div>L</div>
            </div>
        </div>
        
        `;

        progressBar.appendChild(title);
        progressBar.appendChild(progress);

        container.appendChild(progressBar);
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }

    show(duration) {
        this.shadowRoot.querySelector('#spinner-container').style.display =
            'block';
        this.animationDuration = duration;
        this.interval = this.animationDuration / this.totalSteps;
        this.animateProgress();
    }

    hide() {
        this.shadowRoot.querySelector('#spinner-container').style.display =
            'none';
    }

    animateProgress() {
        const progressElement = this.shadowRoot.querySelector('#progress');
        const incrementProgress = () => {
            if (this.progress < this.totalSteps) {
                this.progress++;
                progressElement.style.width = `${(this.progress / this.totalSteps) * 100}%`;
                setTimeout(incrementProgress, this.interval);
            } else {
                this.progress = 0;
                progressElement.style.width = '0';
                this.hide();
            }
        };
        incrementProgress();
    }
}

customElements.define('app-spinner', Loader);
