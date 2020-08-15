import * as React from 'react';
import { useState , useContext } from 'react';
import Movie  from './Movie';
import {MovieContext} from '../Contexts/MovieProvider';
const MovieList = () =>{
   const [movies, setMovies] =useContext(MovieContext);
    return (
        <div>
            {
                movies.map(movie=>(
                    <Movie movie={movie} key={movie.id}></Movie>
                ))
            }
        </div>
    );
}
export default MovieList;