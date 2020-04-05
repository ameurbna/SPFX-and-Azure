import Data from './Data';
import IBook  from '../models/IBook';


export default class MissionServices{
   public static getAllBooks():Promise<IBook[]> {
    return  new Promise((resolve, reject) => {
      resolve(Data);
    });
  }
  public static AddBook(newBook:IBook):Promise<IBook[]> {
    return  new Promise((resolve, reject) => {
      try {
        (<IBook[]> Data).push(newBook);
        resolve(Data);
      } catch (error) {
        reject(error);
      }

    });
  }
  public static AddNewBook():Promise<IBook> {
    return  new Promise((resolve, reject) => {
      try {
        let newBook:IBook={
          Title: "",
          Author: "",
          Price: "",
          Summary: ""
        } ;
        resolve(newBook);
      } catch (error) {
        reject(error);
      }

    });
  }


}
