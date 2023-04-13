let currentGuessId = 0;
let currentTile = 0;
let pressedKeys = [];

const tiles = document.querySelector('.game');
let display = document.querySelector('.message');

let keyboard = document.querySelector('.keyboard');

const rows = 6;
const columns = 5;
const my2DArray = Array.from({ length: rows }, () => new Array(columns));


let guessTiles = document.querySelectorAll(`#guessrow-${currentGuessId} .guess_tile`);

const letters = [
    'Q', 'W', 'E', 'R', 'T', 'Y',
    'U', 'I', 'O', 'P', 'A', 'S',
    'D', 'F', 'G', 'H', 'J', 'K',
    'L', 'ENTER', 'Z', 'X', 'C', 'V',
    'B', 'N', 'M', '«'
];



my2DArray.forEach((row, rowIndex) => {
    const guessRow = document.createElement('div');
    guessRow.setAttribute('id', `guessrow-${rowIndex}`);
    guessRow.classList.add('guess');

    Array.from({ length: 5 }).forEach((_, columnIndex) => {
        const guessTile = document.createElement('div');
        guessTile.setAttribute('id', `guess${rowIndex}-tile-${columnIndex}`);
        guessTile.classList.add('guess_tile');
        guessRow.appendChild(guessTile);
        my2DArray[rowIndex][columnIndex] = guessTile;
    });

    tiles.appendChild(guessRow);
});


function handleInput(letter) {

    console.log(`handleinput`);
    guessTiles = document.querySelectorAll(`#guessrow-${currentGuessId} .guess_tile`);

    if (currentTile < my2DArray[currentGuessId].length) {
        guessTiles[currentTile].textContent = letter.toUpperCase();
        my2DArray[currentGuessId][currentTile] = letter.toUpperCase();
        pressedKeys.push(letter.toUpperCase());
        currentTile++;

        console.log(`inside handleinput`);
    }
}

function handleDelete() {

    console.log(`handleDelete`);
    guessTiles = document.querySelectorAll(`#guessrow-${currentGuessId} .guess_tile`);

    if (currentTile > 0 ) {
        guessTiles[--currentTile].textContent = "";
        my2DArray[currentGuessId][currentTile] = "";
        pressedKeys.pop(); // Remove the last element from the array
    }
}

let isValidating = false;
function handleValide() {
    console.log(`handleValide`);

    if (currentTile === 5 && !isValidating) {
        isValidating = true;
        const word = pressedKeys.join("");
        isValidEnglishWord(word).then((isValid) => {
            if (isValid) {
                console.log(`handle is Valide`);
                currentGuessId++;
                currentTile = 0;
                pressedKeys = [];
            } else {
                displaymessage('Not in word list');
            }
            isValidating = false; // reset the flag
        });
    } else if (currentTile < 5) {
        displaymessage('Not enough letters');
    }
}


// document.removeEventListener('keydown', function(event) {
//     if (/^[a-zA-Z]$/.test(event.key)) {
//         handleInput(event.key);
//     } else if (event.key === 'Backspace') {
//         handleDelete();
//     } else if (event.key === 'Enter' && currentTile === 5) {
//         handleValide();
//     }
// });



// For device keyboard
document.addEventListener('keydown', function(event) {
    if (/^[a-zA-Z]$/.test(event.key)) {
        handleInput(event.key);
    } else if (event.key === 'Backspace') {
        handleDelete();
    } else if (event.key === 'Enter') {
        handleValide();
    }
});

// For onscreen keyboard
letters.forEach((letter) => {
    const key = document.createElement('button');
    key.classList.add('key');
    key.textContent = letter;
    key.setAttribute(`id`, `${letter}`);
    if (letter === '«') {
        key.addEventListener('click', () =>handleDelete());
    } else if(letter === 'ENTER'  ){
        key.addEventListener('click', () =>handleValide());

        // key.addEventListener('click', () => {
        //     if (currentTile === 5) {
        //         handleValide();
        //     }
        // });
    }
    else {
        key.addEventListener('click', () => handleInput(letter));
    }
    keyboard.appendChild(key);
});





// document.addEventListener('keydown', function(event) {
//     if ((event.key === 'Enter' || keyclick(letter) === 'ENTER')  && currentTile === 5) {
//         const word = pressedKeys.join("");
//         isValidEnglishWord(word).then((isValid) => {
//
//             if (isValid) {
//
//                 currentGuessId++;
//                 currentTile = 0;
//                 pressedKeys = [];
//
//                 // displaymessage('Not a valid word');
//
//             }
//             else {
//
//                 displaymessage('Not in word list');
//             }
//
//
//         });
//     }
// });

function displaymessage(mssg) {
    let message_p = document.createElement(`p`);




    message_p.textContent = mssg;

    display.querySelectorAll('p').forEach((p) => p.remove());

    display.append(message_p);

    setTimeout(() => {display.removeChild(message_p); }, 2000);

}



// this is when the user clicks the submit button and currentTile is 5
// if not enough letters are entered, the user will get an alert "Not enough letters"
// this will also check if the word is a valid word


const apiKey = "83537e0184msh0743f7a849e7654p1fcddcjsn831dd1e4eb31";
const letterPattern = encodeURIComponent("^[a-z]{5}$");


let randomWord = "";

function getRandomWord() {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://random-words5.p.rapidapi.com/getMultipleRandom?count=1&wordLength=5",
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "83537e0184msh0743f7a849e7654p1fcddcjsn831dd1e4eb31",
            "X-RapidAPI-Host": "random-words5.p.rapidapi.com"
        }
    };


    $.ajax(settings).done(function (response) {
        randomWord = response[0];
        console.log(randomWord);
        freqWord(randomWord);
    });

}

// "url": "https://wordsapiv1.p.rapidapi.com/words/?letterPattern=^[a-z]{5}$&random=true&frequency[zipf]>=5&frequency[perMillion]>=80&frequency[diversity]>=0.5",


// Call the function to get a random word
getRandomWord()

// this is to check if the user input is a valid word
let checkword = "";

function isValidEnglishWord(word) {
    return new Promise((resolve, reject) => {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://wordsapiv1.p.rapidapi.com/words/${word}/typeOf`,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "83537e0184msh0743f7a849e7654p1fcddcjsn831dd1e4eb31",
                "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(() => {
            resolve(true);
        }).fail(() => {
            resolve(false);
        });
    });
}










