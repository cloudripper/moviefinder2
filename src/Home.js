import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './utils';


const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster } = props.movie; 

    return (
        <div>
            <div className="row">
                <div className="col-4 col-md-3 mb-3 pl-5 text-center">
                    <Link to={`/movie/${imdbID}/`}>
                        <img src={Poster} className="img-fluid" alt="404"/>                    
                    </Link>
                </div>
                <div className="col-8 col-md-9 mb-3 text-left">
                    <Link to={`/movie/${imdbID}/`}>
                        <h4>{Title}</h4>
                        <p>{Type} | {Year}</p>
                    </Link>
                </div>
            </div>
            <hr className="mb-4 break" />
       </div>
    )
}

class MovieFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            results: [],
            error: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let { searchTerm } = this.state;
        searchTerm = searchTerm.trim();
        if (!searchTerm) {
            return;
        }
        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=516b1aec`).then(checkStatus).then(json).then((data) => {
            if (data.Response === 'False') {
                throw new Error(data.Error);
            }
            if (data.Response === 'True' && data.Search) {
                this.setState({ results: data.Search, error: '' });
            }
        }).catch((error) => {
            this.setState({ error: error.message });
            console.log(error);
        })

        

    }

    render() {
        const { searchTerm, results, error } = this.state;

        return (
            <div className="container">
                <div className="row text-center mt-5">
                    <div className="my-auto mx-auto border bg-dark rounded">
                        <h3 className="mt-4 title">Movie Finder</h3>
                        <form onSubmit={this.handleSubmit} className="form-inline mb-3">
                            <div className="my-3 mx-auto">
                                <input className="form-control ml-4 pb-1 border rounded bg-light" onChange={this.handleChange} type="text" value={searchTerm} placeholder="Movie Title" />
                                <button className="btn btn-sm btn-primary ml-2 mr-4 my-auto py-1" type="submit" value="submit">Search</button>
                            </div>
                        </form>
                        {(() => {
                            if (error) {
                                return <div className="movieList mb-3">{error}</div>;
                            }
                            return results.map((movie) => {
                                return <Movie key={movie.imdbID} movie={movie} />;
                            })
                        })()}
                    </div>
                </div>
            </div>

        )
    }
}

export default MovieFinder;