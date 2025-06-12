<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">pom 依存関係問題の解決</span>

# 問題一

> `@Entity` が `Cannot resolve symbol 'Entity'` となる原因は、**JPA（Jakarta Persistence API）関連の依存関係が `pom.xml` に含まれていないため**です。

---

## ✅ 解決方法

以下の依存関係を `pom.xml` に追加してください：

```xml
<dependency>
  <groupId>jakarta.persistence</groupId>
  <artifactId>jakarta.persistence-api</artifactId>
  <version>3.1.0</version>
</dependency>
```

または、**Spring Boot で標準的に JPA を使う場合**は、次の依存を使うほうが一般的です：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

---

## 🔁 追記後の手順

1. `pom.xml` に上記の依存を追加。
2. IDE（IntelliJ など）で **Maven の再インポート**（"Load Maven Changes"）を実行。
3. 必要に応じて `import jakarta.persistence.Entity;` を補完。

---

# 問題二

`Cannot resolve symbol 'Getter'` エラーは、`@Getter` アノテーションが認識されていない状態です。

このアノテーションは **Lombok** というライブラリの一部なので、下記の対策が必要です。

---

## 1. Lombok 依存を`pom.xml`に追加

```xml
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.30</version> <!-- 2025年6月現在の最新安定版 -->
  <scope>provided</scope>
</dependency>
```

※バージョンは最新安定版を調べてください。

---

## 2. IDE で Lombok プラグインをインストール・有効化

- IntelliJ IDEA の場合
  **Settings > Plugins** から `Lombok` を検索してインストール
  → 再起動してください

- Eclipse の場合
  Lombok プラグインをインストールしてください。

---

## 3. Maven プロジェクトの再インポート

IDE の Maven ビューで「Reload All Maven Projects」などを実行して依存を読み込み直してください。

---

## 4. ソースコードでのインポート例

```java
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
```

---

## まとめ

- `@Getter` は Lombok のアノテーションなので、Lombok がプロジェクトに入ってないと認識されません。
- 依存追加と IDE の Lombok プラグイン設定で解決します。

# 問題三

`Cannot resolve symbol 'PasswordEncoder'` というエラーは、`PasswordEncoder` がどこにも定義されておらず、**インポートされていない**、あるいは**依存関係（ライブラリ）が `pom.xml` に含まれていない**場合に発生します。

---

## ✅ 解決手順

### ① Spring Security の依存を `pom.xml` に追加

まず、`PasswordEncoder` は Spring Security に含まれるインターフェースなので、`pom.xml` に以下の依存を追加してください：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

追加したら、IDE（IntelliJ など）で **Maven を再インポート**（`右上のMaven -> Reimport` ボタン）してください。

---

### ② インポートを追加

クラスの冒頭に以下を追加してください：

```java
import org.springframework.security.crypto.password.PasswordEncoder;
```

---

## ✅ PasswordEncoder 実装例

たとえば `BCryptPasswordEncoder` を使いたい場合は、以下のように設定します：

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
```

---

## ✅ 使用例まとめ

```java
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

...

User user = ...;
PasswordEncoder encoder = new BCryptPasswordEncoder();
user.updatePassword("newPassword123", encoder);
```

---

## 🧠 補足：Spring Boot アプリでの Bean 登録（おすすめ）

アプリ全体で使い回したい場合、`@Bean` で登録して DI（依存性注入）しても OK：

```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

その後、`@Autowired` などで使えます。

---

不明点があれば、`pom.xml` や `updatePassword()` の使用箇所を教えていただければ、より具体的に対応できます！

ありがとうございます。「**Maven -> Sync Project**」が見つかったということは、あなたは IntelliJ IDEA を使っていて、`pom.xml` の依存関係を再読み込みしようとしている状況ですね。

それで正しいです！
実際にやるべきことは以下の手順です。

---

## ✅ `PasswordEncoder` を使えるようにする完全手順（IntelliJ IDEA）

### ① `pom.xml` に Spring Security の依存を追加

`pom.xml` ファイルを開いて、以下の依存を `<dependencies>` 内に追加してください：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### ② 「Sync Project」で依存関係を反映

IntelliJ IDEA の右上の **Maven タブ**（「縦に並んだアイコンたち」）から：

- 「🔄 Sync Project」ボタンをクリック
  　または
- `pom.xml` ファイルを右クリック → 「Maven」→「Reimport」

これで `PasswordEncoder` が使えるようになります。

---

### ③ インポートを追加

クラスの先頭に下記を追加：

```java
import org.springframework.security.crypto.password.PasswordEncoder;
```

さらに `BCryptPasswordEncoder` を使う場合：

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
```

---

### ✔ 確認コード

```java
PasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode("my-password");
System.out.println("Hashed: " + hash);
```

---

### ❓ 補足：Maven が効かない場合

もし「`PasswordEncoder` がまだ解決できない」なら、以下を確認してください：

- `pom.xml` に `<dependency>` を **正しく追加しているか**
- `<dependencies>` タグの中に入れているか
- プロジェクト全体を右クリック →「Maven」→「Reload Project」したか

---

不明点があれば、あなたの `pom.xml` を貼ってもらえれば、こちらで正しい状態をチェックできますよ。
