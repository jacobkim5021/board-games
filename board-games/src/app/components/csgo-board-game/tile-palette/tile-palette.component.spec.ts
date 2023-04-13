import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePaletteComponent } from './tile-palette.component';

describe('TilePaletteComponent', () => {
  let component: TilePaletteComponent;
  let fixture: ComponentFixture<TilePaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TilePaletteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilePaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
