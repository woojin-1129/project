package com.work.worktogether.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteVo {
  int sno;
  String name;
  String sendEmployee; // 사번
  String getEmployee;
  String doc;
  String sendDate;
  String readDate;
  String tierName;
  int unRead;

  
  public NoteVo() {}


  public NoteVo(int sno, String sendEmployee, String getEmployee, String doc, String sendDate, String readDate) {
    this.sno = sno;
    this.sendEmployee = sendEmployee;
    this.getEmployee = getEmployee;
    this.doc = doc;
    this.sendDate = sendDate;
    this.readDate = readDate;
  }

  
}
