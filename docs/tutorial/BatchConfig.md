## BatchConfig

#### (src/main/java/com/example/orgchart_api/config/BatchConfig.java)

```java
package com.example.orgchart_api.config;

import com.example.orgchart_api.batch.util.BatchSettings;
import com.example.orgchart_api.batch.util.ErrorFileManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MutablePropertySources;

import java.util.Properties;

@Configuration
public class BatchConfig {

    private final Environment env;

    public BatchConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public BatchSettings batchSettings() {
        return new BatchSettings(collectAllProperties());
    }

    @Bean
    public Properties applicationProperties() {
        return collectAllProperties();
    }

    // ErrorFileManager をビーンとして定義
    @Bean
    public ErrorFileManager errorFileManager(BatchSettings batchSettings) {
        String errorDir = batchSettings.getOutPutErrFileDir(); // プロパティから取得
        String errorPrefix = batchSettings.getOutPutErrFileNm(); // プロパティから取得
        return new ErrorFileManager(errorDir, errorPrefix);
    }

    private Properties collectAllProperties() {
        Properties props = new Properties();
        MutablePropertySources propertySources = ((AbstractEnvironment) env).getPropertySources();

        // OSを判別
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String osSuffix = isWindows ? ".Win32" : ".Linux";

        propertySources.stream()
                .filter(ps -> ps instanceof org.springframework.core.env.EnumerablePropertySource)
                .forEach(ps -> {
                    org.springframework.core.env.EnumerablePropertySource<?> enumerablePs =
                            (org.springframework.core.env.EnumerablePropertySource<?>) ps;

                    for (String propName : enumerablePs.getPropertyNames()) {
                        Object value = enumerablePs.getProperty(propName);
                        if (value != null) {
                            // OS依存プロパティを解決
                            if (propName.endsWith(".Win32") || propName.endsWith(".Linux")) {
                                if (propName.endsWith(osSuffix)) {
                                    // 基本キー名に変換 (例: InputDir.Win32 -> InputDir)
                                    String baseKey = propName.substring(0, propName.lastIndexOf('.'));
                                    props.setProperty(baseKey, value.toString());
                                }
                            } else {
                                props.setProperty(propName, value.toString());
                            }
                        }
                    }
                });

        return props;
    }
}
```
