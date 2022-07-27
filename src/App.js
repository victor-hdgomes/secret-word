// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from './data/words'

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

const guassesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guassesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { category, word }
  }, [words])

  // Start the secret word game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates()

    // Pick word and pick category
    const { category, word } = pickWordAndCategory()

    // Create an array of letters
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((L) => L.toLowerCase())

    // Fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // Process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // Check if letter was already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // Push guessed letters or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses-1)
    }

  }

  // Check if guesses ended
  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Check win conditional
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    if (guessedLetters.length === uniqueLetters.length) {
      // Add score
      setScore((actualScore) => actualScore += 100)

      // Restart game with new word
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  // Restart the game
  const retry = () => {
    setScore(0)
    setGuesses(guassesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
