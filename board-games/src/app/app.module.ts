import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CsgoBoardGameComponent } from './components/csgo-board-game/csgo-board-game.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { TileComponent } from './components/csgo-board-game/tile/tile.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardPieceComponent } from './components/csgo-board-game/board-piece/board-piece.component';
import { BoardComponent } from './components/csgo-board-game/board/board.component';
import { BoardPiecePaletteComponent } from './components/csgo-board-game/board-piece-palette/board-piece-palette.component';
import { TilePaletteComponent } from './components/csgo-board-game/tile-palette/tile-palette.component';
import { MapFunctionsComponent } from './components/csgo-board-game/map-functions/map-functions.component';
import { MapDimensionSettingsComponent } from './components/csgo-board-game/map-dimension-settings/map-dimension-settings.component';
import { LandingDialogComponent } from './components/csgo-board-game/dialogs/landing-dialog/landing-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CsgoBoardGameComponent,
    TileComponent,
    BoardPieceComponent,
    BoardComponent,
    BoardPiecePaletteComponent,
    TilePaletteComponent,
    MapFunctionsComponent,
    MapDimensionSettingsComponent,
    LandingDialogComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([AppEffects]),
    AngularSvgIconModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
