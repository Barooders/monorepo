export const identify = (
  email: string,
  firstName?: string,
  lastName?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!window.klaviyo) {
    console.warn('Klaviyo was not loaded');
    return;
  }
  window.klaviyo.identify({
    $email: email,
    $first_name: firstName,
    $last_name: lastName,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trackEvent = (event: any[]) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!window.klaviyo) {
    console.warn('Klaviyo was not loaded');
    return;
  }
  window.klaviyo.push(event);
};
