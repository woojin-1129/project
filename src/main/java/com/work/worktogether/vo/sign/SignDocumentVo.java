package com.work.worktogether.vo.sign;

import com.work.worktogether.vo.EmployeesVo;

import lombok.Data;

@Data
public class SignDocumentVo {
    int sno , signSno;
    String employeeNumber, empChecked;
    
    EmployeesVo employees;
}
