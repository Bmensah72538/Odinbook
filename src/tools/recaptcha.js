import { useState, useEffect } from 'react';

const useRecaptcha = (siteKey) => {
    const [captchaToken, setCaptchaToken] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Load the reCAPTCHA script dynamically when the component mounts
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.onload = () => setLoaded(true);
        script.onerror = () => console.error('Error loading reCAPTCHA script');
        document.body.appendChild(script);
    }, [siteKey]);

    const executeCaptcha = async () => {
        if (!loaded) return;
        try {
            // Execute reCAPTCHA and get the token
            const token = await window.grecaptcha.execute(siteKey, { action: 'signup' });
            setCaptchaToken(token);
            return token;
        } catch (error) {
            console.error('Error executing reCAPTCHA', error);
        }
    };

    return { captchaToken, executeCaptcha, loaded };
};

export default useRecaptcha;
