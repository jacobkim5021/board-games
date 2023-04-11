import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BoardPieceTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getTileSize } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-board-piece',
  templateUrl: './board-piece.component.html',
  styleUrls: ['./board-piece.component.scss']
})
export class BoardPieceComponent implements OnInit, OnDestroy {
  @Input() type: BoardPieceTypes;
  tileSize: number;
  svgStyle: any;

  subs: Subscription[] = [];

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getTileSize).subscribe((tileSize: number) => {
        this.tileSize = tileSize;
        this.svgStyle = {
          width: this.tileSize + 'px',
          height: this.tileSize + 'px',
          display: 'flex',
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
