import { createAction, props } from '@ngrx/store';
import { TileInfo, TileTypes } from './csgo-board-game.reducer';

export const loadCsgoBoardGames = createAction(
  '[CsgoBoardGame] Load CsgoBoardGames'
);

export const loadCsgoBoardGamesSuccess = createAction(
  '[CsgoBoardGame] Load CsgoBoardGames Success',
  props<{ data: any }>()
);

export const loadCsgoBoardGamesFailure = createAction(
  '[CsgoBoardGame] Load CsgoBoardGames Failure',
  props<{ error: any }>()
);

export const setCsgoBoardGameMap = createAction(
  '[CsgoBoardGame] Set Csgo Board Game Map',
  props<{ tiles: { [id: string]: TileInfo }, boardSize: { x: number, y: number } }>()
);

export const setCsgoBoardSize = createAction(
  '[CsgoBoardGame] Set Csgo Board Game Map Size',
  props<{ boardSize: { x: number, y: number } }>()
);

export const setSelectedPaletteTileType = createAction(
  '[CsgoBoardGame] Set Selected Palette Tile Type',
  props<{ tileType: TileTypes }>()
);

export const setTileType = createAction(
  '[CsgoBoardGame] Set Tile Type',
  props<{ tileId: string, tileType: TileTypes }>()
);
