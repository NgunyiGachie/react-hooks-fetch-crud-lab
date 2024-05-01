import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0,
  });

  const [result, setResult] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then((r) => {
      if (!r.ok) {
        throw new Error('Failed to add question');
      }
      return r.json();
    })
    .then((newQuestion) => {
      if (typeof onAddQuestion === 'function') {
        onAddQuestion(newQuestion);
        setResult("Question added successfully");
        setFormData({
          prompt: "",
          answer1: "",
          answer2: "",
          answer3: "",
          answer4: "",
          correctIndex: 0, 
        });
      } else {
        console.error('onAddQuestion is not a function');
      }
    })
    .catch((error) => {
      console.error('Error adding question:', error);
      setResult("Failed to add question");
    });
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleCorrectIndexChange(event) {
    const correctIndex = parseInt(event.target.value);
    setFormData({ ...formData, correctIndex });
  }

  return (
    <section>
      <h1>New Question</h1>
      {result && <p>{result}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleCorrectIndexChange}
            required
          >
            {[1, 2, 3, 4].map((index) => (
              <option key={index} value={index - 1}>{formData[`answer${index}`]}</option>
            ))}
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
