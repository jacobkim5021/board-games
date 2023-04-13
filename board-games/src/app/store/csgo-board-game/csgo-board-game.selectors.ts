import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCsgoBoardGame from './csgo-board-game.reducer';

export const selectCsgoBoardGameState = createFeatureSelector<fromCsgoBoardGame.State>(
  fromCsgoBoardGame.csgoBoardGameFeatureKey
);

export const getStateForExport = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    const {
      username: _1,
      palette: _2,
      boardPieces: _3,
      ...rest
    } = csgoBoardGameState;
    return rest;
  }
);

export const getUsername = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.username;
  }
);

export const getMapEditorMode = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.mapEditorMode;
  }
);

export const getAllTiles = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.tiles;
  }
);

export const getBoardSize = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.boardSize;
  }
);

export const getTileSize = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.tileSize;
  }
);

export const getTileDataById = (tileId: string) => {
  return createSelector(selectCsgoBoardGameState, (csgoBoardGameState: fromCsgoBoardGame.State) => {
    if (csgoBoardGameState && csgoBoardGameState.tiles) {
      return csgoBoardGameState.tiles[tileId];
    } else {
      return null;
    }
  });
};

export const getBoardPieceMap = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.boardPieces;
  }
);

export const getPalette = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.palette;
  }
);

export const getSelectedPaletteTileType = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.palette.selectedTileType;
  }
);

export const getSelectedPaletteBoardPieceType = createSelector(
  selectCsgoBoardGameState,
  (csgoBoardGameState: fromCsgoBoardGame.State) => {
    return csgoBoardGameState.palette.selectedBoardPieceType;
  }
);