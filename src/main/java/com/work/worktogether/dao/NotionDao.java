package com.work.worktogether.dao;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.work.worktogether.mybatis.MybaFactory;
import com.work.worktogether.vo.FileContentVo;
import com.work.worktogether.vo.notion.NotionReplVo;
import com.work.worktogether.vo.notion.NotionVo;
import com.work.worktogether.vo.page.Page;

import jakarta.servlet.http.HttpSession;

@Component
public class NotionDao {
	SqlSession session;
	Page page;
	String uploadPath = "C:/Users/y/Desktop/WorkTogether/src/main/resources/static/upload/";

	public NotionDao() {
		session = MybaFactory.getFactory().openSession();
	}

	public NotionVo view(int sno) {

		// sno에 해당하는 본문글 1건
		NotionVo vo = session.selectOne("notion.view", sno);

		// 첨부파일 목록
		List<FileContentVo> attFiles = session.selectList("notion.attFiles", sno);
		vo.setAttFiles(attFiles);

		// 조회수 증가
		int cnt = session.update("notion.hitUpdate", sno);
		if (cnt > 0) {
			session.commit();
		} else {
			session.rollback();
		}

		return vo;
	}

	public List<NotionVo> select(Page page) {
		List<NotionVo> list = null;
		int totSize = getTotSize(page);
		page.setTotSize(totSize);
		page.pageCompute();
		this.page = page;
		list = session.selectList("notion.select", page);
		return list;
	}

	public int getTotSize(Page page) {
		int totSize = session.selectOne("notion.totSize", page);
		return totSize;
	}

	public Page getPage() {
		return this.page;
	}

	public String notionCreateR(NotionVo vo, List<MultipartFile> mul, HttpSession httpSession) {
		String msg = "";
		String employeeNumber = httpSession.getAttribute("employeeNumber").toString();
		vo.setEmployeeNumber(employeeNumber);
		int cnt = 0; // 쿼리의 실행결과
		List<FileContentVo> attFiles = new ArrayList<>(); // 업로드된 파일 정보
		try {
			int sno = session.selectOne("notion.getSerial", "i");
			vo.setSno(sno);
			cnt = session.insert("notion.register", vo);
			if (cnt < 1) {
				msg = "저장 중 오류 발생";
				throw new Exception(msg);
			}
			for (MultipartFile f : mul) {
				if (f.getOriginalFilename() == "") {
					continue;
				}
				UUID uuid = UUID.randomUUID();
				String sysFile = String.format("%s-%s", uuid.toString(), f.getOriginalFilename());
				File saveFile = new File(uploadPath + sysFile);
				f.transferTo(saveFile);
				FileContentVo att = new FileContentVo(sno, f.getOriginalFilename(), sysFile);
				attFiles.add(att);
			}
			if (attFiles.size() > 0) {// 첨부파일이 있는 경우
				cnt = session.insert("notion.attRegister", attFiles);
				if (cnt != attFiles.size()) {
					msg = "첨부파일 정보 저장중 오류 발생";
					throw new Exception(msg);
				}
			}
			session.commit();
		} catch (Exception ex) {
			msg = ex.getMessage();
			ex.printStackTrace();
			session.rollback();
			for (FileContentVo att : attFiles) {
				File delFile = new File(uploadPath + att.getSysFile());
				if (delFile.exists()) {
					delFile.delete();
				}
			}
		}

		return msg;
	}

	public String deleteR(NotionVo vo) {
		String msg = "";
		int cnt = 0;
		List<FileContentVo> delFileList = null;
		try {
			cnt = session.delete("notion.replDelete", vo.getSno());
			// 게시물 삭제
			cnt = session.delete("notion.delete", vo.getSno());
			if (cnt < 1) {
				msg = "게시글 삭제중 오류 발생";
				throw new Exception(msg);
			}
			// 삭제할 파일 목록
			delFileList = session.selectList("notion.attFiles", vo.getSno());
			String[] delFile = new String[delFileList.size()];
			for (int i = 0; i < delFileList.size(); i++) {
				FileContentVo att = delFileList.get(i);
				delFile[i] = att.getSysFile();
			}
			if (delFileList.size() > 0) { // 첨부 파일이 있는 경우
				cnt = session.delete("notion.deleteAtt", delFile);
				if (cnt != delFile.length) {
					msg = "첨부파일 정보 삭제중 오류 발생";
					throw new Exception(msg);
				}
				// 첨부파일 삭제
				for (String f : delFile) {
					File file = new File(uploadPath + f);
					if (file.exists())
						file.delete();
				}
			}
			session.commit();
		} catch (Exception ex) {
			ex.getMessage();
			ex.printStackTrace();
			session.rollback();
		}
		return msg;
	}

	public String modifyR(NotionVo vo, List<MultipartFile> mul) {
		String msg = "";
		int cnt = 0;
		List<FileContentVo> attFiles = null;
		try {
			// 게시물 수정
			cnt = session.update("notion.update", vo);
			if (cnt < 1) {
				msg = "정보 수정중 오류 발생";
				throw new Exception();
			}
			// 새로운 첨부파일 등록
			attFiles = new ArrayList<>();
			for (MultipartFile f : mul) {
				if (f.getOriginalFilename() == "")
					continue;
				UUID uuid = UUID.randomUUID();
				String sysFile = uuid.toString() + "-" + f.getOriginalFilename();
				File saveFile = new File(uploadPath + sysFile);
				f.transferTo(saveFile);
				FileContentVo att = new FileContentVo(vo.getSno(), f.getOriginalFilename(), sysFile);
				attFiles.add(att);
			}
			// FileContentVo 저장
			if (attFiles.size() > 0) {
				cnt = session.insert("notion.attRegister", attFiles);
				if (cnt != attFiles.size()) {
					msg = "펌부 정보 수정중 오류 발생";
					throw new Exception(msg);
				}
			}
			// 삭제된 첨부 파일 처리(delAtt)
			if (vo.getDelFile() != null) {
				cnt = session.delete("notion.deleteAtt", vo.getDelFile());
				if (cnt != vo.getDelFile().length) {
					msg = "첨부 파일 정보 삭제중 오류 발생";
					throw new Exception();
				}
				for (String f : vo.getDelFile()) {
					File delFile = new File(uploadPath + f);
					if (delFile.exists())
						delFile.delete();
				}
			}
			session.commit();
		} catch (Exception ex) {
			session.rollback();
			if (attFiles != null) {
				for (FileContentVo att : attFiles) {
					File f = new File(uploadPath + att.getSysFile());
					if (f.exists())
						f.delete();
				}
			}
		}

		return msg;
	}

	public List<NotionReplVo> replSelect(int sno) {
		List<NotionReplVo> list = null;
		list = session.selectList("notionRepl.replSelect", sno);
		return list;
	}

	public String replR(NotionReplVo vo) {
		String msg = "";
		int cnt = 0;
		int notionReplSno = session.selectOne("notionRepl.getNotionReplSno", vo.getSno());
		vo.setSerial(notionReplSno);
		cnt = session.insert("notionRepl.repl", vo);
		if (cnt > 0) {
			session.commit();
		} else {
			msg = "저장 중 오류 발생";
			session.rollback();
		}
		return msg;
	}

	public String notionReplDelete(int sno) {
		String msg = "";
		int cnt = 0;
		try {
			cnt = session.delete("notionRepl.delete", sno);
			if (cnt < 1) {
				msg = "삭제중 오류 발생";
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

	public String notionReplModify(NotionReplVo vo) {
		String msg = "";
		int cnt = 0;
		cnt = session.update("notionRepl.update", vo);
		if (cnt > 0) {
			session.commit();
		} else {
			msg = "수정중 오류 발생";
			session.rollback();
		}
		return msg;
	}
}