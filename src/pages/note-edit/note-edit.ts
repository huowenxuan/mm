import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserService} from "../../providers/user-service";
import {ControllersService} from "../../providers/controllers-service";
import {LCStorageProvider} from "../../providers/lc-storage";
import {NoteService, Note} from "../../providers/note-service";
import {MarkdownPage} from "../markdown/markdown";

@IonicPage()
@Component({
  selector: 'page-note-edit',
  templateUrl: 'note-edit.html',
})
export class NoteEditPage {
  @ViewChild('content') content: any;
  title = '新建'
  start: Date = new Date() // start必须有初始值，否则无法转换为本地时间
  end = new Date()
  input = ''
  oldNote: Note
  startPicker
  endPicker
  startEnable = false // 控制是否添加start

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              public userService: UserService,
              public noteService: NoteService,
              public ctrls: ControllersService) {
    this.oldNote = this.navParams.get('note')
    if (this.oldNote) {
      this.title = '编辑'
      this.input = this.oldNote.attributes.text
      this.end = this.oldNote.attributes.end
      this.start = this.oldNote.attributes.start || this.end

      this.startEnable = !!this.oldNote.attributes.start
    }

    this.startPicker = this.dateToISO(this.start)
    this.endPicker = this.dateToISO(this.end)
  }

  ionViewDidLoad() {

  }

  isoToDate(isoString: string): Date {
    if (!isoString) return null
    return new Date(new Date(isoString).getTime() - 8*3600*1000)
  }

  dateToISO(date: Date): string {
    if (!date) return null
    return new Date(date.getTime() + 8*3600*1000).toISOString()
  }

  upToNow() {
    let end = new Date()
    this.endPicker = this.dateToISO(end)
  }

  async save() {
    this.start = this.isoToDate(this.startPicker)
    this.end = this.isoToDate(this.endPicker)

    if (!this.input) return

    let onSuccess = this.navParams.get('onSuccess')
    let loader = this.ctrls.loading()
    loader.present()

    try {
      let newNote
      let start = this.start
      if (!this.startEnable) {
        start = null
      }

      if (this.oldNote) {
        newNote = await this.noteService.updateNote(this.oldNote.id, this.input, start, this.end)
      } else {
        newNote = await this.noteService.createNote(this.userService.userId, start, this.end, this.input)
      }
      loader.dismiss()
      onSuccess && onSuccess(newNote)
      this.ctrls.toast('保存成功').present()
      this.navCtrl
        .push(MarkdownPage, {
          note: newNote,
          markdown: newNote.attributes.text
        }, {animate: false})
        .then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        });

    } catch (e) {
      loader.dismiss()
      console.log(e)
      this.ctrls.toast('保存失败').present()
    }
  }

  command(cmd) {
    this.input += cmd
  }
}
