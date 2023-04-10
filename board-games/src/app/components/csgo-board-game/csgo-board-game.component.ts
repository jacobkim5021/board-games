import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { setCsgoBoardGameMap, setCsgoBoardSize, setSelectedPaletteTileType, setTileType } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { INITIAL_TILE_SIZE, TileTypes, initialState } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getBoardSize, getSelectedPaletteTileType, selectCsgoBoardGameState } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
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
  selectedPaletteTileType: TileTypes | null;
  xDimension: number;
  yDimension: number;
  tileSize: number = INITIAL_TILE_SIZE;       // in pixels
  subs: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private cdRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    console.log(this.tileTypes);
    this.subs.push(
      this.store.select(getSelectedPaletteTileType).subscribe((tileType: TileTypes|null) => {
        this.selectedPaletteTileType = tileType;
      })
    );

    this.subs.push(
      this.store.select(getBoardSize).subscribe((boardSize) => {
        console.log(boardSize);
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
    this.tileSize = event;
  }

  onTileClick(_event: any, x: number, y: number): void {
    if (this.selectedPaletteTileType) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.selectedPaletteTileType }));
    } else {
      console.log('tile ' + x + '-' + y +' clicked without palette tile set')
    }
  }

  onTileMouseover(event: any, x: number, y: number): void {
    if (this.selectedPaletteTileType && event.buttons === 1) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.selectedPaletteTileType }));
    } else if (event.buttons === 2) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: TileTypes.Ground }));
    }
  }

  onTileMouseup(_event: any): void {
    this.clearSelection();
  }

  onPaletteTileClick(_event: any, tileType: TileTypes): void {
    this.store.dispatch(setSelectedPaletteTileType({ tileType }));
  }

  onMapEditorToggle(event: any): void {
    this.showMapEditor = event.checked;
    if (this.selectedPaletteTileType) {
      this.store.dispatch(setSelectedPaletteTileType({ tileType: this.selectedPaletteTileType }));
    }
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

  clearSelection(): void {
    if(window.getSelection) {
      var sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
      }
    }
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }
}
