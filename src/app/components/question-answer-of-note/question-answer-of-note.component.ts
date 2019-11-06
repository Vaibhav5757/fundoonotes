import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-question-answer-of-note',
  templateUrl: './question-answer-of-note.component.html',
  styleUrls: ['./question-answer-of-note.component.scss']
})
export class QuestionAnswerOfNoteComponent implements OnInit {

  noteId = null;
  note = {
    user: {
      firstName: null,
      lastName: null
    },
    title: null,
    description: null,
    noteCheckLists: [],
    questionAndAnswerNotes: [{
      id: "",
      userId: "",
      name: "",
      createdDate: "",
      message: "",
      user: {
        firstName: "",
        lastName: "",
        imageUrl: ""
      },
      like: [{
        userId: "",
        like: false
      }],
      rate: [
        {
          userId: "",
          rate: 0
        }
      ]
    }],
  };
  editorContent = new FormControl('', []);

  likes = 0;
  profileImage: any;
  randomProfileImage: any;
  replyHide: Boolean = false;

  constructor(private route: ActivatedRoute,
    private noteSvc: NoteService,
    private userSvc: UserServiceService,
    private router: Router,
    private dash: DashboardComponent,
    private titleService: Title) {

    // Retrieve the note Id from params
    this.route.paramMap.subscribe(params => {
      this.noteId = params.get("noteId");
    })
  }

  ngOnInit() {
    this.getNote();
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getNote() {
    // Fetch the note
    let obs = this.noteSvc.getNotesDetail(this.noteId);
    // Save the note details
    obs.subscribe((response: any) => {
      this.note = response.data.data[0];
      this.getRatingAndLikes();
      this.setTitle(this.note.title);
    })
  }

  getRatingAndLikes() {
    this.randomUser();
    this.profileImage = this.dash.profileImage;
  }

  removeHtmlTag(string) {
    string = string.replace('&#39;', "'");
    return string.replace(/<[^>]*>?/gm, '');
  }

  checkListStatus(list) {
    return list.status === "close" ? true : false;
  }

  checkListChange(list) {
    if (list.status === "open") list.status = "close"
    else list.status = "open"
    this.noteSvc.updateCheckList(list);
  }

  askQuestion() {
    let obs = this.noteSvc.addQuestion({
      message: this.removeHtmlTag(this.editorContent.value),
      notesId: this.noteId
    })
    obs.subscribe((response) => {
      this.getNote();
    }, (error) => {
      console.log(error);
    })
    this.editorContent.setValue("");
  }

  likeQuestion(item) {
    let obs = this.noteSvc.likeUnlikeQuestion({
      like: true,
      parentId: item.id
    })
    obs.subscribe((response) => {
      this.getNote();
    })
  }

  unLikeQuestion(item) {
    let obs = this.noteSvc.likeUnlikeQuestion({
      like: false,
      parentId: item.id
    })
    obs.subscribe((response) => {
      this.getNote();
    })
  }

  redirectToNotes() {
    this.router.navigateByUrl("/dashboard");
    this.dash.hideSearchSection = false;
  }

  randomUser() {
    let obs = this.userSvc.randomUser();
    obs.subscribe((response: any) => {
      this.randomProfileImage = response.results[0].picture.large;
    })
  }

  toggleReplyHide() {
    this.replyHide = !this.replyHide;
  }

  rating(item) {
    let array = [0, 0, 0, 0, 0];
    let limit = 0;
    let you = this.dash.user;
    if (item.rate[0] != null) {
      item.rate.forEach(element => {
        if (element.userId == you.userId) limit = element.rate;
      });
    }
    for (let itr = 0; itr < limit; ++itr) {
      array[itr] = 1;
    }
    return array;
  }


  changeRating(index, item) {
    index++;
    let obs = this.noteSvc.rateQuestion({
      rate: index,
      parentId: item.id
    })
    obs.subscribe((response) => {
      this.getNote();
    })
  }

  youLike(item) {
    let you = this.dash.user;
    let returnValue = false;
    item.like.forEach(element => {
      if (element.userId === you.userId) returnValue = element.like;
    });
    return returnValue;
  }

  getLikes(item) {
    let count = 0;
    item.like.forEach(element => {
      if (element.like) count++;
    });
    return count;
  }
}
