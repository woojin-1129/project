package com.work.worktogether.vo.vote;

import lombok.Data;

@Data
public class VoteSelect {
  int sno;
  int pSno;
  String selectDoc;
  String[] selectArray;
  String employeeNumber;
}
