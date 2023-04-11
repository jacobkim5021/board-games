import { NgModule, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BoardPieceComponent } from './components/csgo-board-game/board-piece/board-piece.component';
import { BoardComponent } from './components/csgo-board-game/board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    CsgoBoardGameComponent,
    TileComponent,
    BoardPieceComponent,
    BoardComponent,
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
    DragDropModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
