import './globals.css'
import { ContractProvider } from '../contexts/ContractContext'
import ClientLayout from './components/ClientLayout'

export const metadata = {
    title: 'Chess Tournament Platform',
    description: 'On-chain chess tournament platform with stablecoin prize pools',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <ContractProvider>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </ContractProvider>
            </body>
        </html>
    )
}