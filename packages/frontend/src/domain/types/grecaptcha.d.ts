declare global {
  interface Window {
    grecaptcha: ReCaptchaV3;
  }

  interface ReCaptchaV3 {
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  }

  const grecaptcha: ReCaptchaV3;
}

export {};
