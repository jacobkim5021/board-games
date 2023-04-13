import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setPalette, setSelectedPaletteBoardPieceType, setSelectedPaletteTileType } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { BoardPieceTypes, Palette } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getPalette, getSelectedPaletteBoardPieceType } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';

@Component({
  selector: 'app-board-piece-palette',
  templateUrl: './board-piece-palette.component.html',
  styleUrls: ['./board-piece-palette.component.scss']
})
export class BoardPiecePaletteComponent implements OnInit, OnDestroy {
  boardPieceTypes: BoardPieceTypes[] = Object.values(BoardPieceTypes);
  subs: Subscription[] = [];
  palette: Palette;

  constructor(
    private store: Store<any>,
    // private cdRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getPalette).subscribe((palette: Palette) => {
        this.palette = JSON.parse(JSON.stringify(palette));
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onPaletteBoardPieceClick(_event: any, boardPieceType: BoardPieceTypes): void {
    this.store.dispatch(setPalette({
      ...this.palette,
      selectedTileType: null,
      isSpawnSelected: false,
      selectedBoardPieceType: boardPieceType,
    }));
  }
}
