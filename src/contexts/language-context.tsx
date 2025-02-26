import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { en } from './locales/en';
import { vi } from './locales/vi';

// Các ngôn ngữ được hỗ trợ
export type Language = 'VI' | 'EN';
export type TranslationKey = keyof typeof vi | string;

interface LanguageContextType {
    currentLang: Language;
    t: (key: TranslationKey) => string;
    changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Lấy ngôn ngữ từ localStorage hoặc sử dụng mặc định là VI
    const [currentLang, setCurrentLang] = useState<Language>(
        () => (localStorage.getItem('preferredLanguage') as Language) || 'VI'
    );

    // Các bản dịch
    const translations = {
        VI: vi,
        EN: en
    };

    // Cập nhật localStorage khi ngôn ngữ thay đổi
    useEffect(() => {
        localStorage.setItem('preferredLanguage', currentLang);
    }, [currentLang]);

    // Hàm lấy chuỗi từ bản dịch theo key
    const t = (key: TranslationKey): string => {
        const translation = translations[currentLang];

        // Xử lý key phức tạp (ví dụ: 'locations.hcm')
        if (key.includes('.')) {
            const keys = key.split('.');
            let result: any = translation;
            for (const k of keys) {
                if (result && typeof result === 'object' && k in result) {
                    result = result[k];
                } else {
                    return key; // Trả về key nếu không tìm thấy
                }
            }
            return result as string;
        }

        // Xử lý key đơn giản
        const result = translation[key as keyof typeof translation];
        return typeof result === 'string' ? result : key;
    };

    // Hàm thay đổi ngôn ngữ
    const changeLanguage = (lang: Language) => {
        setCurrentLang(lang);
    };

    return (
        <LanguageContext.Provider value={{ currentLang, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook custom để sử dụng ngôn ngữ trong components
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};