import com.fl.pojo.MD5_test;
import com.fl.pojo.User;
import com.fl.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import sun.security.provider.MD5;

import javax.annotation.Resource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:spring-mybatis.xml" })
public class ControllerTest {
    @Autowired(required=false)
    private UserService service;
    private MD5_test md5;
    @Test
    public void list(){
        User u = new User();
        u.setPassword(md5.MD5("123456"));
        u.setUsername("admin");
        User login = service.login(u.getUsername(), u.getPassword());
        System.out.println(login.toString());
//        for (User user : service.queryall()) {
//            System.out.println(user.toString());
//        }
//        ApplicationContext Context = new ClassPathXmlApplicationContext("applicationContext.xml");
//        UserService userServiceImp = (UserService) Context.getBean("UserServiceImp");
//        for (user user : userServiceImp.queryall()) {
//            System.out.println(user.toString());
//        }
}
}
