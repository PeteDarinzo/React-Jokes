import React from "react";
import "./Joke.css";

function Joke({ vote, votes, text, id }) {

  // increment/decrement the number of votes a joke has
  const upVote = () => vote(id, +1);
  const downVote = () => vote(id, -1);

  // a joke simply displays two buttons
  // when clicked they incrememnt/ decrement
  // and the joke text
  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={upVote}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={downVote}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
