import MainLayout from '@/components/layout/MainLayout';
import VideoFeed from '@/components/ui/VideoFeed';

export default function HomePage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">For You</h1>
      <VideoFeed mode="forYou" />
    </MainLayout>
  );
}