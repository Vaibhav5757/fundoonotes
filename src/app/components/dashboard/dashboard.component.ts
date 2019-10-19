import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

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

  user: any;
  hide: Boolean = false;
  hideSearchSection: Boolean = false;
  hideLogo: Boolean = false;
  advancedUser: Boolean;//true for advanced user, false for basic user
  layout: Boolean = false;// false for row view, true for column view

  events = new EventEmitter();

  noteColor = new FormControl('#FFFFFF');

  isPinned: Boolean = false;

  changeColor(paint) {
    this.noteColor.setValue(paint);
  }

  title = new FormControl('', [
    Validators.required
  ])

  content = new FormControl('', [
  ])

  mobileQuery: MediaQueryList;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(private titleService: Title,
    private noteSvc: NoteService, private router: Router, private userSvc: UserServiceService,
    private route: ActivatedRoute, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private snackBar: MatSnackBar) {
    this.setTitle('Dashboard');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    //Get User Details from login api
    this.user = this.userSvc.getUser();

    //Identify the type of user - basic or advanced - from details in database
    let obs = this.userSvc.getUserDetails(this.user.userId);
    obs.subscribe((response: any) => {
      if (response.service === 'basic') this.advancedUser = false;
      else this.advancedUser = true;

      //Notify the components whether user is basic or advanced
      if (!this.advancedUser) this.events.emit('user-is-basic');
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  changeHide() {
    this.hide = !this.hide;
  }

  pinUnpinNote() {
    this.isPinned = !this.isPinned;
  }

  getBackgroundColor() {
    return this.noteColor.value;
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  saveNote() {
    if (this.title.valid) {
      let data = {
        title: this.title.value,
        description: this.content.value,
        color: this.noteColor.value,
        isPined: this.isPinned
      }

      let obs = this.noteSvc.saveNote(data);
      obs.subscribe(response => {
        // Note Saved in database
        this.events.emit("note-saved-in-database");
      })
    } else {
      this.snackBar.open('Note title cannot be empty', '', {
        duration: 1500
      })
    }
    this.title.setValue("");
    this.content.setValue("");
    this.noteColor.setValue("#FFFFFF");
    this.isPinned = false;
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

  changeLayout() {
    this.layout = !this.layout;
    this.events.emit('change-layout');
  }

  getLayout() {
    return this.layout;
  }

  logOut() {
    this.userSvc.logOut();
    this.router.navigateByUrl("/login");
  }

  addAccount() {
    this.router.navigateByUrl("/home");
  }
}