import * as React from 'react';
import NotesList from '../components/NotesList';
import NoteModel from '../models/NoteModel';
import { actionFetchNotes } from '../actions';
import { connect } from 'react-redux';
import { AppState } from '../reducers';


interface HomeViewProps {
  loadData: () => () => void,
  notes: NoteModel[],
  state: string,
  errorMessage?: string
}

interface HomeViewState {
}

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps, state: HomeViewState) {
    super(props, state);
  }
  componentDidMount() {
    if (this.props.state === 'INIT') {
      this.props.loadData();
    }
  }

  render() {
    return (
      <section>
        <title>
          Notes
        </title>

      {this.renderNotes()}
    </section>
    );
  }

  renderNotes() {
    if (this.props.state === 'LOADING') {
      return (<p>Loading ...</p>);
    } else if (this.props.state === 'ERROR') {
      return (<p>Error: {this.props.errorMessage}</p>);
    } else if (this.props.state === 'LOADED') {
      return (<NotesList notes={this.props.notes}  />);
    } else {
      return 'Init State';
    }
  }
}

const mapStateToProps = (state: AppState, ownProps: HomeViewProps) => {
  return {
    notes: state.list.notes,
    state: state.list.state,
    errorMessage: state.list.errorMessage
  };
};

const mapDispatchToProps = (dispatch: any) => { // tslint:disable-line
  return {
    loadData: () => dispatch(actionFetchNotes())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
