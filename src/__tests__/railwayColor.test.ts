import { describe, it, expect } from 'vitest';
import { getRailwayColor } from '../utils/railwayColor';

describe('getRailwayColor', () => {
  it('JR東日本の山手線は黄緑を返す', () => {
    expect(getRailwayColor('東日本旅客鉄道', '山手線')).toBe('#9ACD32');
  });

  it('JR東日本の中央線はオレンジを返す', () => {
    expect(getRailwayColor('東日本旅客鉄道', '中央本線')).toBe('#F15A22');
  });

  it('JR東日本の未知路線はJR東日本デフォルト色を返す', () => {
    expect(getRailwayColor('東日本旅客鉄道', '未知線')).toBe('#F15A22');
  });

  it('JR東海の東海道新幹線は青を返す', () => {
    expect(getRailwayColor('東海旅客鉄道', '東海道新幹線')).toBe('#0072BC');
  });

  it('東京地下鉄の銀座線はオレンジを返す', () => {
    expect(getRailwayColor('東京地下鉄', '銀座線')).toBe('#F9922E');
  });

  it('東京地下鉄の丸ノ内線は赤を返す', () => {
    expect(getRailwayColor('東京地下鉄', '丸ノ内線')).toBe('#E60012');
  });

  it('東京都の大江戸線はマゼンタを返す', () => {
    expect(getRailwayColor('東京都', '大江戸線')).toBe('#D31F8C');
  });

  it('東急電鉄は会社カラーを返す', () => {
    expect(getRailwayColor('東急電鉄', '東急東横線')).toBe('#E60012');
  });

  it('小田急電鉄は会社カラーを返す', () => {
    expect(getRailwayColor('小田急電鉄', '小田原線')).toBe('#0066B3');
  });

  it('未知の事業者はデフォルト色を返す', () => {
    expect(getRailwayColor('未知の事業者', '未知線')).toBe('#888888');
  });
});
