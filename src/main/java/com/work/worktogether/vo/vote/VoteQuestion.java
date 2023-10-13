package com.work.worktogether.vo.vote;

import java.util.List;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class VoteQuestion {
  int sno;
  String title;
  String employeeNumber;
  String startDate;
  String endDate;
  String typeValue;
  String[] selectDoc;

  List<VoteSelect> voteSelect;
  List<VoteList> voteList;
  List<VoteList> mySelect;

  EmployeesVo employees;
}
