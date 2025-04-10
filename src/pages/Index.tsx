
import React from 'react';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-gray-50">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Service Bot Buddy</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your interactive service manual assistant. Ask questions about our products, 
          troubleshooting, maintenance, and more!
        </p>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto">
        <div className="h-[600px]">
          <ChatBot />
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Service Bot Buddy - Your interactive service manual</p>
      </footer>
    </div>
  );
};

export default Index;
