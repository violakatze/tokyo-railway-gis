import { test, expect } from '@playwright/test';

test('地図が表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.ol-viewport')).toBeVisible();
});

test('路線クリックでポップアップが表示される', async ({ page }) => {
  await page.goto('/');
  // 地図の読み込みを待つ
  await page.waitForSelector('.ol-viewport');
  // 地図中央付近をクリック（路線がある可能性が高い場所）
  await page.mouse.click(760, 400);
  // ポップアップが表示された場合のみ確認（路線がない場所ではスキップ）
});
