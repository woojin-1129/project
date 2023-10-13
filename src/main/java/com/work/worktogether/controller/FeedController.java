package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.FeedDao;
import com.work.worktogether.vo.FileContentVo;
import com.work.worktogether.vo.feed.FeedListVo;
import com.work.worktogether.vo.feed.FeedVo;

import jakarta.servlet.http.HttpSession;

@RestController
public class FeedController {
    @Autowired
    FeedDao dao;

    @RequestMapping("/boardList")
    public ModelAndView boardList(@RequestParam(required = false) String code, String feedName, HttpSession session) {
        ModelAndView mv = new ModelAndView();
        String employeeNumber = (String) session.getAttribute("employeeNumber");

        code = dao.findCodes(code, employeeNumber);
        String feedList = dao.feedName(code);//게시판 이름 정하기
        //String feedCode = dao.feedCode(code);
        List<FeedVo> list = dao.peedView(code);
        List<FileContentVo> attFile = dao.fileView(code);

        mv.addObject("feedName", feedName);
        mv.addObject("feedList", feedList);
        mv.addObject("list", list);
        mv.addObject("attFile", attFile);
        mv.addObject("code", code);
        mv.addObject("joinCode", code);
        mv.setViewName("/board/board");

        return mv;
    }
    
    @RequestMapping("/mainListB")
    public ModelAndView mainListB(@RequestParam(required = false) String joinCode, String code, String employeeNumber,
            String feedName) {
        ModelAndView mv = new ModelAndView();
        String codes = dao.findCodes(code, employeeNumber); // 코드찾기
        String feedList = dao.feedName(codes);// 게시판 이름 정하기
        List<FeedVo> list = dao.peedView(codes);
        List<FileContentVo> attFile = dao.fileView(codes);

        mv.addObject("feedName", feedName);
        mv.addObject("feedList", feedList);
        // mv.addObject("feedCode", feedCode);
        mv.addObject("list", list);
        mv.addObject("attFile", attFile);
        mv.addObject("joinCode", joinCode);
        mv.addObject("code", codes);
        mv.addObject("employeeNumber", employeeNumber);
        mv.setViewName("/board/board");

        return mv;
    }

    @RequestMapping(value = "/feedRegister",method = RequestMethod.POST)
    public String feedRegister(@RequestParam("attFile") List<MultipartFile> mul, //@RequestParam("attFile") List<MultipartFile> mul ,추가 
            @ModelAttribute FeedVo vo, HttpSession session) {
        vo.setEmployeeNumber(session.getAttribute("employeeNumber").toString());
        String msg = dao.register(vo , mul); //,mul추가
        return msg;
    }

    @RequestMapping("/feedDelete")
    public String feedDelete(@ModelAttribute FeedVo vo) {
        String msg = "";
        msg = dao.delete(vo);
        return msg;
    }
    
    @RequestMapping("/feedList")
    public List<FeedListVo> feedList(@RequestParam String code) {
        List<FeedListVo> list;
        list = dao.feedList(code);

        return list;
    }
    
    @RequestMapping("/callDates")
    public List<FeedVo> callDates(@RequestParam String code) {
        List<FeedVo> list;
        list = dao.callDate(code);
        return list;
    }
}
