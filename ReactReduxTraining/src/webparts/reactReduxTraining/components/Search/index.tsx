import * as React from 'react';
import { actionFetchNotes, actionFetchNotesByKey } from '../../actions';
import { connect } from 'react-redux';
import { AppState } from '../../reducers';
const style = require('./style.scss');

export interface SearchComponentProps {
  onChange: (text: string) => void
}

export interface SearchComponentState {
  searchText: string
}
class SearchComponent extends React.Component<SearchComponentProps, SearchComponentState> {
  constructor(props: SearchComponentProps, context: {}) {
    super(props, context);
    this.state = {
      searchText: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      searchText: e.currentTarget.value
    });
    this.props.onChange(e.currentTarget.value);
  }

  render() {
    return (
        <div >
          <input type='text' onChange={this.onChange} value={this.state.searchText} />
        </div>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SearchComponentProps) => {
  return {
    notes: state.list.notes,
    state: state.list.state,
    errorMessage: state.list.errorMessage
  };
};

const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line
  return {
    onChange: (key:string) => dispatch(actionFetchNotesByKey(key))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);



