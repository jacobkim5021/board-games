import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsgoBoardGameComponent } from './csgo-board-game.component';

describe('CsgoBoardGameComponent', () => {
  let component: CsgoBoardGameComponent;
  let fixture: ComponentFixture<CsgoBoardGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsgoBoardGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsgoBoardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
