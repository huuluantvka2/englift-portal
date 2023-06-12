import { AuthProvider } from "@/components/authContext";
import { RootStyleRegistry } from '@/components/root-style-registry';
import { Providers } from "@/redux/provider";
import "../styles/_app.scss";
import Head from "next/head";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin Tieng Anh Tot',
  icons: {
    icon: '/favicon.ico'
  }
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootStyleRegistry>
            <AuthProvider>
              <div className='root-layout'>
                {children}
              </div>
            </AuthProvider>
          </RootStyleRegistry>
        </Providers>
      </body>
    </html>
  )
}
