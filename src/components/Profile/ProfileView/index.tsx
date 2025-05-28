'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, Settings } from 'lucide-react';
import { Session } from 'next-auth';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { HaikuMonument } from '@/types/haiku';

interface ProfileViewProps {
  user: Session['user'];
}

export function ProfileView({ user }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState('favorites');

  // モックデータ - 実際の実装では適切なAPIを使用してデータを取得する
  const favorites: HaikuMonument[] = []; // お気に入り句碑
  const visited: HaikuMonument[] = []; // 訪問済み句碑

  return (
    <div className="max-w-4xl mx-auto">
      {/* プロフィールヘッダー */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card rounded-lg shadow-sm">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-background">
          {user?.image ? (
            <Image
              alt={user.name || 'ユーザープロフィール画像'}
              className="object-cover"
              fill
              src={user.image}
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user?.name || 'ユーザー'}</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button asChild className="gap-2" variant="outline">
            <Link href="/profile/settings">
              <Settings size={16} />
              設定
            </Link>
          </Button>
        </div>
      </div>

      {/* タブ切り替え */}
      <Tabs
        className="w-full"
        defaultValue={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6 grid grid-cols-2 md:w-[400px]">
          <TabsTrigger className="flex items-center gap-2" value="favorites">
            <Heart size={16} />
            お気に入り句碑
          </TabsTrigger>
          <TabsTrigger className="flex items-center gap-2" value="visited">
            <MapPin size={16} />
            訪問済み句碑
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((monument) => (
                <HaikuCard key={monument.id} monument={monument} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                お気に入り登録した句碑はありません
              </h3>
              <p className="text-muted-foreground mb-6">
                気に入った句碑をお気に入り登録して、いつでも見返せるようにしましょう
              </p>
              <Button asChild>
                <Link href="/list">句碑を探す</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="visited">
          {visited.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visited.map((monument) => (
                <HaikuCard key={monument.id} monument={monument} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">訪問記録がありません</h3>
              <p className="text-muted-foreground mb-6">
                訪れた句碑を記録して、あなたの句碑めぐりの思い出を残しましょう
              </p>
              <Button asChild>
                <Link href="/map">地図で句碑を探す</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
