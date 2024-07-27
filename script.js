'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del DOM
    const playerForm = document.getElementById('player-form');
    const playerNameInput = document.getElementById('player-name');
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const currentWordElement = document.getElementById('current-word');
    const wordListElement = document.getElementById('word-list');
    const endGameButton = document.getElementById('end-game');
    const boardElement = document.getElementById('board');
    const deleteWordButton = document.getElementById('delete-word');
    const validateWordButton = document.getElementById('validate-word');
    const shuffleBoardButton = document.getElementById('shuffle-board');
    const messageElement = document.getElementById('message');

    // Variables para el juego
    let timer;
    let score = 0;
    let wordsFound = [];
    let currentWord = '';
    let currentWordPath = [];
    let board = [];

    // Generar el tablero con letras aleatorias
    function generateBoard() {
        const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
        board = [];
        for (let i = 0; i < 16; i++) {
            board.push(letters.charAt(Math.floor(Math.random() * letters.length)));
        }
    }

    // Mezclar el tablero
    function shuffleBoard() {
        for (let i = board.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [board[i], board[j]] = [board[j], board[i]];
        }
        updateBoard();
    }

    // Iniciar el juego
    function startGame() {
        const playerName = playerNameInput.value.trim();
        if (playerName.length < 3) {
            showMessage('El nombre debe tener al menos 3 letras.');
            return;
        }

        playerForm.style.display = 'none';
        gameBoard.classList.remove('hidden');

        resetGame();
        generateBoard();
        updateBoard();
        startTimer(180);
    }

    // Actualizar el tablero en la interfaz
    function updateBoard() {
        boardElement.innerHTML = '';
        board.forEach((letter, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = letter;
            cell.dataset.index = index;
            cell.addEventListener('click', () => selectCell(letter, index));
            boardElement.appendChild(cell);
        });
    }

    // Seleccionar una celda
    function selectCell(letter, index) {
        if (currentWordPath.length === 0 || isValidSelection(index)) {
            currentWord += letter;
            currentWordPath.push(index);
            currentWordElement.textContent = currentWord;
            document.querySelector(`[data-index='${index}']`).classList.add('selected');
        }
    }

    // Verificar si la selección de la celda es válida
    function isValidSelection(index) {
        const lastIndex = currentWordPath[currentWordPath.length - 1];
        const validMoves = [
            lastIndex - 5, lastIndex - 4, lastIndex - 3,
            lastIndex - 1, lastIndex + 1,
            lastIndex + 3, lastIndex + 4, lastIndex + 5
        ];
        return validMoves.includes(index) && !currentWordPath.includes(index);
    }

    // Validar la palabra seleccionada
    function validateWord(word) {
        if (word.length < 3) {
            showMessage('La palabra debe tener al menos 3 letras.');
            deleteWordButton.click();
            return;
        }

        if (wordsFound.includes(word)) {
            showMessage('Esta palabra ya ha sido encontrada.');
            deleteWordButton.click();
            return;
        }

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => response.json())
            .then(data => {
                if (data.title !== 'No Definitions Found') {
                    wordsFound.push(word);
                    score += calculateScore(word.length);
                    scoreElement.textContent = 'Puntaje: ' + score;
                    wordListElement.innerHTML += `<li>${word}</li>`;
                    currentWord = '';
                    currentWordPath = [];
                    currentWordElement.textContent = '';
                    clearSelectedCells();
                    showMessage('Palabra válida', 'success');
                } else {
                    showMessage('Palabra no válida');
                    deleteWordButton.click();
                }
            })
            .catch(error => {
                console.error('Error al validar la palabra:', error);
                showMessage('Error al validar la palabra');
            });
    }

    // Calcular el puntaje según la longitud de la palabra
    function calculateScore(length) {
        if (length >= 8) return 11;
        if (length === 7) return 5;
        if (length === 6) return 3;
        if (length === 5) return 2;
        if (length === 3 || length === 4) return 1;
        return 0;
    }

    // Eliminar la palabra seleccionada
    function deleteWord() {
        currentWord = '';
        currentWordPath = [];
        currentWordElement.textContent = '';
        clearSelectedCells();
    }

    // Limpiar las celdas seleccionadas
    function clearSelectedCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('selected'));
    }

    // Iniciar el temporizador
    function startTimer(seconds) {
        let timeRemaining = seconds;
        timerElement.textContent = `Tiempo: ${timeRemaining}s`;
        timer = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = `Tiempo: ${timeRemaining}s`;
            if (timeRemaining <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    // Finalizar el juego
    function endGame() {
        localStorage.setItem('playerName', playerNameInput.value);
        localStorage.setItem('score', score);
        window.location.href = 'GameOver.html';
    }

    // Reiniciar el juego
    function resetGame() {
        clearInterval(timer);
        score = 0;
        wordsFound = [];
        currentWord = '';
        currentWordPath = [];
        scoreElement.textContent = 'Puntaje: 0';
        wordListElement.innerHTML = '';
        currentWordElement.textContent = '';
        messageElement.textContent = '';
    }

    // Mostrar un mensaje al usuario
    function showMessage(message, type = 'error') {
        messageElement.textContent = message;
        messageElement.className = type;
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = '';
        }, 2000);
    }

    // Event listeners
    playerForm.addEventListener('submit', event => {
        event.preventDefault();
        startGame();
    });

    deleteWordButton.addEventListener('click', deleteWord);
    validateWordButton.addEventListener('click', () => validateWord(currentWord));
    shuffleBoardButton.addEventListener('click', shuffleBoard);
    endGameButton.addEventListener('click', endGame);
});