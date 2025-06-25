# HumanResourceJobConfig

### (src/main/java/com/example/orgchart_api/batch/job/HumanResourceJobConfig.java)

```java
package com.example.orgchart_api.batch.job;

import com.example.orgchart_api.batch.step.processor.SimpleProcessor;
import com.example.orgchart_api.batch.step.reader.SimpleReader;
import com.example.orgchart_api.batch.step.writer.LoadStaffInfoWriter;
import com.example.orgchart_api.batch.util.BatchSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.*;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;

@Configuration
@EnableBatchProcessing
public class HumanResourceJobConfig {
    private static final Logger logger = LoggerFactory.getLogger(HumanResourceJobConfig.class);

    private final JobRepository jobRepository;
    private final BatchSettings batchSettings;
    private final PlatformTransactionManager transactionManager;
    private final JdbcTemplate jdbcTemplate;
    private final LoadStaffInfoWriter loadStaffInfoWriter;

    public HumanResourceJobConfig(
            JobRepository jobRepository,
            BatchSettings batchSettings,
            PlatformTransactionManager transactionManager,
            JdbcTemplate jdbcTemplate,
            LoadStaffInfoWriter loadStaffInfoWriter) {
        this.jobRepository = jobRepository;
        this.batchSettings = batchSettings;
        this.transactionManager = transactionManager;
        this.jdbcTemplate = jdbcTemplate;
        this.loadStaffInfoWriter = loadStaffInfoWriter;
    }

    // ジョブ定義
    @Bean
    public Job humanResourceBatchJob() {
        return new JobBuilder("humanResourceBatchJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .listener(jobExecutionListener())
                .start(stagingTableInitializationStep())
                .next(sampleChunkStep()) // 追加したチャンク処理ステップ
                .next(loadStaffInfoStep())
                .next(thresholdCheckStep())
                .build();
    }

    // 新しいチャンク処理ステップ
    @Bean
    public Step sampleChunkStep() {
        return new StepBuilder("sampleChunkStep", jobRepository)
                .<List<Integer>, List<Integer>>chunk(1, transactionManager)
                .reader(simpleReader())
                .processor(simpleProcessor())
                .writer(items -> logger.info("処理結果: {}", items))
                .transactionManager(transactionManager)
                .allowStartIfComplete(true)
                .build();
    }

    // SimpleReaderのBean定義
    @Bean
    public SimpleReader simpleReader() {
        return new SimpleReader();
    }

    // SimpleProcessorのBean定義
    @Bean
    public SimpleProcessor simpleProcessor() {
        return new SimpleProcessor();
    }

    // 既存のその他のメソッドは変更なし（以下に続く）

    // ジョブ実行リスナー
    @Bean
    public JobExecutionListener jobExecutionListener() {
        return new JobExecutionListener() {
            @Override
            public void beforeJob(JobExecution jobExecution) {
                logger.info("ジョブ開始: {}", jobExecution.getJobParameters());
            }

            @Override
            public void afterJob(JobExecution jobExecution) {
                if (jobExecution.getStatus() == BatchStatus.FAILED) {
                    logger.warn("ジョブ失敗: {}", jobExecution.getExitStatus().getExitDescription());
                }
            }
        };
    }

    // ステージングテーブル初期化ステップ
    public Step stagingTableInitializationStep() {
        return new StepBuilder("stagingTableInitializationStep", jobRepository)
                .tasklet(stagingInitializationTasklet(), transactionManager)
                .allowStartIfComplete(true)
                .startLimit(3)
                .listener(stepExecutionListener())
                .build();
    }

    // ステップ実行リスナー
    @Bean
    public StepExecutionListener stepExecutionListener() {
        return new StepExecutionListener() {
            @Override
            public void beforeStep(StepExecution stepExecution) {
                logger.info("ステップ開始: {}", stepExecution.getStepName());
            }

            @Override
            public ExitStatus afterStep(StepExecution stepExecution) {
                logger.info("ステップ完了: {}", stepExecution.getStatus());
                return stepExecution.getExitStatus();
            }
        };
    }

    // ステージングテーブル初期化処理
    @Bean
    public Tasklet stagingInitializationTasklet() {
        return (contribution, chunkContext) -> {
            logger.info("===== ステージングテーブル初期化開始 =====");
            try {
                jdbcTemplate.update("DELETE FROM biz_ad");
                jdbcTemplate.update("DELETE FROM biz_department");
                jdbcTemplate.update("DELETE FROM biz_employee");
                jdbcTemplate.update("DELETE FROM biz_organization");
                jdbcTemplate.update("DELETE FROM biz_shift");
                logger.info("===== 初期化完了 =====");
                return RepeatStatus.FINISHED;
            } catch (DataAccessException e) {
                logger.error("データアクセスエラー", e);
                throw new RetryableException("データベースエラー", e);
            } catch (Exception e) {
                logger.error("初期化処理失敗", e);
                throw e;
            }
        };
    }

    // メイン処理ステップ
    @Bean
    public Step loadStaffInfoStep() {
        return new StepBuilder("loadStaffInfoStep", jobRepository)
                .tasklet(loadStaffInfoWriter, transactionManager)
                .allowStartIfComplete(true)
                .startLimit(3)
                .build();
    }

    // 閾値チェックステップ
    @Bean
    public Step thresholdCheckStep() {
        return new StepBuilder("thresholdCheckStep", jobRepository)
                .tasklet(thresholdCheckTasklet(), transactionManager)
                .allowStartIfComplete(true)
                .build();
    }

    @Bean
    public Tasklet thresholdCheckTasklet() {
        return (contribution, chunkContext) -> {
            logger.info("===== 閾値チェック開始 =====");
            logger.info("===== チェック完了 =====");
            return RepeatStatus.FINISHED;
        };
    }

    // 再試行可能例外クラス
    private static class RetryableException extends DataAccessException {
        public RetryableException(String msg, Throwable cause) {
            super(msg, cause);
        }
    }
}

```
