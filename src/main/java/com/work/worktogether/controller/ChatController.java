package com.work.worktogether.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.work.worktogether.dao.ChatDao;
import com.work.worktogether.vo.ChatVo;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.Room;

import jakarta.servlet.http.HttpSession;

@RestController
public class ChatController {

    @Autowired
    ChatDao dao;
    
    @RequestMapping("/room")
    public List<Room> room(HttpSession session) {
        List<Room> room = dao.roomSelect(session);
        return room;
    }

    @RequestMapping("/roomIn")
    public List<ChatVo> roomIn(int roomId) {
        List<ChatVo> chat = dao.roomIn(roomId);
        return chat;
    }

    @RequestMapping("/roomCnt")
    public List<Room> roomCnt(int roomId) {
        return dao.roomCnt(roomId);
    }

    @RequestMapping("/sendMessage")
    public String sendMessage(@ModelAttribute ChatVo vo) {
        String msg = dao.insertChat(vo);
        return msg;
    }

    @RequestMapping("/chatUserSelect")
    public EmployeesVo chatUserSelect(String userId) {
        EmployeesVo vo = dao.chatUserSelect(userId);
        return vo;
    }

    @RequestMapping("/lastChat")
    public ChatVo lastChat(ChatVo vo) {
        vo = dao.lastChat(vo);
        return vo;
    }

    @RequestMapping("/inviteSearch")
    public List<EmployeesVo> inviteSearch(String find , String[] emp) {
        List<EmployeesVo> list = dao.inviteSearch(find , emp);
        return list;
    }

    @RequestMapping("/invite") 
    public String invite(Room room) {
        String msg = dao.invite(room);
        return msg;
    }

    @RequestMapping("/roomOut")
    public String roomOut(Room room) {
        String msg = dao.roomOut(room);
        return msg;
    }

    @RequestMapping("/roomCreate")
    public String roomCreate(Room room) {
        String msg = dao.roomCreate(room);
        return msg;
    }
}
