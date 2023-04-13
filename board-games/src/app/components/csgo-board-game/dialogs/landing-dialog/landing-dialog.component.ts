import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { enterLobby, setMapEditorMode } from 'src/app/store/csgo-board-game/csgo-board-game.actions';
import { State } from 'src/app/store/reducers';

@Component({
  selector: 'app-landing-dialog',
  templateUrl: './landing-dialog.component.html',
  styleUrls: ['./landing-dialog.component.scss']
})
export class LandingDialogComponent implements OnInit {
  usernameFormControl: FormControl;
  isUsernameValid: boolean;

  constructor(
    public dialogRef: MatDialogRef<LandingDialogComponent>,
    private store: Store<State>,
  ) { }

  ngOnInit(): void {
    this.usernameFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
    ]);
  }

  onClearUsername(): void {
    this.usernameFormControl.setValue('');
  }

  onClickMapEditor(): void {
    this.dialogRef.close();
    this.store.dispatch(setMapEditorMode({ mapEditorMode: true }));
  }

  onClickEnterLobby(): void {
    if (this.usernameFormControl.valid) {
      this.store.dispatch(enterLobby({ username: this.usernameFormControl.value }));
      this.dialogRef.close();
    }
  }
}
