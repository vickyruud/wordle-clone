import React from 'react';
import { wordList } from './constants/data';


const App = () => {

  //use state for board data which stores the data from the board to save the ongoing game
  const [boardData, setBoardData] = useState(JSON.parse(localStorage.getItem('board-data')));
  //store the array of characters in state
  const [charArray, setCharArray] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000)
  }


  //display error and clear in 3 seconds
  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000)
  }

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
      status: "LOST";
      handleMessage("Hard Luck! Try again!");

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

//handles key press
  const handleKeyPress = (key) => {
    //ignore key press if row index is greater than 5  or is user already won the game
    if (boardData.rowIndex > 5 || boardData.status === "WIN") return;
    //on enter key
    if (key = "ENTER") {
      if (charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if (!wordList[word.charAt(0)].includes[word]) {
          handleError();
          handleMessage('Not in word list');
          return;
        }
        enterBoardWord(word);
        setCharArray([]);
      } else {
        handleMessage('Not enough letters');
      }
    }


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
    <div>

    </div>
  )
}

export default App