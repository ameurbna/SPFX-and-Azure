import * as React from 'react';
import NoteModel from '../../models/NoteModel';

const style = require('./style.scss');

export interface NoteProps {
  note: NoteModel
}

export interface NoteState {
}

export default class Note extends React.Component<NoteProps, NoteState> {

  contentWithBreaks() {
    const x = this.props.note.content.replace(/\n/g, '<br/>');
    return { __html: x };
  }

  render() {
    return (
      <div >
        <div >{this.props.note.title}</div>
        <p  dangerouslySetInnerHTML={this.contentWithBreaks()} />
        <div >{this.props.note.creationDate}</div>
      </div>
    );
  }
}
