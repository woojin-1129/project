package com.work.worktogether.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.log.CommandVo;
import com.work.worktogether.vo.log.LogVo;
import com.work.worktogether.vo.page.Page;

import jakarta.servlet.http.HttpSession;

@Component
public class LogDao {

    SqlSession session;
    Page page;

    public LogDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public String commandCk(String doc, String logType, HttpSession httpSession) {
        String msg = "";
        List<CommandVo> list = session.selectList("log.commandCk");
        for (CommandVo vo : list) {
            if (doc.contains(vo.getCommandText()) || doc.equals(vo.getCommandText())) {
                LogVo v = new LogVo();
                v.setEmployeeNumber(httpSession.getAttribute("employeeNumber").toString());
                v.setDoc(doc);
                v.setLogType(logType);
                int cnt = session.insert("log.logInsert", v);
                if (cnt > 0) {
                    session.commit();
                    msg = "저장";
                } else {
                    session.rollback();
                }
                break;
            }
        }
        return msg;
    }

    public EmployeesVo tierOneSelect() {
        EmployeesVo vo = session.selectOne("log.tierOneSelect");
        return vo;
    }

    public void logInsert(LogVo log) {
        int cnt = session.insert("log.logInsert2", log);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
        }
    }

    public EmployeesVo hrmNameSelect(int sno) {
        EmployeesVo vo = session.selectOne("log.hrmNameSelect", sno);
        return vo;
    }

    public List<LogVo> find(Page page) {
        int totSize = getTotSize1(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<LogVo> list = session.selectList("log.find", page);
        return list;
        
    }

    public int getTotSize1(Page page) {
        int totSize = session.selectOne("log.totSize1", page);
        return totSize;
    }
        public int getTotSize2(Page page) {
        int totSize = session.selectOne("log.totSize2", page);
        return totSize;
    }
        public int getTotSize3(Page page) {
        int totSize = session.selectOne("log.totSize3", page);
        return totSize;
    }

    public Page getPage() {
        return this.page;
    }

    public List<LogVo> bossAttendance(Page page) {
        int totSize = getTotSize2(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<LogVo> list = session.selectList("log.bossAttendance", page);
        return list;
    }

    public List<LogVo> bossDoc(Page page) {
        int totSize = getTotSize3(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<LogVo> list = session.selectList("log.bossDoc", page);
        return list;
    }
}
