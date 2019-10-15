import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public defaultColors1: string[] = [
    '#ffffff',
    '#BDD561',
    '#3e6158'
  ];

  public defaultColors2: string[] = [
    '#3f7a89',
    '#96c582',
    '#b7d5c4'
  ];

  public defaultColors3: string[] = [
    '#bcd6e7',
    '#7c90c1',
    '#9d8594'
  ];

  ngOnInit(): void {
    this.user = this.userSvc.getUser();
  }

  user: any;
  hide: Boolean = false;
  hideSearchSection: Boolean = false;
  hideLogo: Boolean = false;
  advancedUser: Boolean = true;
  layout: Boolean = false;// false for row view, true for column view

  events = new EventEmitter();

  noteColor = new FormControl('#FFFFFF');
  
  changeColor(paint){
    this.noteColor.setValue(paint);
  }

  title = new FormControl('', [
    Validators.required
  ])

  content = new FormControl('', [
  ])

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private titleService: Title, private breakpointObserver: BreakpointObserver,
    private noteSvc: NoteService, private router: Router, private userSvc: UserServiceService,
    private route: ActivatedRoute) {
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
      description: this.content.value,
      color: this.noteColor.value
    }
    let obs = this.noteSvc.saveNote(data);

    obs.subscribe(response => {
      // Note Saved in database
      this.events.emit("note-saved-in-database");
    })

    this.title.setValue("");
    this.content.setValue("");
    this.noteColor.setValue("#FFFFFF");
  }

  openNotes() {
    this.hideSearchSection = false;
    this.router.navigate(["notes"], { relativeTo: this.route });
  }

  openArchive() {
    this.hideSearchSection = true;
    this.router.navigate(["archived"], {
      relativeTo: this.route
    });
  }

  openBin() {
    this.hideSearchSection = true;
    this.router.navigate(["deleted"], {
      relativeTo: this.route
    });
  }

  changeLayout(){
    this.layout = !this.layout;
    this.events.emit('change-layout');
  }

  logOut(){
    this.userSvc.changeUser("");
    this.router.navigateByUrl("/login");
  }

  addAccount(){
    this.router.navigateByUrl("/register");
  }
}