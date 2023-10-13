package com.work.worktogether.vo.vote;

import lombok.Data;

@Data
public class VoteList {
  int sno;
  int pSno;
  String value;
  String employeeNumber;

  int count;
}
