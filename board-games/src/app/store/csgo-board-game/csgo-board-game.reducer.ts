import { createFeature, createReducer, on } from '@ngrx/store';
import * as CsgoBoardGameActions from './csgo-board-game.actions';

export const csgoBoardGameFeatureKey = 'csgoBoardGame';
export const INITIAL_BOARD_SIZE = { x: 25, y: 25 };
export const INITIAL_TILE_SIZE = 30;

export interface State {
  username: string;
  mapEditorMode: boolean;
  boardSize: {
    x: number,
    y: number,
  };
  tileSize: number;
  tiles: {
    [id: string]: TileInfo;
  }
  palette: Palette;
  boardPieces: {
    [id: string]: BoardPiece
  };
}

export interface Palette {
  selectedBoardPieceType: BoardPieceTypes|null;
  selectedTileType: TileTypes|null;
  isSpawnSelected: boolean;
}

export interface BoardPiece {
  type: BoardPieceTypes;
  position: string;   // tile id,
};

export interface TileInfo {
  type: TileTypes;
  isSpawn: boolean;
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

const getInitialTiles = (xLength: number, yLength: number) => {
  const initialTiles: { [coordinate: string]: TileInfo } = {};
  Array.from(Array(xLength)).forEach((_x, x) => {
    Array.from(Array(yLength)).forEach((_y, y) => {
      initialTiles[x + '-' + y] = {
        type: TileTypes.Ground,
        isSpawn: false,
      } as TileInfo;
    });
  });
  return initialTiles;
};

export const initialState: State = {
  username: '',
  mapEditorMode: false,
  tiles: getInitialTiles(INITIAL_BOARD_SIZE.x, INITIAL_BOARD_SIZE.y),
  boardSize: INITIAL_BOARD_SIZE,
  tileSize: INITIAL_TILE_SIZE,
  palette: {
    selectedTileType: null,
    selectedBoardPieceType: null,
    isSpawnSelected: false,
  },
  boardPieces: {}
};

export const reducer = createReducer(
  initialState,
  on(CsgoBoardGameActions.loadCsgoBoardGames, state => state),
  on(CsgoBoardGameActions.loadCsgoBoardGamesSuccess, (state, action) => state),
  on(CsgoBoardGameActions.loadCsgoBoardGamesFailure, (state, action) => state),

  on(CsgoBoardGameActions.setMapEditorMode, (state, action) => {
    return {
      ...state,
      mapEditorMode: action.mapEditorMode
    };
  }),

  on(CsgoBoardGameActions.setCsgoBoardGameMap, (state, action) => {
    return {
      ...state,
      boardSize: action.boardSize ?? state.boardSize,
      tiles: action.tiles ?? state.tiles,
      tileSize: action.tileSize ?? state.tileSize,
    };
  }),

  on(CsgoBoardGameActions.enterLobby, (state, action) => {
    return {
      ...state,
      username: action.username,
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

  on(CsgoBoardGameActions.setPalette, (state, action) => {
    return {
      ...state,
      palette: {
        selectedTileType: action.selectedTileType,
        selectedBoardPieceType: action.selectedBoardPieceType,
        isSpawnSelected: action.isSpawnSelected,
      },
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

  on(CsgoBoardGameActions.patchTileData, (state, action) => {
    if (action.tileId) {
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.tileId]: {
            ...state.tiles[action.tileId] ?? {},
            ...action.data,
          }
        }
      };
    } else {
      return state;
    }
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

