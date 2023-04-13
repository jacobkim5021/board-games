import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setPalette } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { Palette, TileTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getPalette } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-tile-palette',
  templateUrl: './tile-palette.component.html',
  styleUrls: ['./tile-palette.component.scss']
})
export class TilePaletteComponent implements OnInit, OnDestroy {
  tileTypes: TileTypes[] = Object.values(TileTypes);
  tileTypesInterface = TileTypes;
  palette: Palette;
  subs: Subscription[] = [];

  constructor(
    private store: Store<State>,

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

  onPaletteTileClick(_event: any, tileType: TileTypes|null, isSpawn: boolean): void {
    this.store.dispatch(setPalette({
      ...this.palette,
      selectedBoardPieceType: null,
      isSpawnSelected: isSpawn,
      selectedTileType: isSpawn ? null : tileType,
    }));
  }
}
