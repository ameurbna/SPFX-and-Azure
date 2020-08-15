import * as React from 'react';
import {useContext} from 'react';
import {MovieContext} from '../Contexts/MovieProvider';

const Nav=(props)=>{
    
    const [movies,setMovies]=useContext(MovieContext);
    
    return(
    <div>
        <h3>Dev Ed</h3>
        <p>List of Movies: {movies.length} </p>
    </div>
  );

}

export default Nav;