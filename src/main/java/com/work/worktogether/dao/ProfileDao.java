package com.work.worktogether.dao;


import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.EmployeesVo;

@Component
public class ProfileDao {
    SqlSession session;

    public ProfileDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public EmployeesVo profileSelect(String employeeNumber) {
        EmployeesVo vo = session.selectOne("profile.profileSelect", employeeNumber);
        return vo;
    }

    public String profileModifyR(EmployeesVo vo) {
        String msg = "";
        int cnt = session.update("profile.profileModifyR", vo);
        if (cnt > 0) {
            session.commit();
        } else {
            msg = "정보수정중 오류발생";
            session.rollback();
        }
        return msg;
    }
}
