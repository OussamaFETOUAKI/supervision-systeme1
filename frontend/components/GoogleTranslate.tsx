"use client";

import { useEffect } from "react";

export default function GoogleTranslate() {
    useEffect(() => {
        // Prevent adding multiple scripts if component remounts
        if (document.getElementById("google-translate-script")) return;

        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        // Define the callback globally
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                { pageLanguage: 'en', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
                'google_translate_element'
            );
        };
    }, []);

    return (
        <div className="relative group flex items-center justify-center">
            {/* Custom Modern Globe Icon */}
            <div className="absolute left-3 pointer-events-none z-10 text-sky-400 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </div>
            
            <div id="google_translate_element" className="translate-wrapper"></div>

            {/* Custom Dropdown Arrow */}
            <div className="absolute right-3 pointer-events-none z-10 text-sky-500 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
    );
}
