# 東京都鉄道GISアプリ

OpenLayersを使って東京都の鉄道路線・駅を地図上に表示するWebアプリ。
路線をクリックすると路線名・運営会社名が、駅にホバーすると駅名・路線名がポップアップ表示される。

## 技術スタック

- **React + TypeScript** - UIフレームワーク
- **Vite** - ビルドツール
- **OpenLayers** - 地図描画ライブラリ
- **Material UI (MUI)** - UIコンポーネントライブラリ
- **pnpm** - パッケージマネージャー
- **Vitest** - ユニットテスト
- **Playwright** - E2Eテスト
- **GitHub Pages** - ホスティング

## セットアップ

```bash
pnpm install
```

## 開発サーバー起動

```bash
pnpm run dev
```

http://localhost:5173/tokyo-railway-gis/ をブラウザで開く。

## テスト

```bash
# ユニットテスト
pnpm test

# ユニットテスト（カバレッジ計測）
pnpm test:coverage

# E2Eテスト
pnpm test:e2e
```

## ビルド・デプロイ

```bash
# ビルド
pnpm run build

# GitHub Pagesへデプロイ
pnpm run deploy
```

## データ

`public/data/` 以下のGeoJSONファイルを使用（リポジトリには含まれない）。

| ファイル | 内容 | 取得元 |
|----------|------|--------|
| `tokyo_municipality.geojson` | 東京都市区町村境界 | 国土数値情報 N03 |
| `tokyo_railway.geojson` | 東京都鉄道路線（LineString） | 国土数値情報 N02 |
| `tokyo_station.geojson` | 東京都駅（MultiLineString） | 国土数値情報 N02 |

取得・変換手順は [CLAUDE.md](./CLAUDE.md) を参照。
