import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setCsgoBoardSize, setTileSize } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { getBoardSize, getTileSize } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-map-dimension-settings',
  templateUrl: './map-dimension-settings.component.html',
  styleUrls: ['./map-dimension-settings.component.scss']
})
export class MapDimensionSettingsComponent implements OnInit, OnDestroy {
  xDimension: number;
  yDimension: number;
  tileSize: number;
  subs: Subscription[] = [];
  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getTileSize).subscribe((tileSize: number) => {
        this.tileSize = tileSize;
      })
    );
    this.subs.push(
      this.store.select(getBoardSize).subscribe((boardSize) => {
        this.xDimension = boardSize.x;
        this.yDimension = boardSize.y;
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
}
