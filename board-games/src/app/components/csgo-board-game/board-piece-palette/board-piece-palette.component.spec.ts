import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPiecePaletteComponent } from './board-piece-palette.component';

describe('BoardPiecePaletteComponent', () => {
  let component: BoardPiecePaletteComponent;
  let fixture: ComponentFixture<BoardPiecePaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardPiecePaletteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardPiecePaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
