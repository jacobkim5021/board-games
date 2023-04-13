import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFunctionsComponent } from './map-functions.component';

describe('MapFunctionsComponent', () => {
  let component: MapFunctionsComponent;
  let fixture: ComponentFixture<MapFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapFunctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
