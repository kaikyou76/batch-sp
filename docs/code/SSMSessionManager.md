# SSMSessionManager

このメッセージは、**AWS Systems Manager (SSM) Session Manager** を使って EC2 インスタンスに接続しようとしているものの、以下の問題があることを示しています：

---

## ❌ 問題内容

### 1. **必要な IAM ロールがインスタンスにアタッチされていない**

- SSM Session Manager を使用するには、EC2 インスタンスに次の IAM ロールがアタッチされている必要があります：
  - `AmazonSSMManagedInstanceCore`（必須）
  - 必要に応じて `AmazonSSMSessionManagerRunner` も追加

#### 対応手順：

1. AWS コンソールで **IAM コンソール** へ移動
2. 左メニューから「ロール」→「ロールの作成」を選択
3. 「使用ケースの選択」で「EC2」を選択し、チェックボックスに `AmazonSSMManagedInstanceCore` を選ぶ
4. ロール名を入力（例: `SSMInstanceRole`）して作成
5. EC2 コンソール → 対象インスタンス → アクション → セキュリティ → IAM ロールの変更
6. 先ほど作成したロールをアタッチ

> ⏱ インスタンスにロールをアタッチした後、Session Manager の利用可能状態になるまで数分かかります。

---

### 2. **SSM Agent がインストール・実行されているか確認**

インスタンス内に **SSM Agent** が正しくインストールされ、サービスが実行されている必要があります。

#### 状態確認方法（インスタンス内部で実行）：

```bash
sudo systemctl status amazon-ssm-agent
```

#### 起動していない場合：

```bash
sudo systemctl start amazon-ssm-agent
```

#### 自動起動設定：

```bash
sudo systemctl enable amazon-ssm-agent
```

---

### 3. **VPC / ネットワーク構成の確認**

- インスタンスがインターネットにアクセスできるようにするため、以下が必要です：
  - **NAT Gateway or NAT Instance**（プライベートサブネットの場合）
  - **パブリック IP の割り当て**（パブリックサブネットの場合）
  - **ルートテーブル**にインターネットゲートウェイ（IGW）への経路があること

---

## ✅ 復旧フローまとめ

| ステップ                     | 内容                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------- |
| ① IAM ロールの作成とアタッチ | `AmazonSSMManagedInstanceCore` を含むロールを作成し、対象インスタンスにアタッチ |
| ② SSM Agent の状態確認       | `amazon-ssm-agent` の起動・自動起動設定を行う                                   |
| ③ ネットワーク構成の確認     | インターネットアクセスが可能であること                                          |
| ④ Session Manager での接続   | 数分後に再度セッションを開く                                                    |

---

上記のステップを一つずつ実施することで、Session Manager を通じて EC2 インスタンスに接続できるようになります。  
接続できれば、`pg_hba.conf` の編集や SSH 設定の確認など、必要作業を実施できます。

ご不明点や途中でエラーが出る場合は、その内容をお知らせください。個別に対応いたします。
