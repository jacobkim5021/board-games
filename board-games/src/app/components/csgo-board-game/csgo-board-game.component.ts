import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BoardPieceTypes, TileTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { LandingDialogComponent } from './dialogs/landing-dialog/landing-dialog.component';
import { getMapEditorMode } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';

@Component({
  selector: 'app-csgo-board-game',
  templateUrl: './csgo-board-game.component.html',
  styleUrls: ['./csgo-board-game.component.scss']
})
export class CsgoBoardGameComponent implements OnInit, OnDestroy {
  showMapEditor: boolean = true;
  tileTypes: TileTypes[] = Object.values(TileTypes);
  boardPieceTypes: BoardPieceTypes[] = Object.values(BoardPieceTypes);
  subs: Subscription[] = [];

  constructor(
    private store: Store<any>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.dialog.open(LandingDialogComponent, {
      disableClose: true,
      width: '300px'
    });
    this.subs.push(
      this.store.select(getMapEditorMode).subscribe(mapEditorMode => {
        this.showMapEditor = mapEditorMode;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  }
}
