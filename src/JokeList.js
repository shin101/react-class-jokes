import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = { numJokesToGet : 10 };
  constructor(props) {
    super(props);
    // state 
    this.state = { jokes: [] };
    this.vote = this.vote.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    try {
      let jokes = this.state.jokes;

      let seenJokes = new Set(jokes.map(j => j.id));

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }

      this.setState({ jokes });
    } catch (e) {
        console.log(e);
    }
  }
  
  /* empty joke list and then call getJokes */
  
    // original function version : 
    // function generateNewJokes() {
    //   setJokes([]);
    // }

  // generateNewJokes() {
  //   this.setState(({ jokes: this.state.jokes })) // is this part correct?
  // }

  

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    this.setState(allJokes => ({
      jokes: allJokes.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    }));
  }

  /* render: either loading spinner or list of sorted jokes. */

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={() => {
          this.setState({ jokes: [] });
        }}>
          Get New Jokes
        </button>
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}
      </div>
    );
  } 
}

export default JokeList;

