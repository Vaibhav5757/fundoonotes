import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from 'src/app/services/note.service';
import { FormControl } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user-service.service';
import { forEach } from '@angular/router/src/utils/collection';

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
      createdDate: "",
      message: "",
      like: [{
        userId: "",
        like: false
      }],
      rate: [
        {
          userId: "",
          rate: null
        }
      ]
    }],
  };
  editorContent = new FormControl('', []);

  rating = [0, 0, 0, 0, 0];
  likes = 0;
  yourLike: Boolean = false;

  constructor(private route: ActivatedRoute,
    private noteSvc: NoteService,
    private userSvc: UserServiceService) {

    // Retrieve the note Id from params
    this.route.paramMap.subscribe(params => {
      this.noteId = params.get("noteId");
    })
  }

  ngOnInit() {
    this.getNote();

    // Get Rating
    let limit = 0 || this.note.questionAndAnswerNotes[0].rate[0].rate;
    for (let itr = 0; itr < limit; ++itr) {
      this.rating[itr] = 1;
    }
  }

  getNote() {
    // Fetch the note
    let obs = this.noteSvc.getNotesDetail(this.noteId);
    // Save the note details
    obs.subscribe((response: any) => {
      this.note = response.data.data[0];
      this.getRatingAndLikes();
    })
  }

  getRatingAndLikes() {
    this.yourLikeOrNot();
    this.getLikes();
    this.getRating();
    console.log("Likes: " + this.likes);
    console.log("Your Like: " + this.yourLike);
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
    let limit = 0 || this.note.questionAndAnswerNotes[0].rate[0].rate;
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
}
