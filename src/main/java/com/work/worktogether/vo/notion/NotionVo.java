package com.work.worktogether.vo.notion;

import java.util.List;

import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.FileContentVo;

import lombok.Data;

@Data
public class NotionVo {
  
private int sno;
private int hit;
private String title;
private String doc;
private String creDate;
private String modiDate;
private String employeeNumber;
private int attCnt;
List<FileContentVo> attFiles;
String[] delFile;

private EmployeesVo employees;

}
