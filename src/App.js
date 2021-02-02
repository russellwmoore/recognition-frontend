import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";

const baseString = "https://www.vimeo.com/r/";
const API = "https://recognition-code.herokuapp.com";

export default function App() {
  useEffect(() => {
    axios
      .get(`${API}/health`)
      .then((res) => {
        console.log(res.data);
        setButtonText("Submit");
      })
      .catch((e) => {
        console.log("big e");
        console.error(e);
      });
  }, []);

  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(0);
  const [button, setButton] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("--Loading--");
  const messages = [
    "No code found. Try again",
    "Try again",
    "Nope, try again",
    "One more try!"
  ];
  const handleSubmit = (code) => {
    if (count > 3) {
      setMessage("Try again later.");
      setButton(true);
      return;
    }
    axios.post(`${API}/api/code`, { code }).then(({ data }) => {
      if (data.error) {
        setCount(count + 1);
        setMessage(messages[count]);
        return;
      }
      setUrl(baseString + data.code);
      setMessage("");
    });
  };

  const handleInput = (word) => {
    if (word.length > 9) return;
    setCode(word);
  };

  return (
    <div className="wrap">
      <div className="App">
        <h2>Enter the code on your Biopholio</h2>
        <input value={code} onChange={(e) => handleInput(e.target.value)} />
        <button disabled={button} onClick={() => handleSubmit(code)}>
          {buttonText}
        </button>
        {url.length ? (
          <h3>
            <a
              target="_blank"
              rel="noopener noreferrer"
              id="vid-link"
              href={url}
            >
              {url}
            </a>
          </h3>
        ) : (
          <h3>{message}</h3>
        )}
        <p>Code not working? Drop us a line here: </p>
        <p>info@BiophiliaRecords.com </p>
      </div>
    </div>
  );
}
