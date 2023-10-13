package com.work.worktogether.vo.sign;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SignPay {
    private SignVo sVo;
    private SignPayVo spVo;
    private List<SpvVo> spvVo;
    private SignVacationVo svVo;
    private List<SignDocumentVo> sdVo;
}
