package com.work.worktogether.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.commute.CommuteVo;
import com.work.worktogether.vo.page.Page;

@Component
public class MyCommuteDao {
	SqlSession session;

	Page page;

	public MyCommuteDao() {
		session = MybaFactory.getFactory().openSession();
	}

	public List<CommuteVo> commuteSelect(Page page) {
		List<CommuteVo> list = null;
		int totSize = getTotSize(page);
		page.setTotSize(totSize);
		page.pageCompute();
		this.page = page;
		list = session.selectList("commute.mySelect", page);
		return list;
	}

	public int getTotSize(Page page) {
		int totSize = session.selectOne("commute.myTotSize", page);
		return totSize;
	}

	public Page getPage() {
		return this.page;
	}

	public String workPrint(String emp) {
		String msg = "";
		int cnt = session.selectOne("commute.workPrint", emp);
		if (cnt > 0) {
			cnt = session.selectOne("commute.workExit" , emp);
			if (cnt > 0) {
				msg = "퇴근하셨습니다.";
			} else {
				msg = "출근중입니다.";
			}
		}
		return msg;
	}

	public void workGo(String emp) {
		int cnt = session.insert("commute.insert", emp);
		if (cnt > 0) {
			session.commit();
		} else {
			session.rollback();
		}
	}

	public String workExit(String emp) {
		String msg = "";
		int cnt = session.selectOne("commute.workExit", emp);
		if (cnt > 0) {
			msg = "퇴근하셨습니다.";
		} else {
			cnt = session.selectOne("commute.workPrint", emp);
			if (cnt < 1) {
				msg = "출근을 먼저 진행해주세요.";
			}
		}
		return msg;
	}

	public void workLeave(String emp) {
		int cnt = session.update("commute.update", emp);
		if (cnt > 0) {
			session.commit();
		} else {
			session.rollback();
		}
	}
}
