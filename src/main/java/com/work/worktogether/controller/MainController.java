package com.work.worktogether.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.ProfileDao;
import com.work.worktogether.vo.EmployeesVo;

import jakarta.servlet.http.HttpSession;

@RestController
public class MainController {

    @Autowired
    ProfileDao dao;

    @RequestMapping("/")
    public ModelAndView index(HttpSession session) {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("login/login");
        if (session.getAttribute("employeeNumber") != null) {
            EmployeesVo vo = dao.profileSelect(session.getAttribute("employeeNumber").toString());
            mv.addObject("vo", vo);
            mv.setViewName("index");
        }
        return mv;
    }
    
    @RequestMapping("/calendar")
    public ModelAndView calendar() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("layout/calendar");
        return mv;
    }
}
