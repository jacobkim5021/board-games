import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDimensionSettingsComponent } from './map-dimension-settings.component';

describe('MapDimensionSettingsComponent', () => {
  let component: MapDimensionSettingsComponent;
  let fixture: ComponentFixture<MapDimensionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDimensionSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDimensionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
