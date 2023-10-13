package com.work.worktogether.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.work.worktogether.dao.NoteDao;
import com.work.worktogether.vo.NoteVo;
import com.work.worktogether.vo.page.Page;

@RestController
public class NoteController {
  @Autowired
  NoteDao dao;

  // get_note.html 로그인한 사번에 해당하는 받은쪽지 가져오기
  @RequestMapping("/get_note")
  public ModelAndView note(Page page) {
    ModelAndView mv = new ModelAndView();
    List<NoteVo> list = new ArrayList<>();
    list = dao.selectAll(page);
    mv.addObject("list", list);
    mv.addObject("page", page);
    mv.setViewName("layout/get_note");
    return mv;
  }

  // send_note.html 로그인한 사번에 해당하는 받은쪽지 가져오기
  @RequestMapping("/send_note")
  public ModelAndView sendNote(Page page) {
    ModelAndView mv = new ModelAndView();
    List<NoteVo> list = new ArrayList<>();
    list = dao.sendSelectAll(page);
    mv.addObject("list", list);
    mv.addObject("page", page);
    mv.setViewName("layout/send_note");
    return mv;
  }

  // 안읽은 쪽지 갯수 업데이트
  @RequestMapping("/updateUnRead")
  public int updateUnRead(NoteVo vo){
    int unRead = 0;
    unRead = dao.updateUnRead(vo);
    return unRead;
  }

  // 쪽지쓰기 -> 자동완성 (이름,사번,직급 조회)
  @GetMapping("/autocomplete")
  @ResponseBody
  public List<String> autoComplete(@RequestParam String term) {
    List<String> autoCompleteList = new ArrayList<>();
    autoCompleteList = dao.autoComplete(term);
    return autoCompleteList;
  }

  // 쪽지쓰기 - Modal창 보내기버튼
  @RequestMapping("/sendNote.do")
  public String sendNote(String getEmployee, String doc, String sendEmployee) {
    String msg = "";
    NoteVo nVo = new NoteVo();
    nVo.setDoc(doc);
    nVo.setGetEmployee(getEmployee);
    nVo.setSendEmployee(sendEmployee);
    msg = dao.sendNote(nVo);
    return msg;
  }

  // 삭제로직
  @PostMapping("/deleteNotes")
  public Map<String, Object> deleteNotes(@RequestBody List<Integer> snoArray) {
    Map<String, Object> resultMap = new HashMap<>();
    try {
      int deletedCount = dao.deleteNotesBySno(snoArray);
      resultMap.put("success", true);
      resultMap.put("message", deletedCount + "개의 쪽지가 삭제되었습니다.");
    } catch (Exception e) {
      resultMap.put("success", false);
      resultMap.put("message", "삭제 중 오류가 발생했습니다.");
    }
    return resultMap;
  }

  // view 모달창
  @GetMapping("/viewData")
  public NoteVo view(int sno) {
    NoteVo vo = dao.view(sno);
    return vo;
  }
  @GetMapping("/sendViewData")
  public NoteVo sendView(int sno) {
    NoteVo vo = dao.sendView(sno);
    return vo;
  }
}
