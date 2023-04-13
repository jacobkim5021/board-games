import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BoardPieceTypes, TileTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getTileDataById, getTileSize } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit, OnDestroy {
  @Input() coordinates: { x: number, y: number};
  @Input() tileType: TileTypes = TileTypes.Ground;
  @Input() selected: boolean;
  @Input() boardPieceType: BoardPieceTypes;
  @Input() forceSpawn: boolean;
  tileSize: number;
  type: TileTypes;
  isSpawn: boolean;

  tileStyle: any = {};

  subs: Subscription[] = [];

  constructor(
    private store: Store<State>,
  ) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getTileSize).subscribe((tileSize: number) => {
        this.tileSize = tileSize;
        this.setTileStyle();
      })
    );
    if (this.coordinates) {
      // on game board
      this.subs.push(
        this.store.select(getTileDataById(this.coordinates.x + '-' + this.coordinates.y)).subscribe((tileData) => {
          if(tileData) {
            this.type = tileData.type;
            this.isSpawn = this.forceSpawn || tileData.isSpawn;
            this.setTileStyle();
          }
        })
      );
    } else {
      this.type = this.tileType;
      if (this.boardPieceType) {
        // board piece palette
      } else {
        // tile palette
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private setTileStyle() {
    this.tileStyle = {
      width: this.tileSize + 'px',
      height: this.tileSize + 'px',
      position: 'relative',
      ...((this.forceSpawn || this.isSpawn ) ? {'box-shadow': 'inset 0 0 12px 5px #37bd3b'} : {}),
    }
  }
}
