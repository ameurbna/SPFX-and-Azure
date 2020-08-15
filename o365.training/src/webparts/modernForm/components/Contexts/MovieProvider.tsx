import * as React from 'react';
import { useState } from 'react';
import { createContext} from 'react';

export const MovieContext = createContext([]);

export const MovieProvider = props => {
    const [movies, setMovies] = useState([
        {
            name:"Harry Potter",
            price:"$10",
            id:1
        },
        {
            name:"Game of Throne",
            price:"$10",
            id:2
        },
        {
            name:"Inception",
            price:"$10",
            id:3
        }
    ]);
    return (
        <MovieContext.Provider value={[movies, setMovies]}>
                {props.children}
        </MovieContext.Provider>
    );
}
