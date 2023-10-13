package com.work.worktogether.vo.notion;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class NotionReplVo {
    private int sno;
    private int serial;
    private String creDate;
    private String doc;
    private int notionSno;
    private String employeeNumber;

    private EmployeesVo employees;
    private NotionVo notionPsno;

}
