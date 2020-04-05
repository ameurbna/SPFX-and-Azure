import NoteModel from '../models/NoteModel';
import Poems from './data/notes';

const ENABLE_RANDOM_ERRORS = false;

export default class NotesService {
  static getAll(): Promise<NoteModel[]> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (ENABLE_RANDOM_ERRORS && Math.random() > 0.5) {
            reject(new Error('Error'));
          } else {
            resolve(Poems);
          }
        }, 1500);
      });
  }
  static getByKey(searchKey:string): Promise<NoteModel[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ENABLE_RANDOM_ERRORS && Math.random() > 0.5) {
          reject(new Error('Error'));
        } else {
          resolve(Poems.filter(p=>p.content.indexOf(searchKey)!=-1|| p.title.indexOf(searchKey)!=-1));
        }
      }, 1500);
    });
}
}
