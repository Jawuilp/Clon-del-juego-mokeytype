import { words as INITIAL_WORDS} from './data.js'

// utilidades para eventos
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const $time = $('time');
const $paragraph = $('p');
const $input = $('input');
const $button = $('#reload-button');
const $results = $('#results');
const $game = $('#game');
const $wpm = $('#results-wpm');
const $accurracy = $('#results-accurracy');




const  INITIAL_TIME = 60;

let words = [];
let currentTime = INITIAL_TIME;



initGame();
initEvents();

function initGame () {

    $game.style.display = 'flex'
    $results.style.display = 'none'
    $input.value = '';
    
    words = INITIAL_WORDS.toSorted(
        () => Math.random() - 0.5
    ).slice(0,32)
    currentTime = INITIAL_TIME;
    $time.textContent = currentTime;
    $paragraph.innerHTML = words.map((word,index)=>{

        const letters = word.split('');

        return `<word>
            ${letters
                .map(letter => `<letter>${letter}</letter>`)
                .join('')
            }
        </word>`
    }).join('');

   const $firstWord = $paragraph.querySelector('word');
    $firstWord.classList.add('active');
    $firstWord.querySelector('letter').classList.add('active')

    const intervalId = setInterval(()=>{
        currentTime--;
        $time.textContent = currentTime;
        if(currentTime === 0) {
            clearInterval(intervalId);
           //alert('Has terminado el tiempo');
            gameOver()
        }
    },1000)
}
function initEvents () {
    document.addEventListener('keydown',(e)=>{
       // console.log(e)
        $input.focus()
    });
    $input.addEventListener('keydown',onKeyDown);
    $input.addEventListener('keyup',onKeyUp);
    $button.addEventListener('click', initGame)
};

function onKeyDown (e) {
        // Recuperamos los elementos actuales
        const $activeWord = $paragraph.querySelector('word.active');
        const $activeLetter = $activeWord.querySelector('letter.active');
    
    const { key  } = e;
    console.log(key);

    if(key === ' ') {
        e.preventDefault();
        const $nextWord = $activeWord.nextElementSibling;
        const $nextLetter = $nextWord.querySelector('letter');

        $activeWord.classList.remove('active');
        $activeLetter.classList.remove('active');

        $nextWord.classList.add('active');
        $nextLetter.classList.add('active');

        $input.value = '';

    const hassMissedLetters = $activeWord.querySelectorAll('letter:not(.correcto)').length > 0;
    const classToAdd = hassMissedLetters ? 'marked' : 'correcto';
    $activeWord.classList.add(classToAdd) 


    }

    if (key === 'Backspace') {
        const $prevWord = $activeWord.previousElementSibling
        const $prevLetter = $activeLetter.previousElementSibling
  
        if (!$prevWord && !$prevLetter) {
          event.preventDefault()
          return
        }
  
        const $wordMarked = $paragraph.querySelector('word.marked')
        if ($wordMarked && !$prevLetter) {
          event.preventDefault()
          $prevWord.classList.remove('marked')
          $prevWord.classList.add('active')
  
          const $letterToGo = $prevWord.querySelector('letter:last-child')
  
          $activeLetter.classList.remove('active')
          $letterToGo.classList.add('active')
  
          $input.value = [
            ...$prevWord.querySelectorAll('letter.correct, letter.incorrect')
          ].map($el => {
            return $el.classList.contains('correct') ? $el.innerText : '*'
          })
            .join('')
        }
      }
};

//

function onKeyUp() {
    // Recuperamos los elementos actuales
    const $activeWord = $paragraph.querySelector('word.active');
    const $activeLetter = $activeWord.querySelector('letter.active');
    
    const currentWord = $activeWord.innerText.trim();
    $input.maxLength = currentWord.length;

    // Obtenemos todas las letras de la palabra activa
    const $allLetters = $activeWord.querySelectorAll('letter');

    // Limpiamos las clases previas
    $allLetters.forEach(letter => {
        letter.classList.remove('correcto', 'incorrecto', 'active','is-land');
    });

    // Verificamos cada letra ingresada
    $input.value.split('').forEach((char, index) => {
        const $letter = $allLetters[index];
        const letterToCheck = currentWord[index];

        // Si la letra es correcta, añadimos la clase correcto
        const isCorrect = char === letterToCheck;
        const letterClass = isCorrect ? 'correcto' : 'incorrecto';
        $letter.classList.add(letterClass);
    });

    // Activar la siguiente letra
    const nextIndex = $input.value.length;
    console.log(nextIndex);
   
     if (nextIndex < $allLetters.length) {
        $allLetters[nextIndex].classList.add('active');
     } else {
        $activeLetter.classList.add('active','is-land')
     }
 
}


function gameOver() {
    $game.style.display = 'none'
    $results.style.display = 'flex'

    const correctWords = $paragraph.querySelectorAll('word.correct').length
    const correctLetter = $paragraph.querySelectorAll('letter.correct').length
    const incorrectLetter = $paragraph.querySelectorAll('letter.incorrect').length

    const totalLetters = correctLetter + incorrectLetter

    const accuracy = totalLetters > 0
      ? (correctLetter / totalLetters) * 100
      : 0

    const wpm = correctWords * 60 / INITIAL_TIME
    $wpm.textContent = wpm
    $accurracy.textContent = `${accuracy.toFixed(2)}%`
  }
// otro ejemplo 

// function onKeyUp () {
//     // recuperamos los elementos actuales
//     const $activeWord = $paragraph.querySelector('word.active');
//     const $activeLetter = $activeWord.querySelector('letter.active');
    
//    const currendWord = $activeWord.innerText.trim();
//    $input.maxLength = currendWord.length

//    const $allLetters = $activeWord.querySelectorAll('letter');
//     $allLetters.forEach(letter=>{ letter.classList.remove('correcto','incorrecto')});

//     $input.value.split('').forEach((char,index)=>{
//         const $letter = $allLetters[index];
//         const letterToCheck = currendWord[index];

//       const isCorrect = char === letterToCheck
//       const letterClass = isCorrect ? 'correcto' : 'incorrecto';
//       $letter.classList.add(letterClass);
//     })
// };
