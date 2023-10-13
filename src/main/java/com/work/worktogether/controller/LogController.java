package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.LogDao;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.log.LogVo;
import com.work.worktogether.vo.page.Page;

import jakarta.servlet.http.HttpSession;

@RestController
public class LogController {

    @Autowired
    LogDao dao;

    @RequestMapping("/bossZone")
    public ModelAndView bossZone(Page page , String ty) {
        ModelAndView mv = new ModelAndView();
        List<LogVo> list = dao.find(page);
        page = dao.getPage();
        mv.addObject("page", page);
        mv.addObject("list", list);
        mv.addObject("ty", ty);
        mv.setViewName("boss/boss");
        return mv;
    }

    @RequestMapping("/commandCk")
    public String commandCk(String doc, String logType, HttpSession session) {
        String emp = session.getAttribute("employeeNumber").toString();
        EmployeesVo empVo = tierOneSelect();
        String msg = "";
        if (emp != empVo.getEmployeeNumber()) {
            msg = dao.commandCk(doc, logType, session);
        }
        return msg;
    }

    @RequestMapping("/tierOneSelect")
    public EmployeesVo tierOneSelect() {
        EmployeesVo vo = dao.tierOneSelect();
        return vo;
    }

    @RequestMapping("/logInsert")
    public void logInsert(LogVo log, HttpSession session) {
        String emp = session.getAttribute("employeeNumber").toString();
        EmployeesVo empVo = tierOneSelect();
        log.setEmployeeNumber(emp);
        if (!emp.equals(empVo.getEmployeeNumber())) {
            dao.logInsert(log);
        }
    }
    
    @RequestMapping("/hrmNameSelect")
    public EmployeesVo hrmNameSelect(int sno) {
        EmployeesVo vo = dao.hrmNameSelect(sno);
        return vo;
    }

    @RequestMapping("/bossAttendance")
    public ModelAndView bossAttendance(Page page , String ty) {
        ModelAndView mv = new ModelAndView();
        List<LogVo> list = dao.bossAttendance(page);
        page = dao.getPage();
        mv.addObject("page", page);
        mv.addObject("ty", ty);
        mv.addObject("list", list);
        mv.setViewName("boss/boss");
        return mv;
    }

    @RequestMapping("/bossDoc")
        public ModelAndView bossDoc(Page page , String ty) {
        ModelAndView mv = new ModelAndView();
        List<LogVo> list = dao.bossDoc(page);
        page = dao.getPage();
        mv.addObject("page", page);
        mv.addObject("ty", ty);
        mv.addObject("list", list);
        mv.setViewName("boss/boss");
        return mv;
    }
}
