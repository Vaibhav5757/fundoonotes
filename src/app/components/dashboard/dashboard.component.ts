import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service'

@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  hide: Boolean = false;
  hideLogo: Boolean = false;
  advancedUser: Boolean = true;

  title = new FormControl('', [
    Validators.required
  ])

  content = new FormControl('', [
  ])

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private titleService: Title, private breakpointObserver: BreakpointObserver, private noteSvc: NoteService) {
    this.setTitle('Dashboard');
  }

  changeHide() {
    this.hide = !this.hide;
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  saveNote() {
    let data = {
      title: this.title.value,
      description: this.content.value
    }
    this.noteSvc.saveNote(data);
    this.title.setValue("");
    this.content.setValue("");
  }
}