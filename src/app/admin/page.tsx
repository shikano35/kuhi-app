import { AdminDashboard } from './_components/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理ダッシュボード | くひめぐり',
  description:
    '句碑情報の管理、ユーザー管理、投稿の確認ができる管理者用ダッシュボードです。',
};

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        管理ダッシュボード
      </h1>
      <AdminDashboard />
    </div>
  );
}
