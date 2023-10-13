package com.work.worktogether.vo.log;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class LogVo {
    private int sno;
    private String employeeNumber, doc, finalDate, logType;

    private EmployeesVo employees;
}
