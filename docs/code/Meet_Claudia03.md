# Meet Claudia 導入版（Claudia GUI + Claude CLI）を始める手順

どういたしまして！😊

パソコンを再起動したあとに **Meet Claudia 導入版**（Claudia GUI + Claude CLI）を始める手順はこんな感じです：

---

## 再起動後の起動手順

1. **端末（PowerShell や CMD など）を開く**
   例えば、Windows のスタートメニューから「PowerShell」や「コマンドプロンプト」を起動。

2. **Claudia プロジェクトのディレクトリへ移動**
   Claudia をクローン・ビルドしたフォルダに移動します。

   ```powershell
   cd D:\claudia
   ```

3. **依存関係のインストール（初回のみ or 変更あった時）**

   ```powershell
   bun install
   ```

   ※Bun が PATH に通っている必要があります。

4. **Claudia の開発サーバーを起動**

   ```powershell
   bun run tauri dev
   ```

   これでビルド＆起動されて、開発用サーバーが立ちます。

5. **ブラウザで [http://localhost:1420/](http://localhost:1420/) にアクセス**
   Claudia GUI が表示され、使い始められます。

---

## 注意点

- **claude CLI はグローバルにインストール済み**なので、`claude` コマンドはどのフォルダからでも使えます。
- Bun や Rust の環境変数が通っている状態で起動してください。
- 実際に使う時は、`bun run tauri dev`を起動したまま、別の端末やブラウザで操作します。

---

もし頻繁に使うなら、バッチファイルや PowerShell スクリプトにまとめるのも楽ですよ。

---

何か手順でつまずいたら教えてください！また詳しくサポートしますね。
