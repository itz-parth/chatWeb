import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FriendsProvider } from './context/FriendsContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FriendsProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </FriendsProvider>
    </AuthProvider>
  </StrictMode>
);
