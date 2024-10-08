const state = {
    views: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        lives: document.querySelector('#lives'),
        popup: document.querySelectorAll('[id^="popup"]')
    },
    values: {
        gameVelocity: 1000,
        result: 0,
        currentTime: 0,
        lives: 0,
        randomNumber: 0
    },
    actions: {
        timerId: null,
        countDowwnTimerId: null
    },
    audios: {
        hit: new Audio('src/audio/hit.mp3'),
        error: new Audio('src/audio/error.mp3')
    }
};
function playGame() {
    state.values.result = 0;
    state.values.currentTime = 60;
    state.values.lives = 3;
    state.actions.countDowwnTimerId = setInterval(countDown, 1000);
    setPopup();
    initialize();
}
function playSound(name) {
    state.audios[name].currentTime = 0;
    state.audios[name].play();
}
function countDown() {
    state.views.timeLeft.textContent = (--state.values.currentTime);
    checkStatus();
}
function checkStatus() {
    if(state.values.currentTime <= 0 || state.values.lives <= 0) {
        clearInterval(state.actions.countDowwnTimerId);
        clearInterval(state.actions.timerId);
        let title = '', titleColor = '';
        if(state.values.currentTime <= 0 && state.values.lives > 0 && state.values.result > 0) {
            title = 'You Winer';
            titleColor = '#00b100';
        } else {
            title = 'Game Over';
            titleColor = '#ff0000';
        }
        setPopup('flex', title, titleColor, 'Play Again');
    }
}
function setPopup(display='none', title='Wreck-It Ralph', titleColor='#ff0000', btnName='Play') {
    state.views.popup[0].style.display = display;
    state.views.popup[1].textContent = title;
    state.views.popup[1].style.color = titleColor;
    state.views.popup[2].textContent = btnName;
}
function randomSquare() {
    state.views.squares[state.values.randomNumber].classList.remove('enemy');
    let randomView = state.views.squares[(state.values.randomNumber = Math.floor(Math.random() * 9))];
    randomView.classList.add('enemy');
}
function moveEnemy() {
    clearInterval(state.actions.timerId);
    randomSquare();
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}
function initialize() {
    state.views.timeLeft.textContent = state.values.currentTime;
    state.views.lives.textContent = 'x' + state.values.lives;
    state.views.score.textContent = state.values.result;
    moveEnemy();
}
state.views.squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if(square.classList.contains('enemy')) {
            playSound('hit');
            state.views.score.textContent = ++state.values.result;
            moveEnemy();
        } else {
            playSound('error');
            state.views.lives.textContent = 'x' + (--state.values.lives);
        }
        checkStatus();
    });
});
state.views.popup[2].onclick = playGame;