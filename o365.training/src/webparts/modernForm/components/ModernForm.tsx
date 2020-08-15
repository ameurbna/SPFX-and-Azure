import * as React from 'react';
import styles from './ModernForm.module.scss';
import { IModernFormProps } from './IModernFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MovieList from './MovieComponent/MovieList';
import Nav from './MovieComponent/Nav';
import AddMovie from './MovieComponent/AddMovie';
import {MovieProvider} from './Contexts/MovieProvider';

export default class ModernForm extends React.Component<IModernFormProps, {}> {
  public render(): React.ReactElement<IModernFormProps> {
    return (
           <MovieProvider>
             <div className={ styles.modernForm }>
                <div className={ styles.container }>
                  <div className={ styles.row }>
                    <div className={ styles.column }>
                      <Nav/>
                      <AddMovie/>
                      <MovieList></MovieList>
                      </div>
                  </div>
                </div>
             </div>
            </MovieProvider>
    );
  }
}
