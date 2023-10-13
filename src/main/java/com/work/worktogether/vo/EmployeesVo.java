package com.work.worktogether.vo;

import lombok.Data;

@Data
public class EmployeesVo {
    private int sno;
    private String employeeNumber;
    private String dirNumber;
    private String comName;
    private String id;
    private String pwd;
    private String name;
    private int tier;
    private String email;
    private String tel;
    private String phone;
    private String zipcode;
    private String address1;
    private String address2;
    private String teamCode;
    private String departCode;
    private String birthday;
    private String joinCompany;
    private String oriPhoto;
    private String sysPhoto;

    private int unRead;
    
    private TeamVo team;
    private DepartmentVo department;
    private TierCodeVo tierCode;
}