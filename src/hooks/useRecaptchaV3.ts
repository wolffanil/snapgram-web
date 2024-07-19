import { useState, useEffect, useCallback } from "react";

const useRecaptchaV3 = (siteKey: string) => {
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  useEffect(() => {
    //@ts-ignore
    if (window.grecaptcha) {
      setIsRecaptchaReady(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => setIsRecaptchaReady(true);
    }
  }, [siteKey]);

  const executeRecaptcha = useCallback(
    async (action: string) => {
      //@ts-ignore
      if (isRecaptchaReady && window.grecaptcha) {
        //@ts-ignore

        return await window.grecaptcha.execute(siteKey, { action });
      }
      return null;
    },
    [isRecaptchaReady, siteKey]
  );

  return executeRecaptcha;
};

export default useRecaptchaV3;
