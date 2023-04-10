import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TileStyles, TileTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getTileDataById } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit{
  @Input() coordinates: { x: number, y: number};
  @Input() tileType: TileTypes;
  @Input() selected: boolean;
  @Input() tileSize: { x: string, y: string } = { x: '30px', y: '30px' };
  type: TileTypes;
  style: TileStyles;

  constructor(
    private store: Store<State>,
  ) {
  }

  ngOnInit(): void {
    if (this.coordinates) {
      // on game board
      this.store.select(getTileDataById(this.coordinates.x + '-' + this.coordinates.y)).subscribe((tileData) => {
        if(tileData) {
          this.type = tileData.type;
          this.style = tileData.style;
        }
      });
    } else {
      // palette
      this.type = this.tileType;
    }
  }
}
