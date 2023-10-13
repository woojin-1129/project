package com.work.worktogether.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.commute.CommuteCountVo;
import com.work.worktogether.vo.commute.CommuteVo;
import com.work.worktogether.vo.page.PageCommute;

@Component
public class CommuteDao {

    SqlSession session;
    PageCommute page;

    public CommuteDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public List<CommuteVo> select(PageCommute page) {
        int totSize = getTotSize(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<CommuteVo> list = session.selectList("commute.select", page);
        return list;
    }

    public int getTotSize(PageCommute page) {
        int totSize = session.selectOne("commute.totSize", page);
        return totSize;
    }

    public PageCommute getPage() {
        return this.page;
    }

    public CommuteCountVo totCount() {
        CommuteCountVo vo = new CommuteCountVo();
        vo.setCurrent(session.selectOne("commute.currentDate"));
        vo.setTotEmployees(session.selectOne("commute.totEmployees"));
        vo.setGoWorkEmployees(session.selectOne("commute.goWorkEmployees", vo));
        vo.setLeaveWorkEmployees(session.selectOne("commute.leaveWorkEmployees", vo));

        return vo;
    }
    
    public List<CommuteVo> selectToDay(PageCommute page) {
        page.setCurrent(session.selectOne("commute.currentDate"));
        int totSize = getToDayTotSize(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<CommuteVo> list = session.selectList("commute.toDaySelect", page);
        return list;
    }

        public int getToDayTotSize(PageCommute page) {
        int totSize = session.selectOne("commute.toDayTotSize", page);
        return totSize;
    }
}
