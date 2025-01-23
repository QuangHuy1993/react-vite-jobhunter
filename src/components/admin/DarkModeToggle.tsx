import React, { useState, useEffect } from 'react';
import { Switch } from 'antd';
import { MoonIcon, SunIcon } from 'lucide-react';

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDark(isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        }
    }, []);

    const toggleDarkMode = (checked: boolean) => {
        setIsDark(checked);
        localStorage.setItem('darkMode', checked.toString());
        if (checked) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    return (
        <div className="dark-mode-toggle">
            <SunIcon size={16} className={`toggle-icon ${!isDark ? 'active' : ''}`} />
            <Switch
                checked={isDark}
                onChange={toggleDarkMode}
                size="small"
                className="mx-2"
            />
            <MoonIcon size={16} className={`toggle-icon ${isDark ? 'active' : ''}`} />
        </div>
    );
};

export default DarkModeToggle;