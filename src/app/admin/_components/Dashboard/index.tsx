'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ContributionData,
  getContributions,
  updateContributionStatus,
} from '@/lib/actions';

export function AdminDashboard() {
  const queryClient = useQueryClient();

  const {
    data: contributionsData,
    error: contributionsError,
    isLoading,
  } = useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const result = await getContributions();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'approved' | 'rejected';
    }) => {
      const result = await updateContributionStatus(id, status);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    updateStatusMutation.mutate({ id, status });
  };

  const pendingContributions =
    contributionsData?.filter((c) => c.status === 'pending') || [];
  const approvedContributions =
    contributionsData?.filter((c) => c.status === 'approved') || [];
  const rejectedContributions =
    contributionsData?.filter((c) => c.status === 'rejected') || [];

  return (
    <div>
      {contributionsError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          <p>
            {contributionsError instanceof Error
              ? contributionsError.message
              : '投稿データの読み込み中にエラーが発生しました'}
          </p>
        </div>
      )}

      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            未承認 ({pendingContributions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            承認済み ({approvedContributions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            却下 ({rejectedContributions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="spinner" />
              <p className="mt-2 text-muted-foreground">読み込み中...</p>
            </div>
          ) : pendingContributions.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">未承認の投稿はありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingContributions.map((contribution) => (
                <ContributionCard
                  contribution={contribution}
                  isUpdating={updateStatusMutation.isPending}
                  key={contribution.id}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="spinner" />
              <p className="mt-2 text-muted-foreground">読み込み中...</p>
            </div>
          ) : approvedContributions.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-gray-500">承認済みの投稿はありません</p>
            </div>
          ) : (
            <div className="space-y-6">
              {approvedContributions.map((contribution) => (
                <ContributionCard
                  contribution={contribution}
                  isUpdating={updateStatusMutation.isPending}
                  key={contribution.id}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="spinner" />
              <p className="mt-2 text-muted-foreground">読み込み中...</p>
            </div>
          ) : rejectedContributions.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                却下された投稿はありません
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rejectedContributions.map((contribution) => (
                <ContributionCard
                  contribution={contribution}
                  isUpdating={updateStatusMutation.isPending}
                  key={contribution.id}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ContributionCardProps {
  contribution: ContributionData;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
  isUpdating: boolean;
}

function ContributionCard({
  contribution,
  onStatusChange,
  isUpdating,
}: ContributionCardProps) {
  const formattedDate = format(
    new Date(contribution.created_at),
    'yyyy年MM月dd日 HH:mm',
    { locale: ja }
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-primary">
            {contribution.title}
          </h3>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>

        <div className="mt-2 text-muted-foreground">{contribution.content}</div>

        <div className="mt-6 flex justify-end space-x-3">
          {contribution.status === 'pending' && (
            <>
              <button
                className="px-4 py-2 border border-primary/30 rounded-md text-sm font-medium text-primary hover:bg-muted/50 disabled:opacity-50"
                disabled={isUpdating}
                onClick={() => onStatusChange(contribution.id, 'rejected')}
              >
                却下
              </button>
              <button
                className="px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                disabled={isUpdating}
                onClick={() => onStatusChange(contribution.id, 'approved')}
              >
                承認
              </button>
            </>
          )}

          {contribution.status === 'approved' && (
            <button
              className="px-4 py-2 border border-primary/30 rounded-md text-sm font-medium text-primary hover:bg-muted/50 disabled:opacity-50"
              disabled={isUpdating}
              onClick={() => onStatusChange(contribution.id, 'rejected')}
            >
              承認を取り消す
            </button>
          )}

          {contribution.status === 'rejected' && (
            <button
              className="px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              disabled={isUpdating}
              onClick={() => onStatusChange(contribution.id, 'approved')}
            >
              再承認
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
