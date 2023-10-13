package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.work.worktogether.dao.CalendarDao;
import com.work.worktogether.vo.CalendarVo;

@RestController
public class CalendarController {

    @Autowired
    private CalendarDao dao;

    // 일정추가
    @RequestMapping("/calendar_addEvent")
    public int addEvent(@RequestBody CalendarVo vo) {
        int addedEvent = dao.insertEvent(vo);
        return addedEvent;
    }

    // 일정 조회
    @RequestMapping("/calendar_selectAll")
    public List<CalendarVo> selectAll(CalendarVo vo) {
        List<CalendarVo> list = dao.selectAll(vo);
        return list;
    }

    // 일정 수정
    @RequestMapping("/calendar_modify")
    public String modify(@RequestBody CalendarVo vo) {
        String updateEvent = dao.modify(vo);
        return updateEvent;
    }

    // 일정 삭제
    @RequestMapping("/calendar_delete")
    public String delete(int id) {
        String msg = "";
        msg = dao.delete(id);
        return msg;
    }
}
