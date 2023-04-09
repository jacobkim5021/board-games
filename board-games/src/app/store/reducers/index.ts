import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import * as csgoBoardGame from '../csgo-board-game/csgo-board-game.reducer';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
  csgoBoardGame: csgoBoardGame.reducer,
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
