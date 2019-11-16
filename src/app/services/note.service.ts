import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';


@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpServiceService) { }

  fetchAllNotes(): any {
    return this.http.get('notes/getNotesList');
  }

  saveNote(data) {
    return this.http.post("notes/addNotes", data);
  }

  deleteNote(data) {
    return this.http.post("notes/trashNotes", data);
  }

  changeNoteColor(data) {
    return this.http.post("notes/changesColorNotes", data);
  }

  archiveNote(data) {
    return this.http.post("notes/archiveNotes", data);
  }

  deleteForever(data) {
    return this.http.post("notes/deleteForeverNotes", data);
  }

  updateNote(data) {
    return this.http.post("notes/updateNotes", data);
  }

  pinUnpinNotes(data) {
    return this.http.post("notes/pinUnpinNotes", data);
  }

  addLabel(id, data) {
    return this.http.post("notes/" + id + "/noteLabels", data);
  }

  fetchAllLabel() {
    return this.http.get("noteLabels/getNoteLabelList");
  }

  deleteLabelFromNote(data: any) {
    return this.http.post("notes/" + data.noteId + "/addLabelToNotes/" + data.labelId + "/remove", data);
  }

  deleteLabel(data: any) {
    return this.http.delete("noteLabels/" + data.id + "/deleteNoteLabel", data);
  }

  addExistingLabel(data) {
    return this.http.post("notes/" + data.noteId + "/addLabelToNotes/" + data.lableId + "/add", data);
  }

  getNotesOfLabel(data) {
    return this.http.post("notes/getNotesListByLabel/" + data.labelName, data);
  }

  addLabelWithoutNote(data) {
    return this.http.post("noteLabels", data);
  }

  updateLabel(data) {
    return this.http.post("noteLabels/" + data.id + "/updateNoteLabel", data);
  }

  addCollaborator(id, data) {
    return this.http.post("notes/" + id + "/AddcollaboratorsNotes", data);
  }

  removeCollaborator(noteId, collaboratorId) {
    return this.http.delete("notes/" + noteId + "/removeCollaboratorsNotes/" + collaboratorId, {});
  }

  addCheckList(note, data) {
    return this.http.post("notes/" + note.id + "/noteCheckLists", data);
  }

  updateCheckList(data) {
    return this.http.post("notes/" + data.notesId + "/checklist/" + data.id + "/update", data);
  }

  addReminder(data) {
    return this.http.post("notes/addUpdateReminderNotes", data);
  }

  fetchAllReminderNotes() {
    return this.http.get("notes/getReminderNotesList");
  }

  removeReminder(data) {
    return this.http.post("notes/removeReminderNotes", data);
  }

  getNotesDetail(noteId) {
    return this.http.get("notes/getNotesDetail/" + noteId);
  }

  addQuestion(data) {
    return this.http.post('questionAndAnswerNotes/addQuestionAndAnswer', data);
  }

  rateQuestion(data) {
    return this.http.post("questionAndAnswerNotes/rate/" + data.parentId, data);
  }

  likeUnlikeQuestion(data) {
    return this.http.post("questionAndAnswerNotes/like/" + data.parentId, data);
  }

  getArchivedNotes() {
    return this.http.get("notes/getArchiveNotesList");
  }

  getDeletedNotes() {
    return this.http.get("notes/getTrashNotesList");
  }
}
