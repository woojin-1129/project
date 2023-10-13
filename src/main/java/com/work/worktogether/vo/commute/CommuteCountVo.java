package com.work.worktogether.vo.commute;

import lombok.Data;

@Data
public class CommuteCountVo {

    private String current; // 오늘날짜
    
    private int totEmployees; // 총인원
    private int goWorkEmployees; // 오늘 출근
    private int leaveWorkEmployees; // 오늘퇴근
}
