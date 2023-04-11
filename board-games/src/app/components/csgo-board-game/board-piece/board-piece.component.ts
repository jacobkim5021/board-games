import { Component, Input, OnInit } from '@angular/core';
import { BoardPieceTypes } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';

@Component({
  selector: 'app-board-piece',
  templateUrl: './board-piece.component.html',
  styleUrls: ['./board-piece.component.scss']
})
export class BoardPieceComponent implements OnInit {
  @Input() size: number;
  @Input() type: BoardPieceTypes;
  svgStyle: any;

  constructor(

  ) { }

  ngOnInit(): void {
    this.svgStyle = {
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }
}
