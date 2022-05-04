const { doc } = require("prettier");

const _C = document.querySelector('.container'),
    N = _C.children.length, NF = 30;
    TFN = {/*
        'linear': function(k) { return k },
        'ease-in': function(k, e = 1.675) {
            return Math.pow(k, e)
        },
        'ease-out': function(k, e = 1.675) {
            return 1 - Math.pow(1-k, e)
        },
        'ease-in-out': function(k) {
			return .5*(Math.sin((k - .5)*Math.PI) + 1)
		}*/
        'bounce-out': function(k, a = 2.75, b = 1.5) {
            return 1 - Math.pow(1 - k, a)*Math.abs(Math.cos(Math.pow(k, b)*(n + .5)*Math.PI))
        }
    }

let i = 0, x0 = null, locked = false, w, ini, fin, rID = null, anf ,n;

function stopAni() {
    cancelAnimationFrame(rID);
    rID = null;
};

function ani(cf = 0) {
    const prevI = i;
    const nextI = ini + (fin - ini)*TFN['bounce-out'](cf/anf);

    _C.style.setProperty('--i', nextI || prevI);

    if(cf === anf) {
        stopAni();
        return;
    }

    rID = requestAnimationFrame(ani.bind(this, ++cf))
};

function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e 
};

function lock(e) { 
    x0 = unify(e).clientX;
    locked = true;
};

function drag(e) {
    e.preventDefault();

    if(e.target !== e.currentTarget) {
        return;
    }

    if(locked) {
        let dx = unify(e).clientX - x0, f = +(dx/w).toFixed(2);
        _C.style.setProperty('--i', i - f);
    }

};

function move(e) {
    if(locked) {
        let dx = unify(e).clientX - x0,
            s = Math.sign(dx),
            f = +(s*dx/w).toFixed(2);

        ini = i - s*f;

        if((i > 0 || s < 0) && (i < N - 1 || s > 0) && f > .2) {
            i -= s;
            f = 1 - f;
        }

        fin = i;
        anf = Math.round(f*NF);
        n = 2 + Math.round(f);
        ani();
        x0 = null;
        locked = false;
    }
};

function size() { w = window.innerWidth };

function moveTo(_i) {
    i = _i;
    _C.style.setProperty('--i', _i);
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
_C.style.setProperty('--n', N);


const input = document.querySelector("input");

input.addEventListener("change", event => {
    console.log(event);
    const inputTargVal = event.target.value;
    document.querySelector('.content').style.transform = `translateY(-${inputTargVal}%)`;
});

addEventListener('resize', size, false);

_C.addEventListener('mousedown', lock, false);
_C.addEventListener('touchstart', lock, false);

_C.addEventListener('mousemove', drag, false);
_C.addEventListener('touchmove', drag, false);

_C.addEventListener('mouseup', move, false);
_C.addEventListener('touchend', move, false);



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