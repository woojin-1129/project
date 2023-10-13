package com.work.worktogether.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.ProfileDao;
import com.work.worktogether.vo.EmployeesVo;

import jakarta.servlet.http.HttpSession;

@RestController
public class ProfileController {

    @Autowired
    ProfileDao dao;

    @RequestMapping("/profileModify")
    public ModelAndView profileModify(HttpSession session) {
        ModelAndView mv = new ModelAndView();
        String employeeNumber = session.getAttribute("employeeNumber").toString();
        EmployeesVo vo = dao.profileSelect(employeeNumber);
        mv.addObject("vo", vo);
        mv.setViewName("employees/employModify");
        return mv;
    }

    @RequestMapping("/profileModifyR")
    public String profileModifyR(@ModelAttribute EmployeesVo vo) {
        String msg = dao.profileModifyR(vo);
        return msg;
    }
}
