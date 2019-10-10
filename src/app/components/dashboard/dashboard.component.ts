import {
  Component, OnInit
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { UserServiceService } from 'src/app/services/user-service.service';
import { NoteService } from 'src/app/services/note.service';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  token: String;
  notes: any;
  hide: Boolean = false;
  hideLogo: Boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private titleService: Title, private breakpointObserver: BreakpointObserver,
    private usrSvc: UserServiceService, private noteSvc: NoteService) {
    this.setTitle('Dashboard');
  }

  ngOnInit(): void {
    this.usrSvc.currentMessage.subscribe(token => this.token = token);
    this.notes = this.noteSvc.fetchAllNotes(this.token);
    console.log(this.notes);
  }

  changeHide() {
    this.hide = !this.hide;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}
