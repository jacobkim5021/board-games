import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as CsgoBoardGameActions from './csgo-board-game.actions';


@Injectable()
export class CsgoBoardGameEffects {

  loadCsgoBoardGames$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(CsgoBoardGameActions.loadCsgoBoardGames),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => CsgoBoardGameActions.loadCsgoBoardGamesSuccess({ data })),
          catchError(error => of(CsgoBoardGameActions.loadCsgoBoardGamesFailure({ error }))))
      )
    );
  });


  constructor(private actions$: Actions) {}
}
