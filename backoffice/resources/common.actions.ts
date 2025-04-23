import cookie from 'cookie';

const extractBackofficeCookie = (request: any): string => {
  let cookieIdx = request.rawHeaders.indexOf('cookie');
  if (cookieIdx === -1) {
    cookieIdx = request.rawHeaders.indexOf('Cookie');
  }

  let parsedCookies: Record<string, string | undefined> = {};
  if (cookieIdx !== -1) {
    const cookieHeaderValue = request.rawHeaders[cookieIdx + 1];
    parsedCookies = cookie.parse(cookieHeaderValue);
  } else {
    throw new Error('Cookie header not found');
  }

  const backofficeCookie = parsedCookies['backoffice'];
  if (!backofficeCookie) {
    throw new Error('Backoffice cookie is missing');
  }
  return backofficeCookie;
};

export const CommonActions = {
  extractBackofficeCookie,
};
