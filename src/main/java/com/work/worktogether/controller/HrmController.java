package com.work.worktogether.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.HrmDao;
import com.work.worktogether.vo.DepartmentVo;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.TeamVo;
import com.work.worktogether.vo.page.Page;



@RestController
public class HrmController {
    @Autowired
    HrmDao dao;

    @RequestMapping("/hrmList")
    public ModelAndView hrmList(Page page) {
        ModelAndView mv = new ModelAndView();
        List<EmployeesVo> list = dao.select(page);
        page = dao.getPage();
        mv.addObject("list", list);
        mv.addObject("page", page);
        mv.setViewName("/hrm/hrmList");
        return mv;
    }

    @RequestMapping("/hrmRegister")
    public ModelAndView hrmRegister(Page page) {
        ModelAndView mv = new ModelAndView();
        LocalDate now = LocalDate.now();
        mv.addObject("tier", dao.allTier());
        mv.addObject("department", dao.allDepartment());
        mv.addObject("date", now);
        mv.addObject("empNum", dao.selectEmployeeNumber());
        mv.addObject("page", page);
        mv.setViewName("/hrm/hrmRegister");
        return mv;
    }

    @RequestMapping("/teamName")
    public List<TeamVo> teamName(String departName) {
        List<TeamVo> list = dao.teamName(departName);
        return list;
    }

    @RequestMapping("/dirNumber")
    public String dirNumber(int tier, String departCode, String teamCode) {
        String msg = dao.dirNumber(tier, departCode, teamCode);
        return msg;
    }

    @RequestMapping(value = "/hrmRegisterR", method = RequestMethod.POST)
    public String registerR(@RequestParam("attFile") List<MultipartFile> mul,
            @ModelAttribute EmployeesVo vo,
            @ModelAttribute Page page) {
        String msg = "";
        msg = dao.registerR(vo, mul);
        return msg;
    }

    @RequestMapping("/hrmView")
    public ModelAndView hrmView(int sno, Page page) {
        ModelAndView mv = new ModelAndView();
        EmployeesVo vo = dao.view(sno);

        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.setViewName("/hrm/hrmView");
        return mv;
    }

    @RequestMapping(value = "/hrmDeleteR", method = RequestMethod.GET)
    public String deleteR(@RequestParam int sno) {
        String msg = dao.deleteR(sno);
        return msg;
    }

    @RequestMapping("/hrmModify")
    public ModelAndView modify(int sno, Page page) {
        ModelAndView mv = new ModelAndView();
        EmployeesVo vo = dao.view(sno); // 편할 데이터를 가져옴
        mv.addObject("tier", dao.allTier());
        mv.addObject("department", dao.allDepartment());
        mv.addObject("team", dao.allTeam(vo.getDepartCode()));
        mv.addObject("vo", vo);
        mv.addObject("page", page);
        mv.setViewName("/hrm/hrmModify");
        return mv;
    }

    @RequestMapping(value = "/hrmModifyR", method = RequestMethod.POST)
    public String modifyR(@RequestParam("attFile") List<MultipartFile> mul,
            @ModelAttribute EmployeesVo vo,
            @ModelAttribute Page page) {
        String msg = "";
        msg = dao.modifyR(vo, mul);
        return msg;
    }

    @RequestMapping("/departAll")
    public List<DepartmentVo> departAll() {
        List<DepartmentVo> list = dao.allDepartment();
        return list;
    }

    @RequestMapping("/teamAll")
    public List<TeamVo> teamAll(String departCode) {
        List<TeamVo> list = dao.allTeam(departCode);
        return list;
    }

    
}
