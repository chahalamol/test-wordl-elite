document.addEventListener("DOMContentLoaded", () => {

    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getNewWord() {
        fetch(
          `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=6&lettersMax=6`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
              "x-rapidapi-key": "78a55235d3msh4e1efc75bb43953p10c1c4jsna769327e614d",
            },
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            word = res.word;
          })
          .catch((err) => {
            console.error(err);
          });
      }

    function getCurrentWordArray() {
        const numberOfGuessedWords = guessedWords.length
        return guessedWords[numberOfGuessedWords - 1]
    }

    function updateGuessedWords(letter) {
        const currentWordArray = getCurrentWordArray()

        if (currentWordArray && currentWordArray.length < 6) {
            currentWordArray.push(letter)

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrect = word.includes(letter);

        if (!isCorrect) {
            return "rgb(58, 58, 60)" //grey color
        }

        const letterInPosition = word.charAt(index);
        const isCorrectPosition = (letter === letterInPosition);

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)"; //green colour
        }

        return "rgb(181, 159, 59)"; //yellow colour
    }

    function handleSubmitWord() {

        const currentWordArray = getCurrentWordArray();

        if (currentWordArray.length !== 6) {
            window.alert("Word must be 6 letter");
        }

        const currentWord = currentWordArray.join("");

        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
              method: "GET",
              headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": "78a55235d3msh4e1efc75bb43953p10c1c4jsna769327e614d",
              },
            }
          ).then((res) => {
              if (!res.ok) {
                  throw Error()
              }

              const firstLetterId = guessedWordCount * 6 + 1;

              const interval = 200;
      
              currentWordArray.forEach((letter, index) => {
                  setTimeout(() => {
                      const tileColor = getTileColor(letter, index);
      
                      const letterId = firstLetterId + index;
                      const letterEl = document.getElementById(letterId);
      
                      //letterId.classList.add("animate__flipInX");
                      letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                      
                  }, interval * index);
              });
      
              guessedWordCount += 1;
      
              if (currentWord === word) {
                  window.alert("Congratulations!");
              }
      
              if (guessedWords.length === 6) {
                  window.alert(`You lost! The word is ${word}`);
              }
      
              guessedWords.push([])

          }).catch(() => {
              window.alert("Word is not recognized!");
          });
     }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 30; i++) {
            let box = document.createElement("div");
            box.classList.add("square");
            // box.classList.add("animate__animated");
            box.setAttribute("id", i + 1);
            gameBoard.appendChild(box);
        }
    }

    function handleDeleteLetter() {
        const currentWordArray = getCurrentWordArray();
        const removedLetter = currentWordArray.pop();

        guessedWords[guessedWords.length - 1] = currentWordArray
        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1;

    }

    for (let i = 0; i < keys.length; i++) {
        // pressing the key on the screen
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord()
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter)
        };

    }

    document.addEventListener('keydown', (e) =>{
        const letter = e.key;

        if (letter === 'Backspace') {
            handleDeleteLetter();
            return;
        }

        if (letter === 'Enter') {
            handleSubmitWord();
            return;
        }

        updateGuessedWords(letter);
    })


 });