package com.work.worktogether.vo.commute;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class CommuteVo {
    private int sno;
    private String employeeNumber;
    private String goWork;
    private String leaveWork;

    private String name;

    private EmployeesVo employees;
}
