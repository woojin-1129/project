package com.work.worktogether.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.vote.VoteList;
import com.work.worktogether.vo.vote.VoteQuestion;
import com.work.worktogether.vo.vote.VoteSelect;

import jakarta.servlet.http.HttpSession;

@Component
public class VoteDao {
  SqlSession session;

  public VoteDao() {
    session = MybaFactory.getFactory().openSession();
  }

  public VoteQuestion view(int sno) {
    VoteQuestion vo = session.selectOne("vote.view", sno);
    EmployeesVo emp = session.selectOne("vote.empSelect", vo.getEmployeeNumber());
    List<VoteSelect> list = session.selectList("vote.selectList", sno);
    vo.setVoteSelect(list);
    vo.setEmployees(emp);
    return vo;
  }

  public VoteQuestion result(int sno , HttpSession httpSession) {
    VoteQuestion vo = session.selectOne("vote.view", sno);
    EmployeesVo emp = session.selectOne("vote.empSelect", vo.getEmployeeNumber());
    List<VoteSelect> list = session.selectList("vote.selectList", sno);
    List<VoteList> voteList = session.selectList("vote.voteList", sno);
    Map<String, Object> map = new HashMap<>();
    map.put("employeeNumber", httpSession.getAttribute("employeeNumber").toString());
    map.put("pSno", sno);
    List<VoteList> mySelect = session.selectList("vote.mySelect", map);
    vo.setVoteSelect(list);
    vo.setVoteList(voteList);
    vo.setEmployees(emp);
    vo.setMySelect(mySelect);
    return vo;
  }

  public String voteResult(VoteSelect vo, String typeValue) {
    String msg = "";
    int cnt = 0;
    switch (typeValue) {
      case "single":
        cnt = session.insert("vote.insertVoteSelectS", vo);
        break;

      case "multi":
        String[] selectList = vo.getSelectDoc().split(",");
        vo.setSelectArray(selectList);
        cnt = session.insert("vote.insertVoteSelectM", vo);
        break;
    }
    if (cnt > 0) {
      msg = "";
      msg = Integer.toString(vo.getPSno());
      session.commit();
    } else {
      msg = "저장 중 오류 발생";
      session.rollback();
    }
    return msg;
  }

  public String voteCreateR(VoteQuestion vo) {
    String msg = "";
    int cnt = 0;
    try {
      int sno = session.selectOne("vote.getVoteSno", "i");
      vo.setSno(sno);
      cnt = session.insert("vote.register", vo);
      if (cnt < 1) {
        msg = "저장 중 오류 발생";
        throw new Exception(msg);
      }
      cnt = session.insert("vote.insertVoteSelect", vo);
      if (cnt < 1) {
        msg = "저장 중 오류 발생";
        throw new Exception(msg);
      }
      session.commit();
      msg = Integer.toString(sno);
    } catch (Exception ex) {
      msg = ex.getMessage();
      ex.printStackTrace();
      session.rollback();
    }
    return msg;
  }

  public List<VoteQuestion> voteMainList() {
    List<VoteQuestion> list = session.selectList("vote.voteMainList");
    return list;
  }

  public List<VoteList> selectView(int sno, HttpSession httpSession) {
    Map<String, Object> map = new HashMap<>();
    map.put("pSno", sno);
    map.put("employeeNumber", (String) httpSession.getAttribute("employeeNumber"));
    List<VoteList> list = session.selectList("vote.selectView", map);
    return list;
  }

  public String voteDelete(int sno) {
    String msg = "";
    int cnt = 0;
    try {
      cnt = session.delete("vote.valueDelete", sno);
      cnt = session.delete("vote.selectDocDelete", sno);
      cnt = session.delete("vote.voteDelete", sno);
      if (cnt < 1) {
        msg = "삭제 중 오류 발생";
        throw new Exception(msg);
      }
      session.commit();
    } catch (Exception ex) {
      msg = ex.getMessage();
      ex.printStackTrace();
      session.rollback();
    }
    return msg;
  }

  public VoteQuestion selectTime(int sno) {
    VoteQuestion vo = session.selectOne("vote.selectTime", sno);
    return vo;
  }
}
