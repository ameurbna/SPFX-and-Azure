import * as React from 'react';
import Note from '../Note';
import NoteModel from '../../models/NoteModel';
const style = require('./style.scss');

export interface NotesListProps {
  notes: NoteModel[]
}

export interface NotesListState {
  notes: number[]
}

export default class NotesList extends React.Component<NotesListProps, NotesListState> {
  render() {
    return (
      <div>
      <ul >
        {this.props.notes.map((note: NoteModel) => <li key= {note.id}><Note note={note} /></li>)}
      </ul>
      </div>
    );
  }


}
