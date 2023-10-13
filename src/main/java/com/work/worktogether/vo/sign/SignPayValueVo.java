package com.work.worktogether.vo.sign;

import lombok.Data;

@Data
public class SignPayValueVo {
    private int sno;
    private int pSno;
    private String[] briefs;
    private Long[] amount;
    private String[] note;
}
