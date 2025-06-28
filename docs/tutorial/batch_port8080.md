# 必要なポート 8080 はすでに使用中問題の解決方法

### エラー再現イメージ

```
***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.

Disconnected from the target VM, address: '127.0.0.1:65391', transport: 'socket'

Process finished with exit code 0

```

### 解消方法

```batch
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

新機能と改善のために最新の PowerShell をインストールしてください!https://aka.ms/PSWindows

PS C:\Users\kaikyou> netstat -ano | findstr :8080
  TCP         0.0.0.0:8080           0.0.0.0:0              LISTENING       10440
  TCP         [::]:8080              [::]:0                 LISTENING       10440
PS C:\Users\kaikyou> taskkill /PID 10440 /F
成功: PID 10440 のプロセスは強制終了されました。
PS C:\Users\kaikyou>

```
