import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { AIAssistant } from "@/components/AIAssistant";
import { AuthGate } from "@/components/AuthGate";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGate>
            <div className="flex bg-uaf-muted min-h-screen font-body">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <TopBar />
                    <main className="flex-1 overflow-y-auto p-6 relative">
                        {children}
                        <div className="h-10"></div> {/* Spacer */}
                    </main>
                </div>
                <AIAssistant />
            </div>
        </AuthGate>
    );
}
