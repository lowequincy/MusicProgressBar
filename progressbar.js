'use strict';

let flag = false;
/**
 * @type {HTMLAudioElement}
 */
let play = document.getElementById('play');
play.onseeked = function () {
    start();
}

let progress = document.getElementById('progress'),
    progressBar = document.getElementById('ProgressBar'),
    control = document.getElementById('Control'),
    progressmodel = document.getElementById('progressmodel');

function start() {
    let animationFrameHandle = 0;
    if (flag) {
        flag = false;
        play.pause();
    } else {
        flag = true;
        function action() {
            // http://www.zhangxinxu.com/wordpress/2013/09/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3css3-gradient%E6%96%9C%E5%90%91%E7%BA%BF%E6%80%A7%E6%B8%90%E5%8F%98/
            let deg = Math.floor((play.currentTime / play.duration) * 360);
            let percent = Math.floor((play.currentTime / play.duration) * 100);
            progressBar.style.backgroundImage = `linear-gradient(90deg, red ${percent}%, orange ${percent}%)`;
            control.style.left = Math.floor(progressBar.offsetWidth * (play.currentTime / play.duration)) - 6 + 'px';
            if (deg <= 180) {
                progress.style.backgroundImage = `linear-gradient(${90 - deg}deg, #ddd 50%, transparent 50%), linear-gradient(90deg, #028cd5 50%, #ddd 50%)`;
            } else {
                progress.style.backgroundImage = `linear-gradient(90deg, #028cd5 50%, transparent 50%), linear-gradient(${90 - (deg - 180)}deg, #028cd5 50%, #ddd 50%)`;
            }
            console.log(deg);
            animationFrameHandle = requestAnimationFrame(action);
            if (deg >= 360 || !flag) {
                cancelAnimationFrame(animationFrameHandle);
            }
        }
        action();

        play.play();
    }
}

let mouseDown = false;
control.addEventListener('mousedown', (event) => {
    console.log(event.pageX, control.offset);
    mouseDown = true;
    event.cancelBubble = true;
    event.stopPropagation();
});

control.addEventListener('mouseup', () => {
    mouseDown = false;
});

progressmodel.addEventListener('mousemove', (event) => {
    if(!mouseDown) {
        return;
    }

    let offsetLeft = event.pageX - progressmodel.offsetLeft - 6;
    let percent = Math.floor(((offsetLeft + 6) / progressBar.offsetWidth) * 100);
    play.currentTime = ((offsetLeft + 6) / progressBar.offsetWidth) * play.duration;
    progressBar.style.backgroundImage = `linear-gradient(90deg, red ${percent}%, orange ${percent}%)`;
    control.style.left = offsetLeft + 'px';
});

progressBar.addEventListener('click', (event) => {
    let offsetLeft = event.pageX - progressmodel.offsetLeft - 6;
    let clientRect = control.getBoundingClientRect();
    let percent = Math.floor(((offsetLeft + 6) / progressBar.offsetWidth) * 100);
    play.currentTime = ((offsetLeft + 6) / progressBar.offsetWidth) * play.duration;
    progressBar.style.backgroundImage = `linear-gradient(90deg, red ${percent}%, orange ${percent}%)`;
    control.style.left = offsetLeft + 'px';
});
