import React from "react";
import axios from "axios";
import Joke from "./Joke";
import Spinner from "./Spinner";
import "./JokeList.css";


class JokeList extends React.Component {
  static defaultProps = { numJokesToGet: 10 }

  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
    this.clearVotes = this.clearVotes.bind(this);
    this.getJokes = this.getJokes.bind(this);
  }

  /** change the jokes state to empty array, triggering getJokes */
  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  /** add or subtract from a joke's votes, then update local storage */
  vote(id, delta) {
    const newJokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j));
    localStorage.setItem("jokes", JSON.stringify(newJokes));
    this.setState({ jokes: newJokes });
  }

  /** clear all votes, then update in local storage */
  clearVotes() {
    let newJokes = this.state.jokes.map(j => ({ ...j, votes: 0 }))
    localStorage.setItem("jokes", JSON.stringify(newJokes));
    this.setState({ jokes: newJokes });
  }

  /** retreive jokes from the API, then set in state and local storage */
  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;
        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 })
        } else {
          console.error("duplicate found!");
        }
      }
      localStorage.setItem("jokes", JSON.stringify(j));
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  /** populate jokes on component mount, from local storage if available, otherwise get jokes from API */
  componentDidMount() {
    if (localStorage.getItem("jokes") === null) {
      this.getJokes();
      localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
    } else {
      this.setState({ jokes: JSON.parse(localStorage.getItem("jokes")) })
    }
  }

  /** Get jokes if jokes state changes, or number of jokes prop changes */
  componentDidUpdate(prevProps, prevState) {
    if ((this.state.jokes !== prevState.jokes) || (this.props.numJokesToGet !== prevProps.numJokesToGet)) {
      if (this.state.jokes.length === 0) {
        this.getJokes();
      }
    }
  }

  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
          <button className="JokeList-getmore" onClick={this.clearVotes}>
            Clear Votes
          </button>
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} /> // render a joke for all jokes
          ))}
        </div>
      );
    } else {
      return (<Spinner />);
    }
  }
}

export default JokeList;
