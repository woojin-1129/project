package com.work.worktogether.vo.sign;

import lombok.Data;

@Data
public class SignPayVo {
    private int sno;
    private int pSno;
    private long totAmount;
    private String initiativeDate;
    private String PaymentDate;
    private String expenditure;
}
