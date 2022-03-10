import React from 'react';
import { wordList } from './constants/data';


const App = () => {

  //use state for board data which stores the data from the board to save the ongoing game
  const [boardData, setBoardData] = useState(JSON.parse(localStorage.getItem('board-data')));
  //store the array of characters in state
  const [charArray, setCharArray] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);


//handles key press
  const handleKeyPress = (key) => {
    //ignore key press if row index is greater than 5  or is user already won the game
    if (boardData.rowIndex > 5 || boardData.status === "WIN") return;
    //on enter key
    if (key = "ENTER") {
      if (charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if (!wordList[word.charAt(0)].includes[word]) {
          
        }
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