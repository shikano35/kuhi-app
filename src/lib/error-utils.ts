type LogLevel = 'error' | 'warn' | 'info';

interface ErrorLogOptions {
  context?: string;
  userId?: string;
  action?: string;
}

/**
 * エラーログを適切に処理するユーティリティ
 * 本番環境では外部ログサービスへの送信なども可能
 */
export function logError(
  error: unknown,
  level: LogLevel = 'error',
  options: ErrorLogOptions = {}
): void {
  const { context, userId, action } = options;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const timestamp = new Date().toISOString();

  const logData = {
    timestamp,
    level,
    message: errorMessage,
    context,
    userId,
    action,
    stack: error instanceof Error ? error.stack : undefined,
  };

  if (process.env.NODE_ENV === 'development') {
    console[level]('Error Log:', logData);
  }
}

/**
 * エラーメッセージに変換
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Failed to remove favorite')) {
      return 'お気に入りの削除に失敗しました。もう一度お試しください。';
    }
    if (error.message.includes('Failed to remove visit')) {
      return '訪問記録の削除に失敗しました。もう一度お試しください。';
    }
    if (error.message.includes('Network')) {
      return 'ネットワークエラーが発生しました。接続を確認してください。';
    }
  }

  return '予期しないエラーが発生しました。しばらく待ってからお試しください。';
}
