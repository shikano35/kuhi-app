import { describe, expect, beforeEach } from 'vitest';
import { formatEstablishedDate, createUrlWithParams } from '@/lib/utils';

describe('ユーティリティ関数のテスト', () => {
  describe('formatEstablishedDate', () => {
    test('建立日をそのまま返すこと', () => {
      const input = '昭和12年4月';
      const result = formatEstablishedDate(input);
      expect(result).toBe(input);
    });

    test('空文字列の場合も正しく処理すること', () => {
      const input = '';
      const result = formatEstablishedDate(input);
      expect(result).toBe(input);
    });
  });

  describe('createUrlWithParams', () => {
    let originalLocation: Location;

    beforeEach(() => {
      originalLocation = window.location;
      const mockLocation = {
        ...originalLocation,
        origin: 'https://kuhi-app.example.com',
      };

      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });
    });

    test('パラメーターなしの場合は基本URLを返すこと', () => {
      const baseUrl = '/list';
      const params = {};
      const result = createUrlWithParams(baseUrl, params);
      expect(result).toBe('https://kuhi-app.example.com/list');
    });

    test('パラメーターありの場合はクエリ文字列付きURLを返すこと', () => {
      const baseUrl = '/list';
      const params = {
        region: '東海',
        poet_id: 1,
        search: '芭蕉',
      };
      const result = createUrlWithParams(baseUrl, params);
      expect(result).toBe(
        'https://kuhi-app.example.com/list?region=%E6%9D%B1%E6%B5%B7&poet_id=1&search=%E8%8A%AD%E8%95%89'
      );
    });

    test('undefinedの値はURLに含めないこと', () => {
      const baseUrl = '/list';
      const params = {
        region: '東海',
        poet_id: undefined,
        search: '芭蕉',
      };
      const result = createUrlWithParams(baseUrl, params);
      expect(result).toBe(
        'https://kuhi-app.example.com/list?region=%E6%9D%B1%E6%B5%B7&search=%E8%8A%AD%E8%95%89'
      );
      expect(result).not.toContain('poet_id');
    });

    test('ブール値を文字列に変換すること', () => {
      const baseUrl = '/list';
      const params = {
        is_reliable: true,
        has_reverse: false,
      };
      const result = createUrlWithParams(baseUrl, params);
      expect(result).toBe(
        'https://kuhi-app.example.com/list?is_reliable=true&has_reverse=false'
      );
    });

    test('数値を文字列に変換すること', () => {
      const baseUrl = '/list';
      const params = {
        limit: 10,
        offset: 0,
      };
      const result = createUrlWithParams(baseUrl, params);
      expect(result).toBe(
        'https://kuhi-app.example.com/list?limit=10&offset=0'
      );
    });
  });
});
