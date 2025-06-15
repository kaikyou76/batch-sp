## LabelValueModel

```java
package com.example.orgchart_api.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * <pre>
 * LABEL/VALUEモデルクラス（不変オブジェクト）
 *
 *
 * @author Yao kaikyou
 * @version 2.0 2023/07/20
 */
public final class LabelValueModel implements Serializable {
    private static final long serialVersionUID = 2L;

    private final String label;
    private final String value;

    /**
     * プライベートコンストラクタ
     */
    private LabelValueModel(String label, String value) {
        this.label = Objects.requireNonNull(label, "label must not be null");
        this.value = Objects.requireNonNull(value, "value must not be null");
    }

    /**
     * ファクトリメソッド
     * @param label 表示ラベル
     * @param value 値
     * @return LabelValueModelインスタンス
     */
    public static LabelValueModel of(String label, String value) {
        return new LabelValueModel(label, value);
    }

    /**
     * Builderを取得
     * @return Builderインスタンス
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * labelを取得
     * @return label
     */
    public String getLabel() {
        return label;
    }

    /**
     * valueを取得
     * @return value
     */
    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LabelValueModel that = (LabelValueModel) o;
        return label.equals(that.label) && value.equals(that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(label, value);
    }

    @Override
    public String toString() {
        return "LabelValueModel{" +
                "label='" + label + '\'' +
                ", value='" + value + '\'' +
                '}';
    }

    /**
     * Builderクラス
     */
    public static final class Builder {
        private String label;
        private String value;

        private Builder() {}

        public Builder label(String label) {
            this.label = Objects.requireNonNull(label, "label must not be null");
            return this;
        }

        public Builder value(String value) {
            this.value = Objects.requireNonNull(value, "value must not be null");
            return this;
        }

        public LabelValueModel build() {
            return new LabelValueModel(label, value);
        }
    }
}

```
