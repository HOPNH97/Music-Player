/**
 * 1. render songs =
 * 2. scroll top =
 * 3. play/pause/sick =
 * 4. CD rotate =
 * 5. Next/prev =
 * 6. Random =
 * 7. Next / repeat when ended =
 * 8. Active song =
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'HOP_NH';

const player = $('.player');
const cd = $('.cd');
const heading = $('.heading');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
// const pauseBtn = $('.btn-toggle-play i:nth-child(2)');
const progress = $('.progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Marry You',
            singer: 'Bruno Mars',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg',
        },
        {
            name: 'Bật Tình Yêu Lên',
            singer: 'Tăng Duy Tân, Hòa Minzy',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg',
        },
        {
            name: 'Let Me Love You',
            singer: 'DJ Snake, Justin Bieber',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg',
        },

        {
            name: 'Nơi Tình Yêu Bắt Đầu',
            singer: 'Lam Anh, Bằng Kiều',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg',
        },
        {
            name: 'Cơn Mơ Băng Giá',
            singer: 'Bằng Kiều',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg',
        },
        {
            name: 'Ngày Mai Người Ta Lấy Chồng',
            singer: 'Thành Đạt',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg',
        },
        {
            name: 'See Tình',
            singer: 'Hoang Thuy Linh',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg',
        },
        {
            name: 'Cảm Ơn Vì Tất Cả',
            singer: 'Anh Quân Idol',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg',
        },
        {
            name: 'Anh Mệt Rồi',
            singer: 'Anh Quân Idol',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg',
        },
        {
            name: 'Hoa Cỏ Lau',
            singer: 'Phong Max',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg',
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg',
        },
        {
            name: 'Sumertime',
            singer: 'K-391',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.jpg',
        },
    ],

    render: function () {
        var htmls = this.songs.map((song, index) => {
            return `    
        <div class="song ${
            index === this.currentIndex ? 'active' : ''
        }" data-index="${index}">
        <div class="thumb" 
            style="background-image: url('${song.image}')"></div>   
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fa-solid fa-ellipsis"></i>
        </div>
        </div>`;
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        // xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: 'rotate(360deg)',
                },
            ],
            {
                duration: 10000, //10s
                interations: Infinity,
            }
        );
        cdThumbAnimate.pause();
        // xử lí thu phóng to thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            var scrollTop =
                window.screenY || document.documentElement.scrollTop;
            var newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // lắng nghe khi play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        // lắng nghe khi pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        // khi vị trí thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };
        // lắng nghe khi tua
        progress.oninput = function (e) {
            const seekChange = (audio.duration * e.target.value) / 100;
            audio.currentTime = seekChange;
        };
        // lắng nghe khi nhấn next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // lắng nghe khi nhấn prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // lắng nghe bật tắt nút random . e.target: bấm chúng icon sẽ lỗi
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };
        //lắng nghe khi kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                //thực hiện sự kiện click thay vì ng dùng nhấp chuột
                nextBtn.click();
            }
        };
        //lắng nghe bật tắt btn repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };
        //lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index); //songNode.getAttribute('data-index')
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                if (e.target.closest('.option')) {
                }
            }
        };
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

        // Object.assign(this, this.config);
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        var view = '';
        if (this.currentIndex < 4) {
            view = 'end';
        } else {
            view = 'center';
        }
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: view,
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function () {
        // gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // định nghĩa thuộc tính cho object
        this.defineProperties();
        // lắng nghe / xử lí các sự kiện events (DOM event)
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // render playlist
        this.render();
        //hiển thị trạng thái ban đầu của ...
        repeatBtn.classList.toggle('active', this.isRepeat);
        randomBtn.classList.toggle('active', this.randomBtn);
    },
};

app.start();
