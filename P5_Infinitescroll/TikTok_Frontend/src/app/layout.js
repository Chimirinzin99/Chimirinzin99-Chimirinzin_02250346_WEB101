import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'TikTok Clone',
  description: 'A TikTok-like video sharing platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}