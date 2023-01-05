import {useState, useEffect, useCallback} from "react"
import {wordsList} from "./data/words"
 
import './App.css';

import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
    {id:1, name:"start"},
    {id:2, name:"game"},
    {id:3, name:"end"}
]

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);

    const [pickedWord, setPickedWord] = useState("");
    const [pickedCatagory, setPickedCategory] = useState("");
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(3);
    const [score, setScore] = useState(-20); // solução temporária para o bug da pontuação

    const pickWordAndCategory = useCallback(()=>{
        const categories = Object.keys(words)
        const randomPicker = Math.floor(Math.random() *categories.length);
        const category = categories[randomPicker]

       const word = words[category][Math.floor(Math.random()* words[category].length )]
       
       return {category, word}
    }, [words])


    const startGame = useCallback(()=>{
        
        clearLettersStates()
       const {category, word} = pickWordAndCategory();
       let wordLetters = word.split("")
       wordLetters = wordLetters.map((l)=> l.toLowerCase());

       setPickedCategory(category);
       setPickedWord(word);
       setLetters(wordLetters)

       setGameStage(stages[1].name)
       

    },[pickWordAndCategory])

    const verifyLetter = (letter)=>{
        const lowerCasedLetter = letter.toLowerCase();
        
        // checks if letter has already been utilized

        if(guessedLetters.includes(lowerCasedLetter) || wrongLetters.includes(lowerCasedLetter)){
            return;
        }

        // push guessed letter or remove a chance
        if(letters.includes(lowerCasedLetter)){
            setGuessedLetters((prevGuessedLetters)=> [...prevGuessedLetters,lowerCasedLetter]
            )
        }else{
            setWrongLetters((prevWrongLetters) => [...prevWrongLetters,lowerCasedLetter]
            );

            setGuesses((prevGuesses)=> prevGuesses - 1);
        }
    }
    // Restart game
    const retry = ()=>{
        setScore(0);
        setGuesses(3)
        setGameStage(stages[0].name)
    };

    //clear letters state
    const clearLettersStates = ()=>{
        setGuessedLetters([]);
        setWrongLetters([]);
    };

    // check if guesses ended
    useEffect(()=>{
        if (guesses === 0){
            clearLettersStates();
            setGameStage(stages[2].name)
        }
    }, [guesses])

    //check win condition
    useEffect(()=>{
        const uniqueLetters = [...new Set(letters)]

        if(guessedLetters.length === uniqueLetters.length){
            setScore((prevScore)=> prevScore+=10);

            startGame();
        }
    },[guessedLetters, letters, startGame])

    
    return(
        
        <div className="App">
            
            { gameStage === "start" && <StartScreen startGame = {startGame}/>}
            {gameStage ==="game" && <Game
                verifyLetter= {verifyLetter}
                pickedWord={pickedWord}
                pickedCategory ={pickedCatagory}
                letters ={letters}
                guessedLetters={guessedLetters}
                wrongLetters={wrongLetters}
                guesses={guesses}
                score={score}
            />}
            {gameStage ==="end" && <GameOver retry={retry} score={score}/>}
        </div>   
    )
    
}

export default App;
