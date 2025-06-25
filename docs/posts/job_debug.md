# job 実行成功 DEBUG 情報の確認

```bash
"C:\Program Files\Eclipse Adoptium\jdk-21.0.7.6-hotspot\bin\java.exe" -agentlib:jdwp=transport=dt_socket,address=127.0.0.1:50369,suspend=y,server=n -javaagent:C:\Users\kaikyou\AppData\Local\JetBrains\IntelliJIdea2025.1\captureAgent\debugger-agent.jar=file:///C:/Users/kaikyou/AppData/Local/Temp/capture6312712009782753390.props -agentpath:C:\Users\kaikyou\AppData\Local\Temp\idea_libasyncProfiler_dll_temp_folder6\libasyncProfiler.dll=version,jfr,event=wall,interval=10ms,cstack=no,file=C:\Users\kaikyou\IdeaSnapshots\Run_HumanResource_Batch_Job_2025_06_22_101532.jfr,dbghelppath=C:\Users\kaikyou\AppData\Local\Temp\idea_dbghelp_dll_temp_folder2\dbghelp.dll,log=C:\Users\kaikyou\AppData\Local\Temp\Run_HumanResource_Batch_Job_2025_06_22_101532.jfr.log.txt,logLevel=DEBUG -XX:TieredStopAtLevel=1 -Dspring.output.ansi.enabled=always -Dcom.sun.management.jmxremote -Dspring.jmx.enabled=true -Dspring.liveBeansView.mbeanDomain -Dspring.application.admin.enabled=true "-Dmanagement.endpoints.jmx.exposure.include=*" -Dkotlinx.coroutines.debug.enable.creation.stack.trace=false -Ddebugger.agent.enable.coroutines=true -Dkotlinx.coroutines.debug.enable.flows.stack.trace=true -Dkotlinx.coroutines.debug.enable.mutable.state.flows.stack.trace=true -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath "D:\orgchart-api\target\classes;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-web\3.5.0\spring-boot-starter-web-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter\3.5.0\spring-boot-starter-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-logging\3.5.0\spring-boot-starter-logging-3.5.0.jar;C:\Users\kaikyou\.m2\repository\ch\qos\logback\logback-classic\1.5.18\logback-classic-1.5.18.jar;C:\Users\kaikyou\.m2\repository\ch\qos\logback\logback-core\1.5.18\logback-core-1.5.18.jar;C:\Users\kaikyou\.m2\repository\org\apache\logging\log4j\log4j-to-slf4j\2.24.3\log4j-to-slf4j-2.24.3.jar;C:\Users\kaikyou\.m2\repository\org\apache\logging\log4j\log4j-api\2.24.3\log4j-api-2.24.3.jar;C:\Users\kaikyou\.m2\repository\org\slf4j\jul-to-slf4j\2.0.17\jul-to-slf4j-2.0.17.jar;C:\Users\kaikyou\.m2\repository\jakarta\annotation\jakarta.annotation-api\2.1.1\jakarta.annotation-api-2.1.1.jar;C:\Users\kaikyou\.m2\repository\org\yaml\snakeyaml\2.4\snakeyaml-2.4.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-json\3.5.0\spring-boot-starter-json-3.5.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\core\jackson-databind\2.19.0\jackson-databind-2.19.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\core\jackson-annotations\2.19.0\jackson-annotations-2.19.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\core\jackson-core\2.19.0\jackson-core-2.19.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\datatype\jackson-datatype-jdk8\2.19.0\jackson-datatype-jdk8-2.19.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\datatype\jackson-datatype-jsr310\2.19.0\jackson-datatype-jsr310-2.19.0.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\jackson\module\jackson-module-parameter-names\2.19.0\jackson-module-parameter-names-2.19.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-tomcat\3.5.0\spring-boot-starter-tomcat-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\apache\tomcat\embed\tomcat-embed-core\10.1.41\tomcat-embed-core-10.1.41.jar;C:\Users\kaikyou\.m2\repository\org\apache\tomcat\embed\tomcat-embed-websocket\10.1.41\tomcat-embed-websocket-10.1.41.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-web\6.2.7\spring-web-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-beans\6.2.7\spring-beans-6.2.7.jar;C:\Users\kaikyou\.m2\repository\io\micrometer\micrometer-observation\1.15.0\micrometer-observation-1.15.0.jar;C:\Users\kaikyou\.m2\repository\io\micrometer\micrometer-commons\1.15.0\micrometer-commons-1.15.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-webmvc\6.2.7\spring-webmvc-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-context\6.2.7\spring-context-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-expression\6.2.7\spring-expression-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-jdbc\3.5.0\spring-boot-starter-jdbc-3.5.0.jar;C:\Users\kaikyou\.m2\repository\com\zaxxer\HikariCP\6.3.0\HikariCP-6.3.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-jdbc\6.2.7\spring-jdbc-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-tx\6.2.7\spring-tx-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-security\3.5.0\spring-boot-starter-security-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-aop\6.2.7\spring-aop-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\security\spring-security-config\6.5.0\spring-security-config-6.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\security\spring-security-web\6.5.0\spring-security-web-6.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-batch\3.5.0\spring-boot-starter-batch-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\batch\spring-batch-core\5.2.2\spring-batch-core-5.2.2.jar;C:\Users\kaikyou\.m2\repository\org\springframework\batch\spring-batch-infrastructure\5.2.2\spring-batch-infrastructure-5.2.2.jar;C:\Users\kaikyou\.m2\repository\org\springframework\retry\spring-retry\2.0.12\spring-retry-2.0.12.jar;C:\Users\kaikyou\.m2\repository\io\micrometer\micrometer-core\1.15.0\micrometer-core-1.15.0.jar;C:\Users\kaikyou\.m2\repository\org\hdrhistogram\HdrHistogram\2.2.2\HdrHistogram-2.2.2.jar;C:\Users\kaikyou\.m2\repository\org\latencyutils\LatencyUtils\2.0.3\LatencyUtils-2.0.3.jar;C:\Users\kaikyou\.m2\repository\org\springframework\data\spring-data-commons\3.5.0\spring-data-commons-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\mybatis\spring\boot\mybatis-spring-boot-starter\3.0.3\mybatis-spring-boot-starter-3.0.3.jar;C:\Users\kaikyou\.m2\repository\org\mybatis\spring\boot\mybatis-spring-boot-autoconfigure\3.0.3\mybatis-spring-boot-autoconfigure-3.0.3.jar;C:\Users\kaikyou\.m2\repository\org\mybatis\mybatis\3.5.14\mybatis-3.5.14.jar;C:\Users\kaikyou\.m2\repository\org\mybatis\mybatis-spring\3.0.3\mybatis-spring-3.0.3.jar;C:\Users\kaikyou\.m2\repository\org\postgresql\postgresql\42.7.3\postgresql-42.7.3.jar;C:\Users\kaikyou\.m2\repository\org\projectlombok\lombok\1.18.30\lombok-1.18.30.jar;C:\Users\kaikyou\.m2\repository\org\mapstruct\mapstruct\1.5.5.Final\mapstruct-1.5.5.Final.jar;C:\Users\kaikyou\.m2\repository\jakarta\validation\jakarta.validation-api\3.0.2\jakarta.validation-api-3.0.2.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-devtools\3.5.0\spring-boot-devtools-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot\3.5.0\spring-boot-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-autoconfigure\3.5.0\spring-boot-autoconfigure-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-core\6.2.7\spring-core-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-jcl\6.2.7\spring-jcl-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\apache\commons\commons-lang3\3.14.0\commons-lang3-3.14.0.jar;C:\Users\kaikyou\.m2\repository\org\slf4j\slf4j-api\2.0.17\slf4j-api-2.0.17.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-mail\3.5.0\spring-boot-starter-mail-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\spring-context-support\6.2.7\spring-context-support-6.2.7.jar;C:\Users\kaikyou\.m2\repository\org\eclipse\angus\jakarta.mail\2.0.3\jakarta.mail-2.0.3.jar;C:\Users\kaikyou\.m2\repository\jakarta\activation\jakarta.activation-api\2.1.3\jakarta.activation-api-2.1.3.jar;C:\Users\kaikyou\.m2\repository\org\eclipse\angus\angus-activation\2.0.2\angus-activation-2.0.2.jar;C:\Users\kaikyou\.m2\repository\com\sun\mail\jakarta.mail\2.0.1\jakarta.mail-2.0.1.jar;C:\Users\kaikyou\.m2\repository\com\sun\activation\jakarta.activation\2.0.1\jakarta.activation-2.0.1.jar;C:\Users\kaikyou\.m2\repository\org\springframework\boot\spring-boot-starter-validation\3.5.0\spring-boot-starter-validation-3.5.0.jar;C:\Users\kaikyou\.m2\repository\org\apache\tomcat\embed\tomcat-embed-el\10.1.41\tomcat-embed-el-10.1.41.jar;C:\Users\kaikyou\.m2\repository\org\hibernate\validator\hibernate-validator\8.0.2.Final\hibernate-validator-8.0.2.Final.jar;C:\Users\kaikyou\.m2\repository\org\jboss\logging\jboss-logging\3.6.1.Final\jboss-logging-3.6.1.Final.jar;C:\Users\kaikyou\.m2\repository\com\fasterxml\classmate\1.7.0\classmate-1.7.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\security\spring-security-core\6.5.0\spring-security-core-6.5.0.jar;C:\Users\kaikyou\.m2\repository\org\springframework\security\spring-security-crypto\6.5.0\spring-security-crypto-6.5.0.jar;D:\IntelliJ IDEA 2025.1.2\lib\idea_rt.jar" com.example.orgchart_api.OrgchartApiApplication --spring.profiles.active=dev
Connected to the target VM, address: '127.0.0.1:50369', transport: 'socket'

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.5.0)

2025-06-22T10:15:38.722+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.orgchart_api.OrgchartApiApplication  : Starting OrgchartApiApplication using Java 21.0.7 with PID 12432 (D:\orgchart-api\target\classes started by kaikyou in D:\orgchart-api)
2025-06-22T10:15:38.722+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.orgchart_api.OrgchartApiApplication  : Running with Spring Boot v3.5.0, Spring v6.2.7
2025-06-22T10:15:38.722+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.orgchart_api.OrgchartApiApplication  : The following 1 profile is active: "dev"
2025-06-22T10:15:38.777+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
2025-06-22T10:15:38.777+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : For additional web related logging consider setting the 'logging.level.web' property to 'DEBUG'
2025-06-22T10:15:40.378+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.c.annotation.BatchRegistrar      : Finished Spring Batch infrastructure beans configuration in 4 ms.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\mapper\AppCommonMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\mapper\CommonMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\mapper\UserMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'appCommonMapper' and 'com.example.orgchart_api.mapper.AppCommonMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'appCommonMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'commonMapper' and 'com.example.orgchart_api.mapper.CommonMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'commonMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'userMapper' and 'com.example.orgchart_api.mapper.UserMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'userMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\batch\persistence\ErrorMailMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\batch\persistence\LoadPersonnelMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\batch\persistence\LoadStaffMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Identified candidate component class: file [D:\orgchart-api\target\classes\com\example\orgchart_api\batch\persistence\MasterMapper.class]
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'errorMailMapper' and 'com.example.orgchart_api.batch.persistence.ErrorMailMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'errorMailMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'loadPersonnelMapper' and 'com.example.orgchart_api.batch.persistence.LoadPersonnelMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'loadPersonnelMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'loadStaffMapper' and 'com.example.orgchart_api.batch.persistence.LoadStaffMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'loadStaffMapper'.
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Creating MapperFactoryBean with name 'masterMapper' and 'com.example.orgchart_api.batch.persistence.MasterMapper' mapperInterface
2025-06-22T10:15:40.695+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.mapper.ClassPathMapperScanner      : Enabling autowire by type for MapperFactoryBean with name 'masterMapper'.
2025-06-22T10:15:41.185+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8080 (http)
2025-06-22T10:15:41.185+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2025-06-22T10:15:41.185+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.41]
2025-06-22T10:15:41.235+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2025-06-22T10:15:41.235+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 2458 ms
2025-06-22T10:15:42.010+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.mybatis.spring.SqlSessionFactoryBean   : Parsed mapper file: 'file [D:\orgchart-api\target\classes\mapper\LoadStaffMapper.xml]'
2025-06-22T10:15:42.044+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.mybatis.spring.SqlSessionFactoryBean   : Parsed mapper file: 'file [D:\orgchart-api\target\classes\mapper\UserMapper.xml]'
2025-06-22T10:15:42.182+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2025-06-22T10:15:42.366+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@566571e1
2025-06-22T10:15:42.369+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2025-06-22T10:15:42.380+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.r.s.JobRepositoryFactoryBean     : No database type set, using meta data indicating: POSTGRES
2025-06-22T10:15:42.553+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .c.a.BatchObservabilityBeanPostProcessor : No Micrometer observation registry found, defaulting to ObservationRegistry.NOOP
2025-06-22T10:15:42.555+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .c.a.BatchObservabilityBeanPostProcessor : No Micrometer observation registry found, defaulting to ObservationRegistry.NOOP
2025-06-22T10:15:42.560+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .c.a.BatchObservabilityBeanPostProcessor : No Micrometer observation registry found, defaulting to ObservationRegistry.NOOP
2025-06-22T10:15:42.569+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] .c.a.BatchObservabilityBeanPostProcessor : No Micrometer observation registry found, defaulting to ObservationRegistry.NOOP
2025-06-22T10:15:42.573+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.l.s.TaskExecutorJobLauncher      : No TaskExecutor has been set, defaulting to synchronous executor.
2025-06-22T10:15:43.057+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with UserDetailsService bean with name userDetailsService
2025-06-22T10:15:43.510+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2025-06-22T10:15:43.522+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] .s.JobRegistrySmartInitializingSingleton : Registering job: humanResourceBatchJob
2025-06-22T10:15:43.570+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path '/'
2025-06-22T10:15:43.580+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.orgchart_api.OrgchartApiApplication  : Started OrgchartApiApplication in 5.378 seconds (process running for 10.283)
2025-06-22T10:15:43.601+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.602+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_INSTANCE_ID, JOB_NAME
FROM BATCH_JOB_INSTANCE
WHERE JOB_NAME = ?
 and JOB_KEY = ?]
2025-06-22T10:15:43.627+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.628+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, EXIT_CODE, EXIT_MESSAGE, CREATE_TIME, LAST_UPDATED, VERSION
FROM BATCH_JOB_EXECUTION E
WHERE JOB_INSTANCE_ID = ? AND JOB_EXECUTION_ID IN (SELECT MAX(JOB_EXECUTION_ID) FROM BATCH_JOB_EXECUTION E2 WHERE E2.JOB_INSTANCE_ID = ?)
]
2025-06-22T10:15:43.632+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.632+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, PARAMETER_NAME, PARAMETER_TYPE, PARAMETER_VALUE, IDENTIFYING
FROM BATCH_JOB_EXECUTION_PARAMS
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.636+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.636+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_JOB_EXECUTION_CONTEXT
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.641+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.641+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT STEP_EXECUTION_ID, STEP_NAME, START_TIME, END_TIME, STATUS, COMMIT_COUNT, READ_COUNT, FILTER_COUNT, WRITE_COUNT, EXIT_CODE, EXIT_MESSAGE, READ_SKIP_COUNT, WRITE_SKIP_COUNT, PROCESS_SKIP_COUNT, ROLLBACK_COUNT, LAST_UPDATED, VERSION, CREATE_TIME
FROM BATCH_STEP_EXECUTION
WHERE JOB_EXECUTION_ID = ?
 ORDER BY STEP_EXECUTION_ID]
2025-06-22T10:15:43.646+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.646+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_INSTANCE_ID, JOB_NAME
FROM BATCH_JOB_INSTANCE
WHERE JOB_NAME = ?
 and JOB_KEY = ?]
2025-06-22T10:15:43.647+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.647+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, EXIT_CODE, EXIT_MESSAGE, CREATE_TIME, LAST_UPDATED, VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_INSTANCE_ID = ?
ORDER BY JOB_EXECUTION_ID DESC
]
2025-06-22T10:15:43.647+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.647+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, PARAMETER_NAME, PARAMETER_TYPE, PARAMETER_VALUE, IDENTIFYING
FROM BATCH_JOB_EXECUTION_PARAMS
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.648+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.648+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, PARAMETER_NAME, PARAMETER_TYPE, PARAMETER_VALUE, IDENTIFYING
FROM BATCH_JOB_EXECUTION_PARAMS
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.649+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.649+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, EXIT_CODE, EXIT_MESSAGE, CREATE_TIME, LAST_UPDATED, VERSION
FROM BATCH_JOB_EXECUTION E
WHERE JOB_INSTANCE_ID = ? AND JOB_EXECUTION_ID IN (SELECT MAX(JOB_EXECUTION_ID) FROM BATCH_JOB_EXECUTION E2 WHERE E2.JOB_INSTANCE_ID = ?)
]
2025-06-22T10:15:43.649+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.649+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT JOB_EXECUTION_ID, PARAMETER_NAME, PARAMETER_TYPE, PARAMETER_VALUE, IDENTIFYING
FROM BATCH_JOB_EXECUTION_PARAMS
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.650+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.650+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_JOB_EXECUTION_CONTEXT
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.653+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.653+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_JOB_EXECUTION(JOB_EXECUTION_ID, JOB_INSTANCE_ID, START_TIME, END_TIME, STATUS, EXIT_CODE, EXIT_MESSAGE, VERSION, CREATE_TIME, LAST_UPDATED)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
]
2025-06-22T10:15:43.668+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.669+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_JOB_EXECUTION_CONTEXT (SHORT_CONTEXT, SERIALIZED_CONTEXT, JOB_EXECUTION_ID)
	VALUES(?, ?, ?)
]
2025-06-22T10:15:43.672+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.l.s.TaskExecutorJobLauncher      : Job: [SimpleJob: [name=humanResourceBatchJob]] launched with the following parameters: [{}]
2025-06-22T10:15:43.673+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.AbstractJob           : Job execution starting: JobExecution: id=22, version=0, startTime=null, endTime=null, lastUpdated=2025-06-22T10:15:43.651871500, status=STARTING, exitStatus=exitCode=UNKNOWN;exitDescription=, job=[JobInstance: id=8, version=0, Job=[humanResourceBatchJob]], jobParameters=[{}]
2025-06-22T10:15:43.694+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.694+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.698+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.698+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.699+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.699+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION
SET START_TIME = ?, END_TIME = ?,  STATUS = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, CREATE_TIME = ?, LAST_UPDATED = ?
WHERE JOB_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.700+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ジョブ開始: {}
2025-06-22T10:15:43.702+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.702+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SE.STEP_EXECUTION_ID, SE.STEP_NAME, SE.START_TIME, SE.END_TIME, SE.STATUS, SE.COMMIT_COUNT, SE.READ_COUNT, SE.FILTER_COUNT, SE.WRITE_COUNT, SE.EXIT_CODE, SE.EXIT_MESSAGE, SE.READ_SKIP_COUNT, SE.WRITE_SKIP_COUNT, SE.PROCESS_SKIP_COUNT, SE.ROLLBACK_COUNT, SE.LAST_UPDATED, SE.VERSION, SE.CREATE_TIME, JE.JOB_EXECUTION_ID, JE.START_TIME, JE.END_TIME, JE.STATUS, JE.EXIT_CODE, JE.EXIT_MESSAGE, JE.CREATE_TIME, JE.LAST_UPDATED, JE.VERSION
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.704+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.704+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_STEP_EXECUTION_CONTEXT
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.706+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.706+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_JOB_EXECUTION_CONTEXT
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.709+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.709+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.711+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.711+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION(STEP_EXECUTION_ID, VERSION, STEP_NAME, JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, COMMIT_COUNT, READ_COUNT, FILTER_COUNT, WRITE_COUNT, EXIT_CODE, EXIT_MESSAGE, READ_SKIP_COUNT, WRITE_SKIP_COUNT, PROCESS_SKIP_COUNT, ROLLBACK_COUNT, LAST_UPDATED, CREATE_TIME)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
]
2025-06-22T10:15:43.712+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.712+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION_CONTEXT (SHORT_CONTEXT, SERIALIZED_CONTEXT, STEP_EXECUTION_ID)
	VALUES(?, ?, ?)
]
2025-06-22T10:15:43.713+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.SimpleStepHandler     : Executing step: [stagingTableInitializationStep]
2025-06-22T10:15:43.713+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Executing: id=44
2025-06-22T10:15:43.715+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.716+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.717+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.717+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.720+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ステップ開始: stagingTableInitializationStep
2025-06-22T10:15:43.720+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.720+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.726+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.727+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.727+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Preparing chunk execution for StepContext: org.springframework.batch.core.scope.context.StepContext@5670aa34
2025-06-22T10:15:43.728+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Chunk execution starting: queue size=0
2025-06-22T10:15:43.731+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ===== ステージングテーブル初期化開始 =====
2025-06-22T10:15:43.731+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing SQL update [DELETE FROM biz_ad]
2025-06-22T10:15:43.735+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing SQL update [DELETE FROM biz_department]
2025-06-22T10:15:43.737+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing SQL update [DELETE FROM biz_employee]
2025-06-22T10:15:43.739+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing SQL update [DELETE FROM biz_organization]
2025-06-22T10:15:43.741+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing SQL update [DELETE FROM biz_shift]
2025-06-22T10:15:43.742+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ===== 初期化完了 =====
2025-06-22T10:15:43.758+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Applying contribution: [StepContribution: read=0, written=0, filtered=0, readSkips=0, writeSkips=0, processSkips=0, exitStatus=EXECUTING]
2025-06-22T10:15:43.758+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.759+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.759+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Saving step execution before commit: StepExecution: id=44, version=1, name=stagingTableInitializationStep, status=STARTED, exitStatus=EXECUTING, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.759+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.759+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.760+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.760+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.761+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.761+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution success: id=44
2025-06-22T10:15:43.761+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step: [stagingTableInitializationStep] executed in 47ms
2025-06-22T10:15:43.762+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ステップ完了: COMPLETED
2025-06-22T10:15:43.762+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.762+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.763+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.763+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.764+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.764+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.765+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution complete: StepExecution: id=44, version=3, name=stagingTableInitializationStep, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0
2025-06-22T10:15:43.766+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.766+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.768+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.768+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SE.STEP_EXECUTION_ID, SE.STEP_NAME, SE.START_TIME, SE.END_TIME, SE.STATUS, SE.COMMIT_COUNT, SE.READ_COUNT, SE.FILTER_COUNT, SE.WRITE_COUNT, SE.EXIT_CODE, SE.EXIT_MESSAGE, SE.READ_SKIP_COUNT, SE.WRITE_SKIP_COUNT, SE.PROCESS_SKIP_COUNT, SE.ROLLBACK_COUNT, SE.LAST_UPDATED, SE.VERSION, SE.CREATE_TIME, JE.JOB_EXECUTION_ID, JE.START_TIME, JE.END_TIME, JE.STATUS, JE.EXIT_CODE, JE.EXIT_MESSAGE, JE.CREATE_TIME, JE.LAST_UPDATED, JE.VERSION
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.770+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.770+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_STEP_EXECUTION_CONTEXT
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.771+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.771+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_JOB_EXECUTION_CONTEXT
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.773+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.773+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.774+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.774+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION(STEP_EXECUTION_ID, VERSION, STEP_NAME, JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, COMMIT_COUNT, READ_COUNT, FILTER_COUNT, WRITE_COUNT, EXIT_CODE, EXIT_MESSAGE, READ_SKIP_COUNT, WRITE_SKIP_COUNT, PROCESS_SKIP_COUNT, ROLLBACK_COUNT, LAST_UPDATED, CREATE_TIME)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
]
2025-06-22T10:15:43.775+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.775+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION_CONTEXT (SHORT_CONTEXT, SERIALIZED_CONTEXT, STEP_EXECUTION_ID)
	VALUES(?, ?, ?)
]
2025-06-22T10:15:43.776+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.SimpleStepHandler     : Executing step: [sampleChunkStep]
2025-06-22T10:15:43.776+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Executing: id=45
2025-06-22T10:15:43.776+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.776+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.777+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.777+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.778+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.779+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.779+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.780+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.780+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Preparing chunk execution for StepContext: org.springframework.batch.core.scope.context.StepContext@af926e7
2025-06-22T10:15:43.780+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Chunk execution starting: queue size=0
2025-06-22T10:15:43.782+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.782+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.789+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.790+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.processor.SimpleProcessor   : SimpleProcessor が呼び出されました。
2025-06-22T10:15:43.791+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.processor.SimpleProcessor   : 受け取ったデータ: [0]
2025-06-22T10:15:43.791+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : 処理結果: [items=[[0]], skips=[]]
2025-06-22T10:15:43.791+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.step.item.ChunkOrientedTasklet   : Inputs not busy, ended: false
2025-06-22T10:15:43.791+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Applying contribution: [StepContribution: read=1, written=1, filtered=0, readSkips=0, writeSkips=0, processSkips=0, exitStatus=EXECUTING]
2025-06-22T10:15:43.791+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.791+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.792+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Saving step execution before commit: StepExecution: id=45, version=1, name=sampleChunkStep, status=STARTED, exitStatus=EXECUTING, readCount=1, filterCount=0, writeCount=1 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.792+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.793+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.794+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.794+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.795+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=2
2025-06-22T10:15:43.795+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Preparing chunk execution for StepContext: org.springframework.batch.core.scope.context.StepContext@af926e7
2025-06-22T10:15:43.795+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Chunk execution starting: queue size=0
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.step.item.ChunkOrientedTasklet   : Inputs not busy, ended: true
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Applying contribution: [StepContribution: read=0, written=0, filtered=0, readSkips=0, writeSkips=0, processSkips=0, exitStatus=EXECUTING]
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.796+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.797+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Saving step execution before commit: StepExecution: id=45, version=2, name=sampleChunkStep, status=STARTED, exitStatus=EXECUTING, readCount=1, filterCount=0, writeCount=1 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=2, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.797+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.797+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.798+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.798+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.799+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.799+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution success: id=45
2025-06-22T10:15:43.799+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step: [sampleChunkStep] executed in 22ms
2025-06-22T10:15:43.800+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.800+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.801+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.801+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.802+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.802+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.803+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution complete: StepExecution: id=45, version=4, name=sampleChunkStep, status=COMPLETED, exitStatus=COMPLETED, readCount=1, filterCount=0, writeCount=1 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=2, rollbackCount=0
2025-06-22T10:15:43.803+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.803+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.804+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.804+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SE.STEP_EXECUTION_ID, SE.STEP_NAME, SE.START_TIME, SE.END_TIME, SE.STATUS, SE.COMMIT_COUNT, SE.READ_COUNT, SE.FILTER_COUNT, SE.WRITE_COUNT, SE.EXIT_CODE, SE.EXIT_MESSAGE, SE.READ_SKIP_COUNT, SE.WRITE_SKIP_COUNT, SE.PROCESS_SKIP_COUNT, SE.ROLLBACK_COUNT, SE.LAST_UPDATED, SE.VERSION, SE.CREATE_TIME, JE.JOB_EXECUTION_ID, JE.START_TIME, JE.END_TIME, JE.STATUS, JE.EXIT_CODE, JE.EXIT_MESSAGE, JE.CREATE_TIME, JE.LAST_UPDATED, JE.VERSION
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.806+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.806+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_STEP_EXECUTION_CONTEXT
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.807+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.807+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SHORT_CONTEXT, SERIALIZED_CONTEXT
FROM BATCH_JOB_EXECUTION_CONTEXT
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.808+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.809+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.811+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.811+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION(STEP_EXECUTION_ID, VERSION, STEP_NAME, JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, COMMIT_COUNT, READ_COUNT, FILTER_COUNT, WRITE_COUNT, EXIT_CODE, EXIT_MESSAGE, READ_SKIP_COUNT, WRITE_SKIP_COUNT, PROCESS_SKIP_COUNT, ROLLBACK_COUNT, LAST_UPDATED, CREATE_TIME)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
]
2025-06-22T10:15:43.812+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.812+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION_CONTEXT (SHORT_CONTEXT, SERIALIZED_CONTEXT, STEP_EXECUTION_ID)
	VALUES(?, ?, ?)
]
2025-06-22T10:15:43.813+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.SimpleStepHandler     : Executing step: [loadStaffInfoStep]
2025-06-22T10:15:43.813+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Executing: id=46
2025-06-22T10:15:43.813+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.813+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.813+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.814+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.814+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.815+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.815+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.815+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.815+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Preparing chunk execution for StepContext: org.springframework.batch.core.scope.context.StepContext@21b9781e
2025-06-22T10:15:43.815+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Chunk execution starting: queue size=0
2025-06-22T10:15:43.821+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.util.LockFileManager         : Lock file created: C:\var\www\download\tmp\cucm.lock
2025-06-22T10:15:43.821+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : null
2025-06-22T10:15:43.822+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : CSVディレクトリパス: C:\batch\files\importfiles
2025-06-22T10:15:43.822+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : ファイル存在チェック: C:\batch\files\importfiles\ad.csv - 存在: true
2025-06-22T10:15:43.822+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : ファイル存在チェック: C:\batch\files\importfiles\department.csv - 存在: true
2025-06-22T10:15:43.822+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : ファイル存在チェック: C:\batch\files\importfiles\employee.csv - 存在: true
2025-06-22T10:15:43.822+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : ファイル存在チェック: C:\batch\files\importfiles\organization.csv - 存在: true
2025-06-22T10:15:43.823+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : ファイル存在チェック: C:\batch\files\importfiles\shift.csv - 存在: true
2025-06-22T10:15:43.824+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : CSVファイル存在チェック開始
2025-06-22T10:15:43.828+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : Checking CSV file: C:\batch\files\importfiles\ad.csv - exists: true
2025-06-22T10:15:43.828+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : Checking CSV file: C:\batch\files\importfiles\department.csv - exists: true
2025-06-22T10:15:43.828+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : Checking CSV file: C:\batch\files\importfiles\employee.csv - exists: true
2025-06-22T10:15:43.828+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : Checking CSV file: C:\batch\files\importfiles\organization.csv - exists: true
2025-06-22T10:15:43.828+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : Checking CSV file: C:\batch\files\importfiles\shift.csv - exists: true
2025-06-22T10:15:43.829+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : CSVファイル存在チェック結果: 全ファイル存在
2025-06-22T10:15:43.829+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : BIZテーブルの更新を開始
2025-06-22T10:15:43.837+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Creating a new SqlSession
2025-06-22T10:15:43.845+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Registering transaction synchronization for SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.863+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.m.s.t.SpringManagedTransaction         : JDBC Connection [HikariProxyConnection@944584616 wrapping org.postgresql.jdbc.PgConnection@566571e1] will be managed by Spring
2025-06-22T10:15:43.866+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.deleteBizAD    : ==>  Preparing: delete from biz_ad;
2025-06-22T10:15:43.878+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.deleteBizAD    : ==> Parameters:
2025-06-22T10:15:43.879+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.deleteBizAD    : <==    Updates: 0
2025-06-22T10:15:43.879+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.880+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ADデータ取込み開始: C:\batch\files\importfiles\ad.csv
2025-06-22T10:15:43.880+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : CSVヘッダー: [user_logon_name, display_name, last_name, first_name, mail, position_name, deleted]
2025-06-22T10:15:43.931+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : 最初のレコードキーセット: [user_logon_name, display_name, last_name, first_name, mail, position_name, deleted]
2025-06-22T10:15:43.932+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ADデータ読み込み完了: 5レコード
2025-06-22T10:15:43.933+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 568AW745 -> 568AW745
2025-06-22T10:15:43.933+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 568AW745 -> 568AW745
2025-06-22T10:15:43.933+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : レコード 0: 有効なADレコード追加: 568AW745
2025-06-22T10:15:43.934+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 129XZ811 -> 129XZ811
2025-06-22T10:15:43.934+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 129XZ811 -> 129XZ811
2025-06-22T10:15:43.934+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : レコード 1: 有効なADレコード追加: 129XZ811
2025-06-22T10:15:43.935+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 786QW532 -> 786QW532
2025-06-22T10:15:43.935+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 786QW532 -> 786QW532
2025-06-22T10:15:43.935+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : レコード 2: 有効なADレコード追加: 786QW532
2025-06-22T10:15:43.935+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 375DF235 -> 375DF235
2025-06-22T10:15:43.935+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 375DF235 -> 375DF235
2025-06-22T10:15:43.936+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : レコード 3: 有効なADレコード追加: 375DF235
2025-06-22T10:15:43.936+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 904JK613 -> 904JK613
2025-06-22T10:15:43.936+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ログイン名正規化: 904JK613 -> 904JK613
2025-06-22T10:15:43.936+09:00 TRACE 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : レコード 4: 有効なADレコード追加: 904JK613
2025-06-22T10:15:43.936+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ADテーブル設定: stg_ad
2025-06-22T10:15:43.936+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : 部署テーブル設定: stg_department
2025-06-22T10:15:43.936+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ADデータ挿入開始: 5レコード
2025-06-22T10:15:43.942+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Fetched SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d] from current transaction
2025-06-22T10:15:43.943+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==>  Preparing: INSERT INTO stg_ad( user_logon_name, display_name, last_name, first_name, mail, position_name, deleted ) VALUES ( ?, ?, ?, ?, ?, ?, ?::boolean -- PostgreSQL専用の型キャスト )
2025-06-22T10:15:43.951+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==> Parameters: 568AW745(String), tanaka hiroshi(String), hiroshi(String), tanaka(String), tanaka@ttp.co.jp(String), AW975-023(String), false(Boolean)
2025-06-22T10:15:43.965+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : <==    Updates: 1
2025-06-22T10:15:43.965+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.966+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Fetched SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d] from current transaction
2025-06-22T10:15:43.966+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==>  Preparing: INSERT INTO stg_ad( user_logon_name, display_name, last_name, first_name, mail, position_name, deleted ) VALUES ( ?, ?, ?, ?, ?, ?, ?::boolean -- PostgreSQL専用の型キャスト )
2025-06-22T10:15:43.966+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==> Parameters: 129XZ811(String), suzuki yuko(String), yuko(String), suzuki(String), suzuki@ttp.co.jp(String), XZ456-789(String), false(Boolean)
2025-06-22T10:15:43.967+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : <==    Updates: 1
2025-06-22T10:15:43.967+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.967+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Fetched SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d] from current transaction
2025-06-22T10:15:43.967+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==>  Preparing: INSERT INTO stg_ad( user_logon_name, display_name, last_name, first_name, mail, position_name, deleted ) VALUES ( ?, ?, ?, ?, ?, ?, ?::boolean -- PostgreSQL専用の型キャスト )
2025-06-22T10:15:43.968+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==> Parameters: 786QW532(String), kimura takeshi(String), takeshi(String), kimura(String), kimura@ttp.co.jp(String), QW123-456(String), false(Boolean)
2025-06-22T10:15:43.968+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : <==    Updates: 1
2025-06-22T10:15:43.968+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.969+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Fetched SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d] from current transaction
2025-06-22T10:15:43.969+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==>  Preparing: INSERT INTO stg_ad( user_logon_name, display_name, last_name, first_name, mail, position_name, deleted ) VALUES ( ?, ?, ?, ?, ?, ?, ?::boolean -- PostgreSQL専用の型キャスト )
2025-06-22T10:15:43.969+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==> Parameters: 375DF235(String), yamada sato(String), sato(String), yamada(String), yamada@ttp.co.jp(String), DF987-654(String), false(Boolean)
2025-06-22T10:15:43.969+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : <==    Updates: 1
2025-06-22T10:15:43.969+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.970+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Fetched SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d] from current transaction
2025-06-22T10:15:43.970+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==>  Preparing: INSERT INTO stg_ad( user_logon_name, display_name, last_name, first_name, mail, position_name, deleted ) VALUES ( ?, ?, ?, ?, ?, ?, ?::boolean -- PostgreSQL専用の型キャスト )
2025-06-22T10:15:43.970+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : ==> Parameters: 904JK613(String), ito aya(String), aya(String), ito(String), ito@ttp.co.jp(String), JK321-654(String), false(Boolean)
2025-06-22T10:15:43.970+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.p.LoadStaffMapper.insertBizAD    : <==    Updates: 1
2025-06-22T10:15:43.971+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Releasing transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.971+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.component.LoadStaffInfoLogic     : ADデータ取込み完了: 5レコード
2025-06-22T10:15:43.971+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.b.step.writer.LoadStaffInfoWriter  : BIZテーブルの更新が完了
2025-06-22T10:15:43.971+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.util.LockFileManager         : Lock file removed: C:\var\www\download\tmp\cucm.lock
2025-06-22T10:15:43.971+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Applying contribution: [StepContribution: read=0, written=0, filtered=0, readSkips=0, writeSkips=0, processSkips=0, exitStatus=EXECUTING]
2025-06-22T10:15:43.971+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Saving step execution before commit: StepExecution: id=46, version=1, name=loadStaffInfoStep, status=STARTED, exitStatus=EXECUTING, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.971+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.971+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.972+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.972+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.974+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Transaction synchronization committing SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.975+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Transaction synchronization deregistering SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.976+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] org.mybatis.spring.SqlSessionUtils       : Transaction synchronization closing SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@40d4e85d]
2025-06-22T10:15:43.977+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.977+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution success: id=46
2025-06-22T10:15:43.977+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step: [loadStaffInfoStep] executed in 163ms
2025-06-22T10:15:43.977+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.977+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.978+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.979+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.979+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.979+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.980+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution complete: StepExecution: id=46, version=3, name=loadStaffInfoStep, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0
2025-06-22T10:15:43.980+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.980+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.981+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.981+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT SE.STEP_EXECUTION_ID, SE.STEP_NAME, SE.START_TIME, SE.END_TIME, SE.STATUS, SE.COMMIT_COUNT, SE.READ_COUNT, SE.FILTER_COUNT, SE.WRITE_COUNT, SE.EXIT_CODE, SE.EXIT_MESSAGE, SE.READ_SKIP_COUNT, SE.WRITE_SKIP_COUNT, SE.PROCESS_SKIP_COUNT, SE.ROLLBACK_COUNT, SE.LAST_UPDATED, SE.VERSION, SE.CREATE_TIME, JE.JOB_EXECUTION_ID, JE.START_TIME, JE.END_TIME, JE.STATUS, JE.EXIT_CODE, JE.EXIT_MESSAGE, JE.CREATE_TIME, JE.LAST_UPDATED, JE.VERSION
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.982+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.983+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION JE
	JOIN BATCH_STEP_EXECUTION SE ON SE.JOB_EXECUTION_ID = JE.JOB_EXECUTION_ID
WHERE JE.JOB_INSTANCE_ID = ? AND SE.STEP_NAME = ?
]
2025-06-22T10:15:43.985+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.985+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION(STEP_EXECUTION_ID, VERSION, STEP_NAME, JOB_EXECUTION_ID, START_TIME, END_TIME, STATUS, COMMIT_COUNT, READ_COUNT, FILTER_COUNT, WRITE_COUNT, EXIT_CODE, EXIT_MESSAGE, READ_SKIP_COUNT, WRITE_SKIP_COUNT, PROCESS_SKIP_COUNT, ROLLBACK_COUNT, LAST_UPDATED, CREATE_TIME)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
]
2025-06-22T10:15:43.986+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.986+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [INSERT INTO BATCH_STEP_EXECUTION_CONTEXT (SHORT_CONTEXT, SERIALIZED_CONTEXT, STEP_EXECUTION_ID)
	VALUES(?, ?, ?)
]
2025-06-22T10:15:43.986+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.SimpleStepHandler     : Executing step: [thresholdCheckStep]
2025-06-22T10:15:43.987+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Executing: id=47
2025-06-22T10:15:43.987+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.987+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.988+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.988+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.989+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.989+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.989+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Starting repeat context.
2025-06-22T10:15:43.989+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat operation about to start at count=1
2025-06-22T10:15:43.990+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Preparing chunk execution for StepContext: org.springframework.batch.core.scope.context.StepContext@151aecd3
2025-06-22T10:15:43.990+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.s.c.StepContextRepeatCallback    : Chunk execution starting: queue size=0
2025-06-22T10:15:43.990+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ===== 閾値チェック開始 =====
2025-06-22T10:15:43.990+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] c.e.o.batch.job.HumanResourceJobConfig   : ===== チェック完了 =====
2025-06-22T10:15:43.990+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Applying contribution: [StepContribution: read=0, written=0, filtered=0, readSkips=0, writeSkips=0, processSkips=0, exitStatus=EXECUTING]
2025-06-22T10:15:43.990+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.990+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.991+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.tasklet.TaskletStep  : Saving step execution before commit: StepExecution: id=47, version=1, name=thresholdCheckStep, status=STARTED, exitStatus=EXECUTING, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.991+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.991+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.991+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.991+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.992+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.repeat.support.RepeatTemplate  : Repeat is complete according to policy and result value.
2025-06-22T10:15:43.992+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution success: id=47
2025-06-22T10:15:43.992+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step: [thresholdCheckStep] executed in 4ms
2025-06-22T10:15:43.993+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.993+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE STEP_EXECUTION_ID = ?
]
2025-06-22T10:15:43.994+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.994+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_STEP_EXECUTION
SET START_TIME = ?, END_TIME = ?, STATUS = ?, COMMIT_COUNT = ?, READ_COUNT = ?, FILTER_COUNT = ?, WRITE_COUNT = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, READ_SKIP_COUNT = ?, PROCESS_SKIP_COUNT = ?, WRITE_SKIP_COUNT = ?, ROLLBACK_COUNT = ?, LAST_UPDATED = ?
WHERE STEP_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:43.995+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:43.995+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:43.995+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.step.AbstractStep         : Step execution complete: StepExecution: id=47, version=3, name=thresholdCheckStep, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0
2025-06-22T10:15:43.996+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:43.996+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION_CONTEXT
SET SHORT_CONTEXT = ?, SERIALIZED_CONTEXT = ?
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:43.997+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.AbstractJob           : Upgrading JobExecution status: StepExecution: id=47, version=3, name=thresholdCheckStep, status=COMPLETED, exitStatus=COMPLETED, readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0, commitCount=1, rollbackCount=0, exitDescription=
2025-06-22T10:15:43.997+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.batch.core.job.AbstractJob           : Job execution complete: JobExecution: id=22, version=1, startTime=2025-06-22T10:15:43.692762800, endTime=null, lastUpdated=2025-06-22T10:15:43.693759800, status=COMPLETED, exitStatus=exitCode=COMPLETED;exitDescription=, job=[JobInstance: id=8, version=0, Job=[humanResourceBatchJob]], jobParameters=[{}]
2025-06-22T10:15:44.001+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:44.001+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT VERSION
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID=?
]
2025-06-22T10:15:44.002+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL query
2025-06-22T10:15:44.002+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [SELECT COUNT(*)
FROM BATCH_JOB_EXECUTION
WHERE JOB_EXECUTION_ID = ?
]
2025-06-22T10:15:44.002+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL update
2025-06-22T10:15:44.002+09:00 DEBUG 12432 --- [orgchart-api-batch] [  restartedMain] o.s.jdbc.core.JdbcTemplate               : Executing prepared SQL statement [UPDATE BATCH_JOB_EXECUTION
SET START_TIME = ?, END_TIME = ?,  STATUS = ?, EXIT_CODE = ?, EXIT_MESSAGE = ?, VERSION = ?, CREATE_TIME = ?, LAST_UPDATED = ?
WHERE JOB_EXECUTION_ID = ? AND VERSION = ?
]
2025-06-22T10:15:44.004+09:00  INFO 12432 --- [orgchart-api-batch] [  restartedMain] o.s.b.c.l.s.TaskExecutorJobLauncher      : Job: [SimpleJob: [name=humanResourceBatchJob]] completed with the following parameters: [{}] and the following status: [COMPLETED] in 307ms

```
