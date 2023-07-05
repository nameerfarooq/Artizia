import React, { createContext, useState } from 'react';

// Create the context
const GlobalContext = createContext();

// Create a provider component
const GlobalProvider = ({ children }) => {
    const [activeTabsSetting, setactiveTabsSetting] = useState('Notification');
    const [DashboardActiveTab, setDashboardActiveTab] = useState('dashboard')
    const [sidebarCollapsed, setsidebarCollapsed] = useState(true)
    const context_state = { sidebarCollapsed, setsidebarCollapsed, activeTabsSetting, setactiveTabsSetting, DashboardActiveTab, setDashboardActiveTab }
    return (
        <GlobalContext.Provider value={context_state}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalProvider, GlobalContext };
