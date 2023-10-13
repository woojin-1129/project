package com.work.worktogether.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;


import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.DepartmentVo;
import com.work.worktogether.vo.EmployeesVo;

@Component
public class OcDao {
    SqlSession session;
    public OcDao(){
        session = MybaFactory.getFactory().openSession();
    }

    public List<DepartmentVo> selectDepart() {
        return session.selectList("oc.selectDepart");
    }

    public List<DepartmentVo> selectDepartTest(String findStr) {
        return session.selectList("oc.selectDepartTest" , findStr);
    }

    public List<EmployeesVo> selectEmployeeDepart(String departCode) {
        return session.selectList("oc.selectEmployeeDepart", departCode);
    }
    public List<EmployeesVo> selectEmployeeDepartTest(Map<String,Object> tempMap) {
        return session.selectList("oc.selectEmployeeDepartTest", tempMap);
    }
   
}
