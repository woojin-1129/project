package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.NotionDao;
import com.work.worktogether.vo.notion.NotionReplVo;
import com.work.worktogether.vo.notion.NotionVo;
import com.work.worktogether.vo.page.Page;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class NotionController {
  @Autowired
  NotionDao dao;

  @RequestMapping("/notionCreate")
  public ModelAndView notionCreate() {
    ModelAndView mv = new ModelAndView();
    mv.setViewName("/notion/notionCreate");
    return mv;
  }

  @RequestMapping("/notionListR")
  public ModelAndView notionList(Page page) {
    ModelAndView mv = new ModelAndView();
    List<NotionVo> list = dao.select(page);
    page = dao.getPage();
    mv.addObject("list", list);
    mv.addObject("page", page);
    mv.setViewName("/notion/notionList");
    return mv;
  }

  @RequestMapping(value = "/notionCreateR", method = RequestMethod.POST)
  public String notionCreateR(@RequestParam("attFile") List<MultipartFile> mul,
      @ModelAttribute NotionVo vo,
      @ModelAttribute Page page, HttpSession session) {
    String msg = "";
    msg = dao.notionCreateR(vo, mul, session);
    return msg;
  }

  @RequestMapping("/notionView")
  public ModelAndView view(int sno, Page page) {
    ModelAndView mv = new ModelAndView();
    NotionVo vo = dao.view(sno);
    mv.addObject("vo", vo);
    mv.addObject("page", page);
    mv.setViewName("/notion/notionView");
    return mv;
  }

  @RequestMapping("/notionDeleteR")
  public String deleteR(NotionVo vo) {
    String msg = "";
    msg = dao.deleteR(vo);
    return msg;
  }

  @RequestMapping("/notionModify")
  public ModelAndView modify(int sno, Page page) {
    ModelAndView mv = new ModelAndView();
    NotionVo vo = dao.view(sno); // 편집할 데이터를 가져옴
    mv.addObject("vo", vo);
    mv.addObject("page", page);
    mv.setViewName("/notion/notionModify");
    return mv;
  }

  @RequestMapping(value = "/notionModifyR", method = RequestMethod.POST)
  public String modifyR(@RequestParam("attFile") List<MultipartFile> mul,
      @ModelAttribute NotionVo vo,
      @ModelAttribute Page page) {
    String msg = "";
    msg = dao.modifyR(vo, mul);
    return msg;
  }

  @RequestMapping("/notionRepl")
  public ModelAndView notionRepl(int sno) {
    ModelAndView mv = new ModelAndView();
    List<NotionReplVo> list = dao.replSelect(sno);
    mv.addObject("list", list);
    mv.setViewName("/notion/notionRepl");
    return mv;
  }

  @RequestMapping("/notionReplR")
  public String notionReplR(@ModelAttribute NotionReplVo vo , HttpSession session) {
    vo.setEmployeeNumber((String) session.getAttribute("employeeNumber"));
    String msg = "";
    msg = dao.replR(vo);
    return msg;
  }

  @RequestMapping("/notionReplDelete")
  public String notionReplDelete(int sno) {
    String msg = "";
    msg = dao.notionReplDelete(sno);
    return msg;
  }

  @RequestMapping("/notionReplModify")
  public String notionReplModify(
  @ModelAttribute NotionReplVo vo) {
    String msg = "";
    msg = dao.notionReplModify(vo);
    return msg;
  }

}
