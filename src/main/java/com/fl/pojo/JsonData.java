package com.fl.pojo;

import java.util.HashMap;
import java.util.Map;

public class JsonData {
    public static Map<String, Object> success(Object dat,int coun){
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("code", 0);
        data.put("msg","成功！！");
        data.put("data",dat);
        data.put("count",coun);
        return data;
    }

    public static Map<String, Object> error(String msg){
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("code", 1);
        data.put("msg",msg);
        data.put("data",null);
        data.put("count",0);
        return data;
    }
}
