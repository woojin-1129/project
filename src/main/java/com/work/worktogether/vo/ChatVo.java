package com.work.worktogether.vo;

import lombok.Data;

@Data
public class ChatVo {
    private int sno ,pSno;
    private String employeeNumber, creDate, doc;

    private long start, end;

    private EmployeesVo employees;
}
