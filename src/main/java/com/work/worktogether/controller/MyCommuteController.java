package com.work.worktogether.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.MyCommuteDao;
import com.work.worktogether.vo.page.Page;

import jakarta.servlet.http.HttpSession;

@RestController
public class MyCommuteController {
  @Autowired
  MyCommuteDao dao;

  @RequestMapping("/workCommute")
  public ModelAndView workCommute(Page page , HttpSession session){
    ModelAndView mv = new ModelAndView();
    page.setEmployeeNumber(session.getAttribute("employeeNumber").toString());
    mv.addObject("list", dao.commuteSelect(page));
    page = dao.getPage();
    mv.addObject("page", page);
    mv.setViewName("employees/myCommute");
    return mv;
  }

  @RequestMapping("/workPrint")
  public String workPrint(HttpSession session){
    String msg ="";
    String emp = session.getAttribute("employeeNumber").toString();
    msg = dao.workPrint(emp);
    return msg;
  }
  @RequestMapping("/workGo")
  public void workGo(HttpSession session){
    String emp = session.getAttribute("employeeNumber").toString();
    dao.workGo(emp);
  }
  @RequestMapping("/workExit")
  public String workExit(HttpSession session){
    String msg ="";
    String emp = session.getAttribute("employeeNumber").toString();
    msg = dao.workExit(emp);
    return msg;
  }
  @RequestMapping("/workLeave")
  public void workLeave(HttpSession session){
    String emp = session.getAttribute("employeeNumber").toString();
    dao.workLeave(emp);
  }

}
