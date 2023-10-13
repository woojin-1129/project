package com.work.worktogether.vo.sign;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class SignVo {
    private int sno;
    private String creDate;
    private String finalDate;
    private String rejection;
    private String employeeNumber;
    private String status;
    private String kind;

    private EmployeesVo employees;
}
