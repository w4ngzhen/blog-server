import type { Context } from 'hono';

/**
 * GithubApp callback 接口
 * @param c
 */
export default async function (c: Context) {
  const { GH_APP_CLIENT_ID, GH_APP_CLIENT_SECRET } = c.env;
  if (!GH_APP_CLIENT_ID || !GH_APP_CLIENT_SECRET) {
    return c.json(
      {
        error:
          '环境变量 GH_APP_CLIENT_ID 或 GH_APP_CLIENT_SECRET 为空，请联系评论系统维护者添加',
      },
      502,
    );
  }
  // GitHub callback 参数校验
  let code = c.req.query('code');
  let r = c.req.query('r');
  let error = c.req.query('error');

  if (error) {
    return c.json({ error: `Callback调用异常：${error}` }, 502);
  }

  if (!r) {
    return c.json({
      error: '请求参数中缺少重定向 URL（r=xxx）',
    });
  }

  // decode URI
  r = decodeURIComponent(r);

  if (!code) {
    return c.json(
      {
        error: 'Missing code, are you really GitHub?',
      },
      400,
    );
  }

  let exchangeEndpoint = 'https://github.com/login/oauth/access_token';

  let exchangeResp;

  try {
    exchangeResp = await fetch(exchangeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GH_APP_CLIENT_ID,
        client_secret: GH_APP_CLIENT_SECRET,
        code: code,
      }),
    });
  } catch (e: any) {
    console.error('向GitHub换取Token异常：', e);
    return c.json(
      {
        error: e.message,
      },
      502,
    );
  }

  if (!exchangeResp.ok) {
    console.error('向GitHub换取Token异常：', exchangeResp);
    return c.json(
      {
        error: 'GitHub Error: ' + exchangeResp.statusText,
        status: exchangeResp.status,
      },
      502,
    );
  }

  let exchangeJson = await exchangeResp.json();

  const urlObj = new URL(r);
  const searchParams = urlObj.searchParams;
  // searchParams.set('gh_access_token', exchangeJson.access_token);
  const url = `${urlObj.origin}?${searchParams.toString()}`;
  c.header(
    'Set-Cookie',
    `gh_access_token=${exchangeJson.access_token}; HttpOnly`,
  );
  return c.redirect(url, 302);
}
