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
