import * as React from 'react';

const Movie=(props)=>{
  return(
    <div>
        <h3>{props.movie.name}</h3>
        <h4>{props.movie.price}</h4>
    </div>
  );

}

export default Movie;