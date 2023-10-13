package com.work.worktogether.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalendarVo {
  private String employeeNumber;
	private String teamCode;
	private String departCode;

	private int id;
	private String groupId;
	private String title;
	private String writer;
	private String content;
	private String start;
	private String end;
  private boolean allDay;
	private String textColor;
	private String backgroundColor;

}
// backgroundColor,allday,departCode,teamCode