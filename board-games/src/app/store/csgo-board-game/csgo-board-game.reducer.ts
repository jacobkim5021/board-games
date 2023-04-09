import { createFeature, createReducer, on } from '@ngrx/store';
import * as CsgoBoardGameActions from './csgo-board-game.actions';

export const csgoBoardGameFeatureKey = 'csgoBoardGame';
export const INITIAL_BOARD_SIZE = { x: 15, y: 15 };

export interface State {
  boardSize: {
    x: number,
    y: number,
  }
  tiles: {
    [id: string]: TileInfo;
  }
  palette: {
    selected: TileTypes|null;
  }
}

export interface TileInfo {
  type: TileTypes;
  style: TileStyles;
};

export enum TileTypes {
  Wall = 'wall',
  Ground = 'ground',
  Ladder = 'ladder',
  Box = 'box',
};

export interface TileStyles {
  // class: TileTypes;
  background: any;
}

const getInitialTiles = (xLength: number, yLength: number) => {
  const initialTiles: { [coordinate: string]: TileInfo } = {};
  Array.from(Array(xLength)).forEach((_x, x) => {
    Array.from(Array(yLength)).forEach((_y, y) => {
      initialTiles[x + '-' + y] = {
        type: TileTypes.Ground,
        style: {
          // class: TileTypes.Wall
        },
      } as TileInfo;
    });
  });
  return initialTiles;
};

export const initialState: State = {
  tiles: getInitialTiles(INITIAL_BOARD_SIZE.x, INITIAL_BOARD_SIZE.y),
  boardSize: INITIAL_BOARD_SIZE,
  palette: {
    selected: null
  }
};

export const reducer = createReducer(
  initialState,
  on(CsgoBoardGameActions.loadCsgoBoardGames, state => state),
  on(CsgoBoardGameActions.loadCsgoBoardGamesSuccess, (state, action) => state),
  on(CsgoBoardGameActions.loadCsgoBoardGamesFailure, (state, action) => state),

  on(CsgoBoardGameActions.setCsgoBoardGameMap, (state, action) => {
    return {
      ...state,
      boardSize: action.boardSize,
      tiles: action.tiles
    };
  }),

  on(CsgoBoardGameActions.setSelectedPaletteTileType, (state, action) => {
    const selectedTileType = action.tileType ?? null;
    return {
      ...state,
      palette: {
        ...state.palette,
        selected: selectedTileType !== state.palette.selected ? selectedTileType : null,
      }
    };
  }),

  on(CsgoBoardGameActions.setTileType, (state, action) => {
    return {
      ...state,
      tiles: {
        ...state.tiles,
        [action.tileId]: {
          ...state.tiles[action.tileId],
          type: action.tileType,
        }
      }
    };
  }),
);

export const csgoBoardGameFeature = createFeature({
  name: csgoBoardGameFeatureKey,
  reducer,
});

