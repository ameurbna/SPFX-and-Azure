import * as React from 'react';
import {useState} from 'react';
import { useContext } from 'react';
import {MovieContext} from '../Contexts/MovieProvider';
 const AddMovie = ()=>{
     const [movies,setMovies] = useContext(MovieContext);
    const [name,setName]=useState('');
    const [price,setPrice]=useState('');

    const updateName=(e)=>{
        setName(e.target.value);
    }
    const updatePrice=(e)=>{
        setPrice(e.target.value);
    }

    const addMovie=(e)=>{
        e.preventDefault();
        setMovies(prevMovies=>[...prevMovies,{id:prevMovies.length+1,name:name,price:price}])
        setName('');
        setPrice('');
    }

    return(
        <form>
            <input type="text" name="name" value={name} onChange={updateName}/>
            <input type="text" name="price" value={price} onChange={updatePrice}/>
            <button onClick={addMovie}>Submit</button>
        </form>
    );
}
export default AddMovie;