import React, { useState, useEffect } from 'react';
import { wordList } from './constants/data';
import './App.css'
import Keyboard from './component/Keyboard';

const App = () => {

  //use state for board data which stores the data from the board to save the ongoing game
  const [boardData, setBoardData] = useState(JSON.parse(localStorage.getItem('board-data')));
  //store the array of characters in state
  const [charArray, setCharArray] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);


  //refresh the word
  const resetBoard = () => {
    let alphabetIndex = Math.floor(Math.random() * 26);
      let wordIndex = Math.floor(Math.random() * wordList[String.fromCharCode(97 + alphabetIndex)].length);
      let newBoardData = {
        ...boardData, "solution": wordList[String.fromCharCode(97 + alphabetIndex)][wordIndex],
        "rowIndex": 0,
        "boardWords": [],
        "boardRowStatus": [],
        "presentCharArray": [],
        "absentCharArray": [],
        "correctCharArray": [],
        "status": "IN_PROGRESS"
      };
      setBoardData(newBoardData);
      localStorage.setItem("board-data", JSON.stringify(newBoardData));

  }

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000)
  }


  //display error and clear in 3 seconds
  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000)
  }

  //handles rendering and storing of each key and word
  const enterBoardWord = (word) => {
    let boardWords = boardData.boardWords;
    let boardRowStatus = boardData.boardRowStatus;
    let solution=boardData.solution;
    let presentCharArray=boardData.presentCharArray;
    let absentCharArray=boardData.absentCharArray;
    let correctCharArray=boardData.correctCharArray;
    let rowIndex = boardData.rowIndex;
    let rowStatus =[];
    let matchCount=0;
    let status = boardData.status;

    for (let index = 0; index < word.length; index++) {
      if (solution.charAt(index) === word.charAt(index)) {
        matchCount++;
        rowStatus.push('correct');
        if (!correctCharArray.includes(word.charAt(index))) correctCharArray.push(word.charAt(index));
        if (presentCharArray.indexOf(word.charAt(index)) !== -1) presentCharArray.splice(presentCharArray.indexOf(word.charAt(index)), 1);
        
      } else if (solution.includes(word.charAt(index))) {
        rowStatus.push('present');
        if (!correctCharArray.includes(word.charAt(index)) 
              && !presentCharArray.includes(word.charAt(index))) presentCharArray.push(word.charAt(index));
      } else {
        rowStatus.push('absent');
        if(!absentCharArray.includes(word.charAt(index))) absentCharArray.push(word.charAt(index));
      }
    }
    if (matchCount === 5) {
      status = "WON";
      handleMessage("You Won!!");

    } else if (rowIndex + 1 === 6) {
      let answer = boardData.solution;
      status = "LOST";
      handleMessage(`Hard Luck! Try again! The word was ${answer.toUpperCase()}`);

    }
    boardRowStatus.push(rowStatus);
    boardWords[rowIndex] = word;
    let newBoardData = {
      ...boardData,
      "boardWords":boardWords,
      "boardRowStatus":boardRowStatus,
      "rowIndex":rowIndex+1,
      "status":status,
      "presentCharArray":presentCharArray,
      "absentCharArray":absentCharArray,
      "correctCharArray":correctCharArray
    };
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));
  }


  const enterCurrentText = (word) => {
    let boardWords = boardData.boardWords;
    let rowIndex = boardData.rowIndex;
    boardWords[rowIndex] = word;
    let newBoardData = { ...boardData, "boardWords": boardWords };
    setBoardData(newBoardData);
  }


//handles key press
const handleKeyPress= (key)=>{
    if(boardData.rowIndex > 5 || boardData.status === "WIN") return;
    if(key==="ENTER"){
        if(charArray.length===5){
            let word = charArray.join("").toLowerCase();
            if(!wordList[word.charAt(0)].includes(word)) {
                handleError();
                handleMessage("Not in word list");
                return;
              }
            enterBoardWord(word);
            setCharArray([]);
        }else{
            handleMessage("Not enough letters");
        }
        return;
    }
    if(key==="⌫"){
        charArray.splice(charArray.length-1,1);
        setCharArray([...charArray]);
    }
    else if(charArray.length<5){
        charArray.push(key);
        setCharArray([...charArray]);
    }
    enterCurrentText(charArray.join("").toLowerCase());
}

  useEffect(() => {
    if (!boardData || !boardData.solution) {
      let alphabetIndex = Math.floor(Math.random() * 26);
      let wordIndex = Math.floor(Math.random() * wordList[String.fromCharCode(97 + alphabetIndex)].length);
      let newBoardData = {
        ...boardData, "solution": wordList[String.fromCharCode(97 + alphabetIndex)][wordIndex],
        "rowIndex": 0,
        "boardWords": [],
        "boardRowStatus": [],
        "presentCharArray": [],
        "absentCharArray": [],
        "correctCharArray": [],
        "status": "IN_PROGRESS"
      };
      setBoardData(newBoardData);
      localStorage.setItem("board-data", JSON.stringify(newBoardData));
   }
  }, [])
  


  return (
    <div className='container'>
      <div className='top'>
        <div className='title'>WORDLE CLONE</div>
        <button className='reset-board' onClick={resetBoard}>{"\u27f3"}</button>
      </div>
      {message && <div className='message'>{message}</div>}
      <div className='cube'>
        {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
          <div className={`cube-row ${boardData && row === boardData.rowIndex && error && "error"}`}>
            {
              [0, 1, 2, 3, 4].map((column, letterIndex) => (
                <div key={letterIndex} className={`letter ${boardData && boardData.boardRowStatus[row]? boardData.boardRowStatus[row][column] : ""}`}>
                {boardData && boardData.boardWords[row] && boardData.boardWords[row][column]}
                </div> 
              ))
            }
          </div>
        ))}
      </div>
      <div className='bottom'>
        <Keyboard
          boardData={boardData} 
          handleKeyPress = {handleKeyPress}/>
      </div>
    </div>
  )
}

export default App