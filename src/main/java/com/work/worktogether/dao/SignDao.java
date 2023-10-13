package com.work.worktogether.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.EmployeesVo;
import com.work.worktogether.vo.page.Page;
import com.work.worktogether.vo.sign.SignDocumentVo;
import com.work.worktogether.vo.sign.SignPay;
import com.work.worktogether.vo.sign.SignPayValueVo;
import com.work.worktogether.vo.sign.SignPayVo;
import com.work.worktogether.vo.sign.SignVacationVo;
import com.work.worktogether.vo.sign.SignVo;
import com.work.worktogether.vo.sign.SpvVo;

import jakarta.servlet.http.HttpSession;

@Component
public class SignDao {

    SqlSession session;
    Page page;

    public SignDao() {
        session = MybaFactory.getFactory().openSession();
    }

    public List<SignVo> select(Page page) {
        int totSize = getTotSize(page);
        page.setTotSize(totSize);
        page.pageCompute();
        this.page = page;
        List<SignVo> list = session.selectList("sign.signSelect", page);
        return list;
    }

    public int getTotSize(Page page) {
        int totSize = session.selectOne("sign.totSize", page);
        return totSize;
    }

    public Page getPage() {
        return this.page;
    }

    public int selectSno() {
        int sno = session.selectOne("sign.signSno");
        sno += 1;
        return sno;
    }

    public String signPaymentR(SignPayVo payVo, SignPayValueVo valVo, HttpSession httpSession, String kind) {
        SignVo vo = new SignVo();
        String msg = "";
        String emp = httpSession.getAttribute("employeeNumber").toString();
        int sno = 0;
        try {
            sno = session.selectOne("sign.signSno");
            sno += 1;
        } catch (NullPointerException ex) {
            sno = 1;
        }
        payVo.setPSno(sno);
        valVo.setPSno(sno);

        vo.setSno(sno);
        vo.setEmployeeNumber(emp);
        vo.setKind("지출결의서");
        if (kind == "저장") {
            vo.setStatus("대기");
        } else {
            vo.setStatus("임시저장");
        }

        EmployeesVo empVo = session.selectOne("sign.dir", emp);
        SignDocumentVo docVo = new SignDocumentVo();
        docVo.setSignSno(sno);
        int cnt = 0;
        try {
            if (empVo.getTier() != 1 && vo.getStatus() != "임시저장") {
                cnt = session.insert("sign.signInsert", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
                docVo.setEmployeeNumber(empVo.getDirNumber());
            } else if (empVo.getTier() == 1 && vo.getStatus() == "대기") {
                vo.setStatus("승인");
                docVo.setEmployeeNumber(emp);
                String name = session.selectOne("sign.nameSelect", emp);
                docVo.setEmpChecked(name);
                cnt = session.insert("sign.signInsertBoss", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
            } else {
                cnt = session.insert("sign.signInsert", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
            }
            cnt = session.insert("sign.signDocumentInsert", docVo);
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = session.insert("sign.signPayInsert", payVo);
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = signPayValueInsert(valVo);
            if (cnt < 1) {
                throw new Exception();
            }
        } catch (Exception ex) {
            msg = "저장중 오류발생";
            session.rollback();
        }

        session.commit();
        return msg;
    }

    /* 지출결의서 표시 */
    public SignPay signPaymentView(int sno) {
        SignPay vo = new SignPay();
        SignVo sVo = session.selectOne("sign.signView", sno);
        SignPayVo spVo = session.selectOne("sign.signPaymentViewSP", sno);
        List<SpvVo> spvVo = session.selectList("sign.signPaymentViewSPV", sno);
        List<SignDocumentVo> docVo = session.selectList("sign.signDocumentView", sno);

        vo.setSVo(sVo);
        vo.setSpVo(spVo);
        vo.setSpvVo(spvVo);
        vo.setSdVo(docVo);
        return vo;
    }

    /* 승인 */
    public String signCk(HttpSession httpSession, int sno) {
        String msg = "";
        String eNum = httpSession.getAttribute("employeeNumber").toString();

        EmployeesVo empVo = session.selectOne("sign.dir", eNum);
        SignDocumentVo vo = new SignDocumentVo();
        vo.setSignSno(sno);
        vo.setEmployeeNumber(eNum);
        String name = session.selectOne("sign.nameSelect", eNum);
        vo.setEmpChecked(name);

        int cnt = 0;
        try {
            cnt = session.update("sign.signDocumentUpdate", vo);
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = session.update("signCkTime", sno);
            if (cnt < 1) {
                throw new Exception();
            }
            if (empVo.getTier() != 1) {
                vo.setEmployeeNumber(empVo.getDirNumber());
                cnt = session.insert("sign.signDocumentInsert", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
            } else {
                cnt = session.update("sign.signStatusUpdate", sno);
                                if (cnt < 1) {
                    throw new Exception();
                }
            }
        } catch (Exception ex) {
            msg = "승인처리중 오류";
            session.rollback();
        }
        msg = vo.getEmployeeNumber();
        session.commit();
        return msg;
    }

    // 반려 내용 저장
    public String rejectionR(SignVo vo) {
        String msg = "";
        vo.setStatus("반려");
        int cnt = session.update("sign.rejectionR", vo);
        if (cnt > 0) {
            session.commit();
        } else {
            msg = "반려처리중 오류발생";
            session.rollback();
        }
        return msg;
    }

    // 휴가계획서 저장
    public String signVacationR(SignVacationVo vo, HttpSession httpSession, String kind) {
        String msg = "";
        int sno = 0;

        SignVo sVo = new SignVo();
        String emp = httpSession.getAttribute("employeeNumber").toString();

        try {
            sno = session.selectOne("sign.signSno");
            sno += 1;
        } catch (NullPointerException ex) {
            sno = 1;
        }
        vo.setPSno(sno);

        sVo.setSno(sno);
        sVo.setEmployeeNumber(emp);
        sVo.setKind("휴가계획서");
        if (kind == "저장") {
            sVo.setStatus("대기");
        } else {
            sVo.setStatus("임시저장");
        }

        EmployeesVo empVo = session.selectOne("sign.dir", emp);
        SignDocumentVo docVo = new SignDocumentVo();
        docVo.setSignSno(sno);

        int cnt = 0;
        try {
            if (empVo.getTier() != 1 && sVo.getStatus() != "임시저장") {
                cnt = session.insert("sign.signInsert", sVo);
                if (cnt < 1) {
                    throw new Exception();
                }
                docVo.setEmployeeNumber(empVo.getDirNumber());
            } else if (empVo.getTier() == 1 && sVo.getStatus() == "대기") {
                sVo.setStatus("승인");
                                docVo.setEmployeeNumber(emp);
                String name = session.selectOne("sign.nameSelect", emp);
                docVo.setEmpChecked(name);
                cnt = session.insert("sign.signInsertBoss", sVo);
                if (cnt < 1) {
                    throw new Exception();
                }
            } else {
                cnt = session.insert("sign.signInsert", sVo);
                if (cnt < 1) {
                    throw new Exception();
                }
            }
            cnt = session.insert("sign.signDocumentInsert", docVo);
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = session.insert("sign.signVacationInsert", vo);
            if (cnt < 1) {
                throw new Exception();
            }

            session.commit();
        } catch (Exception ex) {
            msg = "저장중 오류발생";
            session.rollback();
        }
        return msg;
    }

    // 휴가계획서 view
    public SignPay signVacationView(int sno) {
        SignPay vo = new SignPay();
        SignVo sVo = session.selectOne("sign.signView", sno);
        SignVacationVo svVo = session.selectOne("sign.signVacationView", sno);
        List<SignDocumentVo> docVo = session.selectList("sign.signDocumentView", sno);

        vo.setSvVo(svVo);
        vo.setSVo(sVo);
        vo.setSdVo(docVo);
        return vo;
    }

    // 제출 버튼 클릭시
    public String signSubmit(int sno, HttpSession httpSession) {
        String msg = "";
        String emp = httpSession.getAttribute("employeeNumber").toString();

        SignVo vo = new SignVo();
        vo.setSno(sno);
        EmployeesVo empVo = session.selectOne("sign.dir", emp);

        int cnt = 0;
        SignDocumentVo docVo = new SignDocumentVo();
        docVo.setSignSno(sno);
        try {
            if (empVo.getTier() != 1) {
                docVo.setEmployeeNumber(empVo.getDirNumber());

                vo.setStatus("대기");
                cnt = session.update("sign.signSubmit", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
                cnt = session.update("sign.signDirUpdate", docVo);
                if (cnt < 1) {
                    throw new Exception();
                }
            } else {
                vo.setStatus("승인");
                cnt = session.update("sign.signSubmitBoss", vo);
                if (cnt < 1) {
                    throw new Exception();
                }
            }
        } catch (Exception ex) {
            msg = "제출중 오류발생";
            session.rollback();
        }

        session.commit();

        return msg;
    }

    // 데이터 삭제
    public String signDelete(int sno, String kind) {
        String msg = "";
        int cnt = 0;
        try {
            cnt = session.delete("sign.signDocumentDelete", sno);
            if (cnt < 1) {
                throw new Exception();
            }
            switch (kind) {
                case "지출결의서":
                    cnt = session.delete("sign.signPayDelete", sno);
                    if (cnt < 1) {
                        throw new Exception();
                    }
                    cnt = session.delete("sign.signPayValueDelete", sno);
                    if (cnt < 1) {
                        throw new Exception();
                    }
                    break;
                case "휴가계획서":
                    cnt = session.delete("sign.signVacationDelete", sno);
                    if (cnt < 1) {
                        throw new Exception();
                    }

                    break;
            }
            cnt = session.delete("sign.signDelete", sno);
            if (cnt < 1) {
                throw new Exception();
            }
        } catch (Exception ex) {
            session.rollback();
            msg = "삭제중 오류발생";
        }

        session.commit();

        return msg;
    }

    // ModelAndView 출력 데이터
    public SignVacationVo signVacationModify(int sno) {
        SignVacationVo vo = session.selectOne("sign.signVacationView", sno);
        return vo;
    }

    // 휴가계획서 내용 수정
    public String signVacationModifyR(SignVacationVo vo) {
        String msg = "";
        int cnt = session.update("sign.signVacationModifyR", vo);
        if (cnt > 0) {
            session.commit();
        } else {
            session.rollback();
            msg = "에러";
        }
        return msg;
    }

    // ModelAndView 출력 데이터
    public SignPay signPaymentModify(int sno) {
        SignPay vo = new SignPay();
        SignPayVo spVo = session.selectOne("sign.signPaymentViewSP", sno);
        List<SpvVo> spvVo = session.selectList("sign.signPaymentViewSPV", sno);

        vo.setSpVo(spVo);
        vo.setSpvVo(spvVo);

        return vo;
    }

    // 지출결의서 내용 수정
    public String signPaymentModifyR(SignPayVo spVo, SignPayValueVo spvVo) {
        String msg = "";
        int cnt = 0;

        try {
            cnt = session.update("sign.signPaymentModifySP", spVo);
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = session.delete("sign.signPayValueDelete", spvVo.getPSno());
            if (cnt < 1) {
                throw new Exception();
            }
            cnt = signPayValueInsert(spvVo);
            if (cnt < 1) {
                throw new Exception();
            }
        } catch (Exception ex) {
            msg = "저장중 오류발생";
            session.rollback();
        }
        session.commit();

        return msg;
    }

    /* 데이터 저장 */
    public int signPayValueInsert(SignPayValueVo spvVo) {
        int cnt = 0;
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i <= spvVo.getBriefs().length - 1; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("pSno", spvVo.getPSno());
            map.put("briefs", spvVo.getBriefs()[i]);
            map.put("amount", spvVo.getAmount()[i]);
            map.put("note", spvVo.getNote()[i]);
            list.add(map);
        }
        cnt = session.insert("sign.signPayValueInsert", list);
        return cnt;
    }
}
