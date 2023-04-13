import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import exportFromJSON from 'export-from-json';
import { take } from 'rxjs';
import { setCsgoBoardGameMap } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { initialState } from 'src/app/store/csgo-board-game/csgo-board-game.reducer';
import { getStateForExport } from 'src/app/store/csgo-board-game/csgo-board-game.selectors';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-map-functions',
  templateUrl: './map-functions.component.html',
  styleUrls: ['./map-functions.component.scss']
})
export class MapFunctionsComponent implements OnInit {
  @ViewChild('importFileUpload') importFileUploadInput: ElementRef;
  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit(): void { }

  onExportClick(): void {
    this.store.select(getStateForExport).pipe(take(1)).subscribe((state) => {
      exportFromJSON({ data: { ...state }, fileName: 'map', exportType: exportFromJSON.types.json });
    });
  }

  onImportClick(event: any): void {
    const uploadedMapFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(uploadedMapFile, "UTF-8");
    fileReader.onload = () => {
      const newState = JSON.parse(fileReader.result as string);
      this.store.dispatch(setCsgoBoardGameMap(newState));
    }
    fileReader.onerror = (error) => {
      console.log(error)
    }

    this.importFileUploadInput.nativeElement.value = '';
  }

  onResetClick(): void {
    this.store.dispatch(setCsgoBoardGameMap(initialState));
  }
}
