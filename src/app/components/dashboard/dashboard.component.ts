import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar, MatDialog, MatMenuTrigger } from '@angular/material';
import { EditLabelComponent } from '../edit-label/edit-label.component';
import { AddCollaboratorInNewNoteComponent } from '../add-collaborator-in-new-note/add-collaborator-in-new-note.component';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';

@Component({
  selector: 'app-components/dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('triggerElement') trigger: MatMenuTrigger;

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
  hideCheckListCard: Boolean = false;
  hideSearchSection: Boolean = false;
  hideLogo: Boolean = false;
  advancedUser: Boolean;//true for advanced user, false for basic user
  layout: Boolean = false;// false for row view, true for column view
  allLabels = [];
  checkList = [];
  inputLabels = [];
  reminder: any;
  minDate: Date;
  profileImage: String = "https://www.w3schools.com/howto/img_avatar.png";

  search = new FormControl('', []);

  myDatePicker = new FormControl(new Date(), []);
  myTimePicker = new FormControl('', []);

  events = new EventEmitter();

  noteColor = new FormControl('#FFFFFF');

  checkListInput = new FormControl('', []);

  editCheckListInput = new FormControl('', [
    Validators.required
  ])

  label = new FormControl('', []);

  isPinned: Boolean = false;
  isArchived: Boolean = false;
  randomProfilePicture: any;

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
    private dialog: MatDialog) {

    this.setTitle('Dashboard');

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.events.addListener('label-modified', () => {
      this.fetchAllLabels();
    })
  }

  ngOnInit(): void {
    //Get User Details from login api
    this.user = this.userSvc.getUser();

    // this.randomUser();
    this.fetchUserProfilePic();

    this.user.collaborators = [];

    this.minDate = new Date();
    this.myTimePicker.setValue(this.getCurrentTime());
    this.reminder = null;


    //Identify the type of user - basic or advanced - from details in database
    let obs = this.userSvc.getUserDetails(this.user.userId);
    obs.subscribe((response: any) => {
      if (response.service === 'basic') this.advancedUser = false;
      else this.advancedUser = true;

      //Notify the components whether user is basic or advanced
      if (!this.advancedUser) this.events.emit('user-is-basic');
    })

    // Get All labels
    this.fetchAllLabels();
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

  archiveUnarchiveNote() {
    this.isArchived = !this.isArchived;
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
        isPined: this.isPinned,
        isArchived: this.isArchived
      }

      let obs = this.noteSvc.saveNote(data);
      obs.subscribe(response => {
        // Note Saved in database
        this.events.emit("note-saved-in-database");

        if (this.checkList.length > 0) {
          this.events.emit("checklist-present-in-note");
        }

        if (this.user.collaborators.length > 0) {
          this.events.emit("Collaborators-exist-in-new-note");
        }

        if (this.inputLabels.length > 0) {
          this.events.emit("label-exist-in-note");
        }

        if (this.reminder != null) {
          this.events.emit("reminder-exist-in-note");
        }
      })
    } else {
      //Snackbar was present here
    }
    this.title.setValue("");
    this.content.setValue("");
    this.noteColor.setValue("#FFFFFF");
    this.isPinned = false;
    this.isArchived = false;
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

  cart() {
    this.hideSearchSection = true;
    this.router.navigate(['shoppingCart'], {
      relativeTo: this.route
    })
  }

  logOut() {
    this.userSvc.logOut();
    this.router.navigateByUrl("/login");
  }

  addAccount() {
    this.router.navigateByUrl("/home");
  }

  fetchAllLabels() {
    this.allLabels = [];
    let obs = this.noteSvc.fetchAllLabel();
    obs.subscribe((response: any) => {
      this.allLabels = response.data.details;
    })
  }

  deleteLabel(label) {
    let obs = this.noteSvc.deleteLabel({
      id: label.id
    })
    obs.subscribe((response) => {
      this.fetchAllLabels();
      this.events.emit('label-modified');
    })
  }

  redirectToLabel(label) {
    this.hideSearchSection = true;
    this.router.navigate(["notesByLabel/" + label.label], {
      relativeTo: this.route
    })
  }

  openEditor() {
    let obs = this.dialog.open(EditLabelComponent, {
      data: this.allLabels,
      width: "250px",
      panelClass: "dialogBox"
    })
    obs.afterClosed().subscribe(result => {
      this.fetchAllLabels();
      this.events.emit('label-modified');
    })
  }

  searchNotes(event: any) {
    // this.events.emit(event.target.value);
    if (event.key == "Backspace") {
      this.events.emit("searching-backward");
    } else {
      this.events.emit("searching-forward");
    }
  }

  addCheckList(event: any) {
    if (event.key == "Enter") {
      this.checkList.push(this.checkListInput.value);
      this.checkListInput.setValue("");
    }
  }

  // @ViewChild('text', { read: ElementRef }) ref: ElementRef;
  // editCheckListItem(index) {
  //   this.checkList[index] = this.ref.nativeElement.value;
  //   this.ref.nativeElement.value = "";
  // }

  deleteListItem(item) {
    this.checkList = this.checkList.filter(obj => obj != item);
  }

  addCollaborator(user) {
    let obs = this.dialog.open(AddCollaboratorInNewNoteComponent, {
      width: '1100px',
      panelClass: 'dialogBox',
      data: {
        user: this.user
      }
    })
    obs.afterClosed().subscribe((response) => {
      this.user = response.user.user;
    })
  }

  addLabelsFromExistingLabels(label) {
    if (this.inputLabels.includes(label)) {
      this.inputLabels = this.inputLabels.filter(obj => obj != label);
    } else this.inputLabels.push(label);
  }

  addLabel() {
    this.inputLabels.push(this.label.value);
    this.label.setValue("");
  }

  labelPresent(label) {
    return this.inputLabels.includes(label);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  redirectToReminders() {
    this.hideSearchSection = true;
    this.router.navigate(['reminders'], {
      relativeTo: this.route
    })
  }

  getCurrentTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
    if (hours > 12) return hours % 12 + ":" + minutes + " PM"
    else return hours + ":" + minutes + " AM"
  }

  closeMenu() {
    this.trigger.closeMenu();
  }

  addReminderPreSelectedDate(date, time) {
    let selectedDate = date;

    if (date === 'today') {
      selectedDate = new Date();
      selectedDate = this.formatDate(selectedDate);
    }
    if (date === 'tomorrow') {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      selectedDate = currentDate;
      selectedDate = this.formatDate(selectedDate);
    }
    if (date === "nextMonday") {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + (1 + 7 - currentDate.getDay()) % 7);
      selectedDate = currentDate;
      selectedDate = this.formatDate(selectedDate);
    }
    this.saveReminder(selectedDate, time);
  }

  addReminder() {

    let selectedDate = this.formatDate(new Date(this.myDatePicker.value));
    let time = this.myTimePicker.value;

    time = this.convert12into24(time);

    this.saveReminder(selectedDate, time);
  }

  saveReminder(selectedDate, time) {
    let reminder = selectedDate + "T" + time;
    this.reminder = reminder;
  }

  convert12into24(time12h) {
    let [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return hours + ":" + minutes;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  randomUser() {
    let obs = this.userSvc.randomUser();
    obs.subscribe((response: any) => {
      this.profileImage = response.results[0].picture.large;
    })
  }

  fetchUserProfilePic() {
    if (this.user.imageUrl === "") this.randomUser();
    else this.profileImage = "http://fundoonotes.incubation.bridgelabz.com/" + this.user.imageUrl;
  }

  fileChangeEvent(event) {
    let obs = this.dialog.open(ImageCropperComponent, {
      data: event,
      width: "500px",
      height: "420px"
    })
    obs.afterClosed().subscribe((response) => {
      let fd = new FormData();
      fd.append('file', response.data);
      this.userSvc.changeProfilePicture(fd);
    })
  }

  redirectToQuestionAnswers(noteId) {
    // console.log(noteId);
    this.hideSearchSection = true;
    this.router.navigate(["QuestionAnswer/" + noteId], {
      relativeTo: this.route
    })
  }
}