package com.work.worktogether.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.ChatVo;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.Room;

import jakarta.servlet.http.HttpSession;

@Component
public class ChatDao {
    SqlSession session;

    public ChatDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public List<Room> roomSelect(HttpSession httpSession) {
        String employeeNumber = httpSession.getAttribute("employeeNumber").toString();
        List<Room> roomList = session.selectList("chat.roomSelect", employeeNumber);
        return roomList;
    }
    
    public List<ChatVo> roomIn(int roomId) {
        List<ChatVo> chat = session.selectList("chat.roomIn", roomId);
        return chat;
    }

    public List<Room> roomCnt(int roomId) {
        return session.selectList("chat.roomCnt", roomId);
    }

    public String insertChat(ChatVo vo) {
        String msg = "";
        int cnt = session.update("chat.roomTimeUpdate", vo);
        cnt = session.insert("chat.insertChat", vo);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
            msg = "에러";
        }
        return msg;
    }
    
    public EmployeesVo chatUserSelect(String userId) {
        EmployeesVo vo = session.selectOne("chat.chatUserSelect" , userId);
        return vo;
    }

    public ChatVo lastChat(ChatVo vo) {
        vo = session.selectOne("chat.lastChat", vo);
        return vo;
    }

    public List<EmployeesVo> inviteSearch(String find, String[] emp) {
        Map<String, Object> map = new HashMap<>();
        map.put("find", find);
        map.put("emp", emp);
        List<EmployeesVo> list = session.selectList("chat.inviteSearch", map);
        return list;
    }

    public String invite(Room room) {
        String msg = "";
        String roomTitle = session.selectOne("chat.roomS", room.getRoomId());
        room.setRoomTitle(roomTitle);
        int cnt = session.insert("chat.invite", room);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
            msg = "에러";
        }
        return msg;
    }

    public String roomOut(Room room) {
        String msg = "";
        int cnt = session.delete("chat.roomOut", room);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
            msg = "에러";
        }
        return msg;
    }
    
    public String roomCreate(Room room) {
        String msg = "";
        int roomId = session.selectOne("chat.getRoomId");
        room.setRoomId(roomId+1);
        int cnt = session.insert("chat.roomCreate", room);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
            msg = "에러";
        }
        return msg;
    }
}
