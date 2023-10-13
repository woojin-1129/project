package com.work.worktogether.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.AdminVo;
import com.work.worktogether.vo.EmployeesVo;

import jakarta.servlet.http.HttpSession;

@Component
public class LoginDao {

    SqlSession session;

    public LoginDao() {
        session = MybaFactory.getFactory().openSession();
    }

    // 로그인 DAO
    public String loginCheck(HttpSession httpSession, EmployeesVo eVo) {
        String msg = "";
        eVo.setId(eVo.getId().trim());
        eVo.setPwd(eVo.getPwd().trim());

        try {
            EmployeesVo log = session.selectOne("login.loginCheck", eVo);
            if (log.getEmployeeNumber() != null) {

                httpSession.setAttribute("id", log.getId());
                httpSession.setAttribute("name", log.getName());
                httpSession.setAttribute("employeeNumber", log.getEmployeeNumber());
                httpSession.setAttribute("comName", log.getComName());
                httpSession.setAttribute("departCode", log.getDepartCode());
                httpSession.setAttribute("teamCode", log.getTeamCode());

                try {
                    AdminVo admin = session.selectOne("login.admin", log.getEmployeeNumber());
                    if (admin.getEmployeeNumber() != null) {
                        httpSession.setAttribute("admin", admin.getEmployeeNumber());
                    }
                } catch (Exception ex) {}
            } else {
                throw new Exception(msg);
            }
        } catch (Exception ex) {          
            msg = "아이디나 패스워드가 일치하지 않습니다.";
        }
        return msg;
    }
}
