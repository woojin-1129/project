package com.work.worktogether.vo.feed;

import java.util.List;

import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.FileContentVo;

import lombok.Data;

@Data
public class FeedVo {
    int sno;
    String employeeNumber,code,doc,creDate,creTime,creDay; 

    List<FileContentVo> attFiles;
    String[] delFile;

    public FeedVo(){};
    public FeedVo(String code ,String employeeNumber){
        this.code=code;
        this.employeeNumber = employeeNumber;
    };

    private EmployeesVo employees;
}

