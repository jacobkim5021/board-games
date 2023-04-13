import { Component, OnInit, ViewChildren, QueryList, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';
import { Subscription } from 'rxjs';
import { getBoardPieceMap, getBoardSize, getPalette, getTileSize, getUsername } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { Palette, TileTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { patchBoardPieceData, patchTileData, setSelectedPaletteBoardPieceType, setTileType } from 'src/app/store/csgo-board-game/csgo-board-game.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('board') boardElement: QueryList<any>;
  
  username: string;
  boardSize: { x: number, y: number };
  boardPixels: { x: number, y: number };
  xArray: any[];
  yArray: any[];
  tileSize: number;
  palette: Palette;
  boardStyle: any = {
    'display': 'grid',
    'justify-items': 'center',
    position: 'relative',
  };
  boardPieceMap: { [id: string]: any } = {};
  boardPieceList: any[] = [];
  subs: Subscription[] = [];

  constructor(
    private store: Store<State>,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getBoardSize).subscribe((boardSize: any) => {
        this.boardSize = { ...boardSize };
        this.xArray = Array.from(Array(boardSize.x));
        this.yArray = Array.from(Array(boardSize.y));
        this.boardPixels = this.getBoardPixels();
        this.boardStyle['grid-template-columns'] = `repeat(${boardSize.x}, 1fr)`;
        this.boardStyle['grid-template-rows'] = `repeat(${boardSize.y}, 1fr)`;
        this.boardStyle['width'] = this.boardPixels.x + 'px';
        this.boardStyle['height'] = this.boardPixels.y + 'px';
        this.cdRef.detectChanges();
      })
    );
    this.subs.push(
      this.store.select(getTileSize).subscribe((tileSize: number) => {
        this.tileSize = tileSize;
        this.boardPixels = this.getBoardPixels();
        this.boardPieceList = this.boardPieceList.map(boardPiece => {
          const [xOffset, yOffset] = this.getOffsetFromTileId(boardPiece.position);
          return {
            ...boardPiece,
            xOffset,
            yOffset,
          };
        });
      })
    );
    this.subs.push(
      this.store.select(getBoardPieceMap).subscribe(boardPieceMap => {
        this.boardPieceList = Object.keys(boardPieceMap).map(boardPieceId => {
          if (!boardPieceMap[boardPieceId].position) console.log(boardPieceId)
          const [xOffset, yOffset] = this.getOffsetFromTileId(boardPieceMap[boardPieceId].position);
          return {
            ...boardPieceMap[boardPieceId],
            xOffset,
            yOffset,
            id: boardPieceId,
          };
        });
      })
    );
    this.subs.push(
      this.store.select(getPalette).subscribe((palette: Palette) => {
        this.palette = JSON.parse(JSON.stringify(palette));
      })
    );
    this.subs.push(
      this.store.select(getUsername).subscribe((username: string) => {
        this.username = username;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
  }
  
  onTileClick(_event: any, x: number, y: number): void {
    if (this.palette.selectedTileType) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.palette.selectedTileType }));
    } else if (this.palette.selectedBoardPieceType) {
      this.store.dispatch(patchBoardPieceData({
        boardPieceId: this.username,
        data: {
          type: this.palette.selectedBoardPieceType,
          position: x + '-' + y,
        }
      }));
      this.store.dispatch(setSelectedPaletteBoardPieceType({ boardPieceType: null }));
    } else if (this.palette.isSpawnSelected) {
      this.store.dispatch(patchTileData({
        tileId: x + '-' + y,
        data: {
          isSpawn: true
        }
      }));
    } else {
      console.log('tile ' + x + '-' + y +' clicked without palette tile set')
    }
  }

  onTileMouseover(event: any, x: number, y: number): void {
    if (this.palette.selectedTileType && event.buttons === 1) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.palette.selectedTileType }));
    } else if (event.buttons === 2) {
      this.store.dispatch(patchTileData({
        tileId: x + '-' + y,
        data: {
          type: TileTypes.Ground,
          isSpawn: false,
        }
      }));
    }
  }

  onTileMouseup(_event: any): void {
    this.clearSelection();
  }

  onBoardPieceClick(event: any, boardPiece: any): void {
    console.log('click board piece', event)
    const [x, y] = boardPiece.position.split('-');
    if (this.palette.selectedTileType) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.palette.selectedTileType }));
    } else if (this.palette.isSpawnSelected) {
      this.store.dispatch(patchTileData({
        tileId: x + '-' + y,
        data: {
          isSpawn: this.palette.isSpawnSelected,
        }
      }));
    }
  }

  onBoardPieceMouseover(event: any, boardPiece: any): void {
    const [x, y] = boardPiece.position.split('-');
    if (this.palette.selectedTileType && event.buttons === 1) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.palette.selectedTileType }));
    } else if (event.buttons === 2) {
      this.store.dispatch(patchBoardPieceData({
        boardPieceId: boardPiece.id,
        data: null
      }));
    }
  }

  clearSelection(): void {
    if(window.getSelection) {
      var sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
      }
    }
  }

  getOffsetFromTileId(tileId: string): number[] {
    const [x, y] = tileId.split('-');
    return [
      this.boardPixels.x / this.boardSize.x * Number(x),
      this.boardPixels.y / this.boardSize.y * Number(y),
    ];
  }

  private getBoardPixels(): { x: number, y: number} {
    let newBoardPixels = { x: 0, y: 0 };
    if (this.boardSize, this.tileSize) {
      newBoardPixels = {
        x: this.boardSize.x * (this.tileSize + 4),
        y: this.boardSize.y * (this.tileSize + 4)
      };
    }
    this.boardStyle['width'] = newBoardPixels.x + 'px';
    this.boardStyle['height'] = newBoardPixels.y + 'px';
    return newBoardPixels
  }
}
