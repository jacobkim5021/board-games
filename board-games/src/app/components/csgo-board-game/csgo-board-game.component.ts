import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { setCsgoBoardGameMap, setCsgoBoardSize, setSelectedPaletteBoardPieceType, setSelectedPaletteTileType, setTileSize, setTileType } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { BoardPieceTypes, INITIAL_TILE_SIZE, TileTypes, initialState } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getBoardSize, getSelectedPaletteBoardPieceType, getSelectedPaletteTileType, getTileSize, selectCsgoBoardGameState } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import exportFromJSON from 'export-from-json';

@Component({
  selector: 'app-csgo-board-game',
  templateUrl: './csgo-board-game.component.html',
  styleUrls: ['./csgo-board-game.component.scss']
})
export class CsgoBoardGameComponent implements OnInit, OnDestroy {
  @ViewChild('importFileUpload') importFileUploadInput: ElementRef;
  showMapEditor: boolean = true;
  tileTypes: TileTypes[] = Object.values(TileTypes);
  boardPieceTypes: BoardPieceTypes[] = Object.values(BoardPieceTypes);
  selectedPaletteTileType: TileTypes | null;
  selectedPaletteBoardPieceType: BoardPieceTypes | null;
  xDimension: number;
  yDimension: number;
  tileSize: number;
  subs: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private cdRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getTileSize).subscribe((tileSize: number) => {
        this.tileSize = tileSize;
      })
    );
    this.subs.push(
      this.store.select(getSelectedPaletteTileType).subscribe((tileType: TileTypes|null) => {
        this.selectedPaletteTileType = tileType;
      })
    );
    this.subs.push(
      this.store.select(getSelectedPaletteBoardPieceType).subscribe((boardPieceType: BoardPieceTypes|null) => {
        this.selectedPaletteBoardPieceType = boardPieceType;
      })
    );
    this.subs.push(
      this.store.select(getBoardSize).subscribe((boardSize) => {
        this.xDimension = boardSize.x;
        this.yDimension = boardSize.y;
        this.cdRef.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onDimensionChange(event: any, dimension: string): void {
    if (event > 0) {
      const newBoardSize = {
        x: dimension === 'x' ? event : this.xDimension,
        y: dimension === 'y' ? event : this.yDimension
      };
      this.store.dispatch(setCsgoBoardSize({ boardSize: newBoardSize }))
    }
  }

  onTileSizeChange(event: any): void {
    this.store.dispatch(setTileSize({ tileSize: event }));
  }

  onPaletteTileClick(_event: any, tileType: TileTypes): void {
    this.store.dispatch(setSelectedPaletteTileType({ tileType }));
    this.store.dispatch(setSelectedPaletteBoardPieceType({ boardPieceType: null }));
  }
  
  onPaletteBoardPieceClick(_event: any, boardPieceType: BoardPieceTypes): void {
    this.store.dispatch(setSelectedPaletteBoardPieceType({ boardPieceType }));
    this.store.dispatch(setSelectedPaletteTileType({ tileType: null }));
  }

  onMapEditorToggle(event: any): void {
    this.showMapEditor = event.checked;
    this.store.dispatch(setSelectedPaletteTileType({ tileType: null }));
  }

  onExportClick(): void {
    this.store.select(selectCsgoBoardGameState).pipe(take(1)).subscribe((state) => {
      exportFromJSON({ data: { ...state }, fileName: 'map', exportType: exportFromJSON.types.json });
    });
  }

  onImportClick(event: any): void {
    const uploadedMapFile = event.target.files[0]
    const fileReader = new FileReader();
    fileReader.readAsText(uploadedMapFile, "UTF-8");
    fileReader.onload = () => {
      const newState = JSON.parse(fileReader.result as string);
      if (newState.tiles && newState.boardSize) {
        this.store.dispatch(setCsgoBoardGameMap({ tiles: newState.tiles, boardSize: newState.boardSize }));
      }
    }
    fileReader.onerror = (error) => {
      console.log(error)
    }

    this.importFileUploadInput.nativeElement.value = '';
  }

  onResetClick(): void {
    this.store.dispatch(setCsgoBoardGameMap({ tiles: initialState.tiles, boardSize: initialState.boardSize }));
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }
}
