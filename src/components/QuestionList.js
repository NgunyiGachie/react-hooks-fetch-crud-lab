// QuestionList.js
import React, { useState, useEffect } from "react";


function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(response => response.json())
      .then(questions => setQuestions(questions));
  }, []);

  function handleCorrectIndexChange(id, correctIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correctIndex: correctIndex })
    })
    .then(response => {
      if (response.ok) {
        setQuestions(prevQuestions =>
          prevQuestions.map(question =>
            question.id === id ? { ...question, correctIndex: correctIndex } : question
          )
        );
      } else {
        console.error("Failed to update correct index");
      }
    })
    .catch(error => {
      console.error("Error updating correct index:", error);
    });
  }

  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      if (response.ok) {
        setQuestions(prevQuestions =>
          prevQuestions.filter(question => question.id !== id)
        );
      } else {
        console.error("Failed to delete question");
      }
    })
    .catch(error => {
      console.error("Error deleting question:", error);
    });
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            {question.prompt}
            <select
              value={question.correctIndex}
              onChange={e => handleCorrectIndexChange(question.id, parseInt(e.target.value))}
            >
              {Array.from({ length: 4 }, (_, index) => (
                <option key={index} value={index}>{question[`answer${index + 1}`]}</option>
              ))}
            </select>
            <button onClick={() => handleDeleteQuestion(question.id)}>Delete Question</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
