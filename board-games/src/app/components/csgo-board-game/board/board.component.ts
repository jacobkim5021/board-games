import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit{
  @Input() xDimension: number;
  @Input() yDimension: number;

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    
  }
  
}
