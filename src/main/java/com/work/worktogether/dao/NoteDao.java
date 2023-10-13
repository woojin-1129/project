package com.work.worktogether.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.NoteVo;
import com.work.worktogether.vo.page.Page;

@Component
public class NoteDao {
  SqlSession session;
  Page page;

  public NoteDao() {
    session = MybaFactory.getFactory().openSession();
  }

  // 안읽은 쪽지갯수 업데이트
  public int updateUnRead(NoteVo vo) {
    int unRead = session.selectOne("note.unRead", vo);
    return unRead;
  }

  // 쪽지쓰기 - input창 검색어 자동완성
  public List<String> autoComplete(String term) {
    String tier = "";
    List<Map<String, Object>> list = session.selectList("note.autoCompleteList", term);
    List<String> result = new ArrayList<>();

    for (Map<String, Object> map : list) {
      Object nameObj = map.get("name");
      Object employeeNumberObj = map.get("employeeNumber");
      Object tierObj = map.get("tier");
      if (tierObj.equals(1)) {
        tier = "대표";
      } else if (tierObj.equals(2)) {
        tier = "부장";
      } else if (tierObj.equals(3)) {
        tier = "팀장";
      } else if (tierObj.equals(4)) {
        tier = "대리";
      } else if (tierObj.equals(5)) {
        tier = "사원";
      }

      if (nameObj instanceof String || employeeNumberObj instanceof String) {
        result.add((String) nameObj + " " + " ( " + tier + " / " + (String) employeeNumberObj + " )");
      }
    }
    return result;
  }

  // 쪽지쓰기 - 보내기 버튼
  public String sendNote(NoteVo nVo) {
    String msg = "";
    int cnt = 0;

    // 받을사람,sno,보낸사람,내용,보낸날짜
    cnt = session.insert("note.sendNote", nVo);
    if (cnt > 0) {
      session.commit();
    } else {
      msg = "전송 실패";
      session.rollback();
    }
    return msg;
  }

  // 받은 쪽지함 list 전부 가져오기 synchronized = 동시접근 방지
  public synchronized List<NoteVo> selectAll(Page page) {
    int totSize = getTotSize(page);
    page.setTotSize(totSize);
    page.pageCompute();
    this.page = page;
    List<NoteVo> list = session.selectList("note.selectAll", page);

    return list;
  }

  // 받은쪽지함 Page 전체 사이즈 계산
  public int getTotSize(Page page) {
    int totSize = session.selectOne("note.totSize", page);
    return totSize;
  }

  // 보낸 쪽지함 list 전부 가져오기 synchronized = 동시접근 방지
  public synchronized  List<NoteVo> sendSelectAll(Page page) {
    int totSize = sendGetTotSize(page);
    page.setTotSize(totSize);
    page.pageCompute();
    this.page = page;
    List<NoteVo> list = session.selectList("note.sendSelectAll", page);

    return list;
  }

  // 보낸쪽지함 Page 전체 사이즈 계산
  public int sendGetTotSize(Page page) {
    int totSize = session.selectOne("note.sendTotSize", page);
    return totSize;
  }

  // 삭제하기
  public int deleteNotesBySno(List<Integer> snoArray) {
    int cnt = 0;
    cnt = session.delete("note.deleteNotesBySno", snoArray);
    if (cnt > 0) {
      session.commit();
    } else {
      session.rollback();
    }
    return cnt;
  }

  // View 모달창
  public NoteVo view(int sno) {
    // 읽음처리
    int read = session.update("note.read", sno);
    if (read > 0) {
      session.commit();
    } else {
      session.rollback();
    }

    
    // view 데이터 가져오기
    NoteVo viewVo = session.selectOne("note.view", sno);

    // 안읽은 갯수 업데이트
    viewVo.setSno(sno);
    int unRead = session.selectOne("note.unRead", viewVo);
    viewVo.setUnRead(unRead);
    return viewVo;
  }

  // View 모달창
  public NoteVo sendView(int sno) {
    // 읽음처리
    int read = session.update("note.read", sno);
    if (read > 0) {
      session.commit();
    } else {
      session.rollback();
    }

    // view 데이터 가져오기
    NoteVo viewVo = session.selectOne("note.sendView", sno);
    return viewVo;
  }
}
