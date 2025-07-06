# ✅ 　登録後のアプローチ

今登録が成功になり、下記レスポンスもバックエンドから返却されました。

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsIm5hbWUiOiJIQUlKSUFORyBZQU8iLCJzdWIiOiJrYWlreW91QGdtYWlsLmNvbSIsImlhdCI6MTc1MTM5Njc4OSwiZXhwIjoxNzUxNDgzMTg5fQ.5wuGxeyKiwRH-k5acLIh7SlJ84ASuj5oAqma_2cbtqsefkpBHMCCY_FL4OVTxqqo6D-K6koxcCFvqfmHJeFh0Q",
  "email": "kaikyou@gmail.com",
  "name": "HAIJIANG YAO",
  "role": "user"
}
```

`登録後すぐにログイン状態になる（二度手間を省く）`

`ユーザーは即時サービス利用可能`

というユーザーエクスペリエンスの向上の方法が一番よさそうです。

しかし、セキュリティを特に重視要件を考慮すると、やはりログインしてから状態管理にすることにしました。

たしかにトークンを無視すると設計上の矛盾が生じるデメリットがありますが、システム安全を守るのが大事です。
