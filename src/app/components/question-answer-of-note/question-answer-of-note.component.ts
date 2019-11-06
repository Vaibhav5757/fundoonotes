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

  rating = [0, 0, 0, 0, 0];
  likes = 0;
  yourLike: Boolean = false;
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

    // Get Rating
    let limit;
    if (this.note.questionAndAnswerNotes[0].rate[0] != null) {
      limit = this.note.questionAndAnswerNotes[0].rate[0].rate;
    } else limit = 0;
    for (let itr = 0; itr < limit; ++itr) {
      this.rating[itr] = 1;
    }
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
    this.yourLikeOrNot();
    this.getLikes();
    this.getRating();
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

  getLikes() {
    this.likes = 0;
    this.note.questionAndAnswerNotes.forEach((element) => {
      element.like.forEach(element => {
        if (element.like) this.likes++;
      })
    })
  }

  getRating() {
    let limit = 0;
    if (this.note.questionAndAnswerNotes[0].rate[0] != null) {
      limit = this.note.questionAndAnswerNotes[0].rate[0].rate;
    }
    //reset the ratings array
    for (let itr = 0; itr < this.rating.length; ++itr) {
      this.rating[itr] = 0;
    }
    for (let itr = 0; itr < limit; ++itr) {
      this.rating[itr] = 1;
    }
  }

  changeRating(index) {
    index++;
    let obs = this.noteSvc.rateQuestion({
      rate: index,
      parentId: this.note.questionAndAnswerNotes[0].id
    })
    obs.subscribe((response) => {
      this.getNote();
    })
  }

  likeUnlikeQuestion() {
    let obs = this.noteSvc.likeUnlikeQuestion({
      like: !this.yourLike,
      parentId: this.note.questionAndAnswerNotes[0].id
    })
    obs.subscribe((response) => {
      this.getNote();
    })
  }

  yourLikeOrNot() {
    let user = this.userSvc.getUser();
    let userId = user.userId;
    this.note.questionAndAnswerNotes.forEach(element => {
      element.like.forEach(element => {
        if (element.userId === userId) this.yourLike = element.like;
      });
    });
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
}
