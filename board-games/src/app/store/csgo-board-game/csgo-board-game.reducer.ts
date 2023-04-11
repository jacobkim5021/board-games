import { createFeature, createReducer, on } from '@ngrx/store';
import * as CsgoBoardGameActions from './csgo-board-game.actions';

export const csgoBoardGameFeatureKey = 'csgoBoardGame';
export const INITIAL_BOARD_SIZE = { x: 25, y: 25 };
export const INITIAL_TILE_SIZE = 30;

export interface State {
  username: string;
  boardSize: {
    x: number,
    y: number,
  };
  tileSize: number;
  tiles: {
    [id: string]: TileInfo;
  }
  palette: {
    selectedBoardPieceType: BoardPieceTypes|null;
    selectedTileType: TileTypes|null;
  };
  boardPieces: {
    [id: string]: BoardPiece
  };
}

export interface BoardPiece {
  type: BoardPieceTypes;
  position: string;   // tile id,
};

export interface TileInfo {
  type: TileTypes;
  style: TileStyles;
};

export enum BoardPieceTypes {
  Awp = 'awp',
  Rifle = 'rifle',
  Smg = 'smg',
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
  username: 'tempUserId',
  tiles: getInitialTiles(INITIAL_BOARD_SIZE.x, INITIAL_BOARD_SIZE.y),
  boardSize: INITIAL_BOARD_SIZE,
  tileSize: INITIAL_TILE_SIZE,
  palette: {
    selectedTileType: null,
    selectedBoardPieceType: null
  },
  boardPieces: {}
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

  on(CsgoBoardGameActions.setTileSize, (state, action) => {
    return {
      ...state,
      tileSize: action.tileSize ?? 0,
    };
  }),

  on(CsgoBoardGameActions.setCsgoBoardSize, (state, action) => {
    // Create new tile data, preserve existing tile data if possible
    const freshTiles = getInitialTiles(action.boardSize.x, action.boardSize.y);
    Object.keys(freshTiles).forEach(key => {
      if(state.tiles[key]) {
        freshTiles[key] = state.tiles[key];
      }
    });

    // Remove board pieces with invalid position
    const filteredPieces = Object.keys(state.boardPieces).filter(boardPieceId => {
      return freshTiles[state.boardPieces[boardPieceId].position];
    }).reduce((result: any, boardPieceId) => {
      result[boardPieceId] = state.boardPieces[boardPieceId];
      return result;
    }, {});

    return {
      ...state,
      boardSize: action.boardSize,
      tiles: freshTiles,
      boardPieces: filteredPieces,
    };
  }),

  on(CsgoBoardGameActions.setSelectedPaletteTileType, (state, action) => {
    const selectedTileType = action.tileType ?? null;
    return {
      ...state,
      palette: {
        ...state.palette,
        selectedTileType: selectedTileType !== state.palette.selectedTileType ? selectedTileType : null,
      }
    };
  }),

  on(CsgoBoardGameActions.setSelectedPaletteBoardPieceType, (state, action) => {
    const selectedBoardPieceType = action.boardPieceType ?? null;
    return {
      ...state,
      palette: {
        ...state.palette,
        selectedBoardPieceType: selectedBoardPieceType !== state.palette.selectedBoardPieceType ? selectedBoardPieceType : null,
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

  on(CsgoBoardGameActions.patchBoardPieceData, (state, action) => {
    const { [action.boardPieceId]: value, ...rest } = state.boardPieces;
    if (action.data) {
      return {
        ...state,
        boardPieces: {
          ...state.boardPieces,
          [action.boardPieceId]: {
            ...state.boardPieces[action.boardPieceId] ?? {},
            ...action.data,
          }
        }
      };
    } else {
      return {
        ...state,
        boardPieces: rest,
      }
    }
  }),
);

export const csgoBoardGameFeature = createFeature({
  name: csgoBoardGameFeatureKey,
  reducer,
});

