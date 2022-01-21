import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({ numJokesToGet = 10 }) {
  const [jokes, setJokes] = useState([]);

  /* get jokes if there are no jokes */

  useEffect(function() {
    async function getJokes() {
      // make a temp array with all the jokes
      let j = [...jokes];
      let seenJokes = new Set(); // store unique jokes
      try {
        while (j.length < numJokesToGet) { // keep adding jokes up until the total number
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data; // get the joke
  
          if (!seenJokes.has(jokeObj.id)) { // if the joke isn't in the seen array, it's not a duplicate
            seenJokes.add(jokeObj.id); // add the joke to the set so we know it it's been seen
            j.push({ ...jokeObj, votes: 0 }); // add the joke to the array
          } else {
            console.error("duplicate found!");
          }
        }
        setJokes(j); // make jokes the final array
      } catch (e) {
        console.log(e);
      }
    }

    if (jokes.length === 0) getJokes(); // if the jokes array is empty, get new jokes
  }, [jokes, numJokesToGet]); // call this effect if jokes changes, or the number of jokes changes

  /* empty joke list and then call getJokes */

  function generateNewJokes() {
    setJokes([]); // emptying the joke list will call the getJokes effect
  }

  /* change vote for this id by delta (+1 or -1) */

  // remake the joke array
  // if the joke being mapped is the joke in question
  // respread joke data, but change number of votes
  // if not the joke in question throw it back in
  function vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  if (jokes.length) { 
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes); // sort jokes by num of votes
  
          // on click, empty list thereby getting new jokes

    return (
      <div className="JokeList"> 
        <button className="JokeList-getmore" onClick={generateNewJokes}> 
          Get New Jokes
        </button>
  
        {sortedJokes.map(j => ( 
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} /> // render a joke for all jokes
        ))}
      </div>
    );
  }

  return null;

}

export default JokeList;
