const { doc } = require("prettier");

const CONTAINER = document.querySelector('.container'),
    N = CONTAINER.children.length, NumberFrames = 30; //число кадров за которое выполняется анимация

let i = 0, // текущий слайд
    x0 = null, //координата начала клика
    locked = false, //
    widthView, // ширина включая прокрутку
    initialPosition, // начальное значение в начале анимации для --i
    finalPosition, // финальное значение в конце анимации, целочисленное для перехода на след слайд
    ridTransition = null, 
    actualNumberFrame , //фактическое кол-во кадров.
    n; //число слайдов

function stopAnimation() {
    cancelAnimationFrame(ridTransition);
    ridTransition = null;
};

function animationFrame(currentFrame = 0) { //cf индекс текущего кадра. ф-ция анимации
    const prevI = i; 
    const nextI = initialPosition + (finalPosition - initialPosition)*(currentFrame/actualNumberFrame);

    CONTAINER.style.setProperty('--i', nextI || prevI); //по сути анимация просто отрисовывает в зависимости от слайда.

    if(currentFrame === actualNumberFrame) { //если текущий кадр равен фактическому т.е. коннечному то анимация не нужна, остановка анимации.
        stopAnimation();
        return;
    }

    ridTransition = requestAnimationFrame(animationFrame.bind(this, ++currentFrame))
};

function unify(e) { //унифицируем клик и touch
    return e.changedTouches ? e.changedTouches[0] : e 
};

function lock(e) { // блокировка на touchstart или mousedown получением и сохранением оси х в исходной переменной х0 
    x0 = unify(e).clientX;
    locked = true;
};

function drag(e) { //ф-ция перетаскивания
    e.preventDefault();

    if(e.target !== e.currentTarget) {
        return;
    }

    if(locked) {
        let dx = unify(e).clientX - x0, f = +(dx/widthView).toFixed(2);
        CONTAINER.style.setProperty('--i', i - f); //отрисовка контейнера по номеру слайда i. Если целичисленное переход на след. Если меньше 0.2 след слайд не отрисовывать.
    }

};

function move(e) { //для перемещения контейнера проверка на выполнение блокировки. В таком случае вычисляем разницу между текущей координатой х и х0.
    if(locked) {
        let dx = unify(e).clientX - x0, //dx differenceX - разница между положениями координаты х.  
            s = Math.sign(dx),
            f = +(s*dx/widthView).toFixed(2);

        initialPosition = i - s*f;

        if((i > 0 || s < 0) && (i < N - 1 || s > 0) && f > .2) { //если есть след слайд в нужном направлении то достаточно перетащить f на 0,2 для перехода.
            i -= s; // i индекс текущего значения
            f = 1 - f; // f относительное расстояние для него
        }

        finalPosition = i;
        actualNumberFrame = Math.round(f*NumberFrames);
        n = 2 + Math.round(f);
        animationFrame();
        x0 = null;
        locked = false;
    }
};

function size() { widthView = window.innerWidth };

function moveTo(_i) {
    i = _i;
    CONTAINER.style.setProperty('--i', _i);
}

const header = document.querySelector('header');
header.addEventListener('click', () => {
    moveTo(0);
});

const btnSwipe1 = document.querySelector('button');
btnSwipe1.addEventListener('click', () => {
    moveTo(1);
    
});

size();
CONTAINER.style.setProperty('--n', N);

addEventListener('resize', size, false);

CONTAINER.addEventListener('mousedown', lock, false);
CONTAINER.addEventListener('touchstart', lock, false);

CONTAINER.addEventListener('mousemove', drag, false);
CONTAINER.addEventListener('touchmove', drag, false);

CONTAINER.addEventListener('mouseup', move, false);
CONTAINER.addEventListener('touchend', move, false);


// скролл через div
const trackEl = document.querySelector('.track');
        const barEl = document.querySelector('.bar');
        const contentEl = document.querySelector('.content');
        const wrapperEl = document.querySelector('.swipe2-wrapper');
        const contentScrollableEl = document.querySelector('.content-scrollable');

        const contentHeight = contentEl.getBoundingClientRect().height;
        const contentScrollableHeight = contentScrollableEl.getBoundingClientRect().height;
        const offsetMax = wrapperEl.getBoundingClientRect().height - barEl.getBoundingClientRect().height;
        const trackElTop = trackEl.getBoundingClientRect().top;

        function setBarOffset(offset) { //отступ бар с учетом мин и макс
            if (offset < 0) offset = 0;
            if (offset > offsetMax) offset = offsetMax;
            barEl.style.top = `${offset}px`;
        }

        function handleMouseDown(e) { //подписываемся на событие перетаскивания и отпускания мышки
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchDrag);
            document.addEventListener('touchend', handleMouseUp);
        }

        function handleDrag(e) {
            e.preventDefault();
            const offset = e.pageY - trackElTop;
            setBarOffset(offset);
            const dragPerc = offset / offsetMax;
            const scrollPos = dragPerc * (contentHeight - contentScrollableHeight);
            contentScrollableEl.scrollTop = scrollPos;
        }

        function handleMouseUp(e) {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchDrag);
            document.removeEventListener('touchend', handleMouseUp);
            
        }

        function handleScroll(e) {
            const scrollPos = contentScrollableEl.scrollTop = contentScrollableEl.scrollTop + e.deltaY;
            const dragPerc = scrollPos / (contentHeight - contentScrollableHeight);
            const offset = dragPerc * offsetMax;
            setBarOffset(offset);
        }

        function handleTouchDrag(e) {
            const offset = e.changedTouches[0].pageY - trackElTop;
            setBarOffset(offset);
            const dragPerc = offset / offsetMax;
            const scrollPos = dragPerc * (contentHeight - contentScrollableHeight);
            contentScrollableEl.scrollTop = scrollPos;
        }

        barEl.addEventListener('mousedown', handleMouseDown);
        barEl.addEventListener('touchstart', handleMouseDown);
        contentScrollableEl.addEventListener('wheel', handleScroll);
        contentScrollableEl.addEventListener('touchmove', handleScroll);
//

let modal = document.getElementById("myModal");
let btn = document.getElementById("myBtn");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

const prev = document.querySelector('.prev');
prev.addEventListener('click', () => {
    plusSlides(-1);
});

const next = document.querySelector('.next');
next.addEventListener('click', () => {
    plusSlides(1);
});

const dot1 = document.querySelector('.dot-first');
dot1.addEventListener('click', () => {
    currentSlide(1);
});

const dot2 = document.querySelector('.dot-second');
dot2.addEventListener('click', () => {
    currentSlide(2);
});