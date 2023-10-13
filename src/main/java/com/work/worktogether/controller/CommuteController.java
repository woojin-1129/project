package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.CommuteDao;
import com.work.worktogether.vo.commute.CommuteCountVo;
import com.work.worktogether.vo.commute.CommuteVo;
import com.work.worktogether.vo.page.PageCommute;

@RestController
public class CommuteController {

    @Autowired
    CommuteDao dao;

    @RequestMapping("/commute")
    public ModelAndView commute(PageCommute page) {
        ModelAndView mv = new ModelAndView();
        List<CommuteVo> list = dao.selectToDay(page);
        CommuteCountVo vo = dao.totCount();
        page = dao.getPage();
        mv.addObject("list", list);
        mv.addObject("page", page);
        mv.addObject("vo", vo);
        mv.setViewName("employees/commute");
        return mv;
    }

    @RequestMapping("/commuteTotal")
    public ModelAndView commuteToDay(PageCommute page) {
        ModelAndView mv = new ModelAndView();
        List<CommuteVo> list = dao.select(page);
        CommuteCountVo vo = dao.totCount();
        page = dao.getPage();
        mv.addObject("list", list);
        mv.addObject("page", page);
        mv.addObject("vo", vo);
        mv.setViewName("employees/commute");
        return mv;
    }
}
