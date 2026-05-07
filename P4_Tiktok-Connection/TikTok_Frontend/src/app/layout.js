import { AuthProvider } from '@/contexts/authContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'TikTok Clone',
  description: 'A TikTok-like video sharing platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}