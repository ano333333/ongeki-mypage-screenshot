# Contributing

## 開発環境のセットアップ

このプロジェクトは [Nix flakes](https://nixos.wiki/wiki/Flakes) で開発環境を管理しているのだ。

```bash
# リポジトリをクローン
git clone https://github.com/ano333333/ongeki-mypage-screenshot.git
cd ongeki-mypage-screenshot

# Nix 開発シェルに入る
nix develop

# または direnv を使う場合
direnv allow
```

依存パッケージのインストール:

```bash
nix develop --command pnpm install
```

## ビルド・動作確認

```bash
# 本番ビルド（embed.js が GitHub Pages の URL を参照）
nix develop --command pnpm build

# ローカルテスト用ビルド（embed.js が localhost:4173 を参照）
nix develop --command pnpm build:local

# ローカルで動作確認する場合
nix develop --command pnpm build:local
nix develop --command pnpm preview        # localhost:4173 でサーブ
xdg-open dist/index.html                  # ランディングページを開く
# ランディングページからブックマークレットをコピーして ongeki-net.com で実行する
```

## コミットメッセージ規約

[Angular Commit Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format) に従うのだ。

### フォーマット

```
<type>(<scope>): <subject>
```

### スコープ

| スコープ  | 対象                                  |
| --------- | ------------------------------------- |
| `playlog` | プレイログのスクリーンショット機能    |
| `front`   | GitHub Pages ランディングページ       |
| `ci`      | CI/CD・ビルド設定・GitHub Actions     |
| (省略)    | 上記に当てはまらないもの（docs など） |

### 例

```
feat(playlog): スクリーンショット選択機能を追加
fix(front): コピーボタンのフィードバックタイミングを修正
docs: コミット規約を CONTRIBUTING.md に追記
chore: 依存パッケージを更新
```

## ライセンス

コントリビュートした内容は [MIT License](LICENSE.md) のもとで公開されるのだ。
