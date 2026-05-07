import MainLayout from '@/components/layout/MainLayout';
import VideoFeed from '@/components/ui/VideoFeed';

export default function FollowingPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      <VideoFeed mode="following" />
    </MainLayout>
  );
}