import React from "react";
import { ApolloProvider } from "@apollo/client";
import Routes from "./Routes";
import client from "./config/apollo";
import { AuthProvider } from "./context/AuthContext";
import { FilterProvider } from "./components/ui/GlobalFilterBar";
import { NotificationProvider } from "./components/ui/AlertNotificationCenter";

import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <FilterProvider>
                <Routes />
              </FilterProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
