package com.work.worktogether.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.VoteDao;
import com.work.worktogether.vo.vote.VoteList;
import com.work.worktogether.vo.vote.VoteQuestion;
import com.work.worktogether.vo.vote.VoteSelect;

import jakarta.servlet.http.HttpSession;

@RestController
public class VoteController {
	@Autowired
	VoteDao dao;

	@RequestMapping("/voteList")
	public ModelAndView voteList() {
		ModelAndView mv = new ModelAndView();
		mv.addObject("list", dao.voteMainList());
		mv.setViewName("/vote/voteList");
		return mv;
	}

	@RequestMapping("/voteCreate")
	public ModelAndView voteCreate() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("/vote/voteCreate");
		return mv;
	}

	@RequestMapping("/voteView")
	public ModelAndView voteResult(int sno) {
		ModelAndView mv = new ModelAndView();
		mv.addObject("vo", dao.view(sno));
		mv.setViewName("/vote/voteView");
		return mv;
	}

	@RequestMapping("/selectView")
	public ModelAndView selectView(int sno, HttpSession session) {
		ModelAndView mv = new ModelAndView();
		List<VoteList> list = dao.selectView(sno, session);
		if (list.size() == 0) {
			VoteQuestion vo = dao.selectTime(sno);
			String pattern = "yyyy-MM-dd HH:mm:ss";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
			String temp = simpleDateFormat.format(new Date());
			LocalDateTime time = LocalDateTime.parse(temp, DateTimeFormatter.ofPattern(pattern));
			LocalDateTime endDate = LocalDateTime.parse(vo.getEndDate(), DateTimeFormatter.ofPattern(pattern));

			if (endDate.isAfter(time)) {
				mv.addObject("vo", dao.view(sno));
				mv.setViewName("/vote/voteView");
			} else {
				mv.addObject("vo", dao.result(sno , session));
				mv.setViewName("/vote/voteResult");
			}

		} else {
			mv.addObject("vo", dao.result(sno , session));
			mv.setViewName("/vote/voteResult");
		}
		return mv;
	}

	@RequestMapping("/voteResultView")
	public ModelAndView voteResultView(int sno , HttpSession session) {
		ModelAndView mv = new ModelAndView();
		mv.addObject("vo", dao.result(sno , session));
		mv.setViewName("/vote/voteResult");
		return mv;
	}

	@RequestMapping(value = "/voteResult", method = RequestMethod.POST)
	public String voteResult(int sno, String typeValue, HttpSession session, VoteSelect vo) {
		String msg = "";
		vo.setEmployeeNumber((String) session.getAttribute("employeeNumber"));
		vo.setPSno(sno);
		msg = dao.voteResult(vo, typeValue);
		return msg;
	}

	@RequestMapping(value = "/voteCreateR", method = RequestMethod.POST)
	public String voteCreateR(
			@ModelAttribute VoteQuestion vo, HttpSession session) {
		vo.setEmployeeNumber((String) session.getAttribute("employeeNumber"));
		String msg = "";
		msg = dao.voteCreateR(vo);
		return msg;
	}

	@RequestMapping("/voteDelete")
	public String voteDelete(int sno) {
		String msg = "";
		msg = dao.voteDelete(sno);
		return msg;
	}

}
