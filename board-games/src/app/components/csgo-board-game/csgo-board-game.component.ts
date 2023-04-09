import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { setCsgoBoardGameMap, setSelectedPaletteTileType, setTileType } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { TileTypes, initialState } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
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
  xLength: number;
  yLength: number;
  tileTypes: TileTypes[] = Object.values(TileTypes);
  selectedPaletteTileType: TileTypes | null;

  subs: Subscription[] = [];

  constructor(
    private store: Store<any>,
  ) {

  }

  ngOnInit(): void {
    console.log(this.tileTypes);
    this.subs.push(
      this.store.select(getBoardSize).subscribe((boardSize) => {
        this.xLength = boardSize.x;
        this.yLength = boardSize.y;
      })
    );

    this.subs.push(
      this.store.select(getSelectedPaletteTileType).subscribe((tileType: TileTypes|null) => {
        this.selectedPaletteTileType = tileType;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onTileClick(_event: any, x: number, y: number): void {
    console.log(`[${x},${y}]`);
    if (this.selectedPaletteTileType) {
      this.store.dispatch(setTileType({ tileId: x + '-' + y, tileType: this.selectedPaletteTileType }));
    } else {
      
    }
  }

  onMapEditorToggle(event: any): void {
    this.showMapEditor = event.checked;
  }
  
  onPaletteTileClick(_event: any, tileType: TileTypes): void {
    this.store.dispatch(setSelectedPaletteTileType({ tileType }));
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
}
