package com.work.worktogether.dao;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.CalendarVo;

@Component
public class CalendarDao {
  SqlSession session;

  public CalendarDao() {
    session = MybaFactory.getFactory().openSession();
  }

  // 일정추가
  public int insertEvent(CalendarVo vo) {
    int id = 0;
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.KOREA);
    try {
      String startDate = vo.getStart();
      String endDate = vo.getEnd();

      LocalDateTime sqlStartDate = LocalDateTime.parse(startDate, dateTimeFormatter);
      LocalDateTime sqlEndDate = LocalDateTime.parse(endDate, dateTimeFormatter);


      vo.setStart(sqlStartDate.toString());
      vo.setEnd(sqlEndDate.toString());
      int cnt = session.insert("calendar.insertEvent", vo);
      if (cnt > 0) {
        id = session.selectOne("calendar.selectLastInsertId"); // 쿼리로 마지막에 추가된 ID 값을 가져옴
        if(id > 0){
          session.commit();
        }

      } else {
        session.rollback();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return id;
  }

  // 일정조회
  public List<CalendarVo> selectAll(CalendarVo vo) {
    List<CalendarVo> list = session.selectList("calendar.selectAll",vo);
    return list;
  }

  // 일정수정
  public String modify(CalendarVo vo) {
    String msg = "";
    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.KOREA);
    try {
      String startDate = vo.getStart();
      String endDate = vo.getEnd();
      LocalDateTime sqlStartDate = LocalDateTime.parse(startDate, dateTimeFormatter);
      LocalDateTime sqlEndDate = LocalDateTime.parse(endDate, dateTimeFormatter);

      vo.setStart(sqlStartDate.toString());
      vo.setEnd(sqlEndDate.toString());

      int cnt = session.insert("calendar.modify", vo);
      if (cnt > 0) {
        msg = "일정 수정 성공!";
        session.commit();
      } else {
        session.rollback();
      }
    } catch (Exception e) {
      e.printStackTrace();
      msg = "일정 수정 실패";
    }
    return msg;
  }

  public String delete(int id) {
    String msg = "";
    int cnt = 0;
    try {
      cnt = session.delete("calendar.delete", id);
      if (cnt > 0) {
        msg = "삭제 성공!";
        session.commit();
      } else {
        session.rollback();
      }
    } catch (Exception ex) {
      ex.printStackTrace();
      msg = "삭제 실패 오류 발생";
    }
    return msg;
  }
}
