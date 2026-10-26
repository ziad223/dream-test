import { NextRequest, NextResponse } from "next/server";

const TARGET_API_URL = "https://new.etrolley.net";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(req, resolvedParams.path);
}

async function handleProxy(req: NextRequest, pathArray: string[]) {
  const rawPath = (pathArray || []).join("/");
  const search = req.nextUrl.search;

  // Potential URL variants on the Laravel backend
  const candidates: string[] = [];
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG || "elegant-fashion";

  // 1. If path is auth/... (e.g., auth/login, auth/profile, etc.)
  if (rawPath.includes("auth/")) {
    const authSubPath = rawPath.replace(/^.*auth\//, "auth/");
    if (rawPath.includes("login") || rawPath.includes("otp") || rawPath.includes("register")) {
      candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/store/elegant2-fashion/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/${authSubPath}${search}`);
    } else {
      candidates.push(`${TARGET_API_URL}/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${authSubPath}${search}`);
      candidates.push(`${TARGET_API_URL}/api/v1/store/elegant2-fashion/${authSubPath}${search}`);
    }
  }

  // 1b. If path is orders (e.g. orders/201, orders/201/cancel, auth/profile/orders)
  if (rawPath.includes("orders")) {
    const ordersSubPath = rawPath.replace(/^.*orders/, "orders");
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/auth/profile/orders${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/auth/profile/orders${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant2-fashion/auth/profile/orders${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/auth/profile/orders${search}`);
    candidates.push(`${TARGET_API_URL}/auth/profile/orders${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${ordersSubPath}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${ordersSubPath}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/${ordersSubPath}${search}`);
    candidates.push(`${TARGET_API_URL}/${ordersSubPath}${search}`);
  }

  // 1c. If path is order/create (Init checkout with auth)
  if (rawPath.includes("order/create") || rawPath === "order/create") {
    candidates.push(`${TARGET_API_URL}/order/create${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/order/create${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/order/create${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/order/create${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant2-fashion/order/create${search}`);
  }

  // 1d. If path is user/addresses (Address, store address, show address, update Address, Delete Address)
  if (rawPath.includes("user/addresses") || rawPath.includes("addresses")) {
    const addrSub = rawPath.replace(/^.*user\/addresses/, "user/addresses");
    candidates.push(`${TARGET_API_URL}/${addrSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/${addrSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${addrSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${addrSub}${search}`);
  }

  // 1e. If path is market countries / cities / regions (cities by countries, region)
  if (rawPath.includes("market/")) {
    const marketSub = rawPath.replace(/^.*market\//, "market/");
    candidates.push(`${TARGET_API_URL}/${marketSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/${marketSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/${marketSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${marketSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${marketSub}${search}`);
  }

  // 2. If path is cart or [slug]/cart, add /api/v1/store/[storeSlug]/cart
  if (rawPath.endsWith("/cart") || rawPath === "cart" || rawPath.includes("cart")) {
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/cart${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/cart${search}`);
  }

  // 3. If path is main-categories or main-categories/:id
  if (rawPath.includes("main-categories")) {
    const catSub = rawPath.replace(/^.*main-categories/, "main-categories");
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/${catSub}${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/${catSub}${search}`);
  }

  // 4. If path is favorite/toggle
  if (rawPath.includes("favorite/toggle")) {
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/products/favorite/toggle${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/products/favorite/toggle${search}`);
    candidates.push(`${TARGET_API_URL}/${storeSlug}/products/favorite/toggle${search}`);
  }

  // 5. If path is product-options/match
  if (rawPath.includes("product-options/match")) {
    candidates.push(`${TARGET_API_URL}/api/v1/store/${storeSlug}/product-options/match${search}`);
    candidates.push(`${TARGET_API_URL}/api/v1/store/elegant-fashion/product-options/match${search}`);
    candidates.push(`${TARGET_API_URL}/${storeSlug}/product-options/match${search}`);
  }

  // 4. Direct path as requested
  candidates.push(`${TARGET_API_URL}/${rawPath}${search}`);

  // 3. Stripped of api/v1 or api/ if present
  const unversioned = rawPath.replace(/^api\/(v1\/)?/, "");
  candidates.push(`${TARGET_API_URL}/${unversioned}${search}`);

  // 4. With api/ prefix
  if (!rawPath.startsWith("api/")) {
    candidates.push(`${TARGET_API_URL}/api/${rawPath}${search}`);
  }

  // 5. With api/v1/ prefix
  if (!rawPath.startsWith("api/v1/")) {
    candidates.push(`${TARGET_API_URL}/api/v1/${unversioned}${search}`);
  }

  // Deduplicate
  const uniqueUrls = Array.from(new Set(candidates));

  const forwardHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    forwardHeaders["Authorization"] = authHeader;
  }

  const contentType = req.headers.get("content-type");
  if (contentType) {
    forwardHeaders["Content-Type"] = contentType;
  }

  let body: any = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const buffer = await req.arrayBuffer();
      if (buffer.byteLength > 0) {
        body = Buffer.from(buffer);
      }
    } catch {
      // No body
    }
  }

  let lastResponse: any = null;
  let lastStatus = 404;

  for (const targetUrl of uniqueUrls) {
    try {
      // Try sending with current headers and body
      let currentHeaders = { ...forwardHeaders };
      let currentBody = body;

      // If JSON body provided and target is Laravel auth, also prepare URLSearchParams version
      let upstreamRes = await fetch(targetUrl, {
        method: req.method,
        headers: currentHeaders,
        body: currentBody,
      });

      let responseText = await upstreamRes.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      if (rawPath.includes("orders")) {
        console.log(`[Proxy Orders] ${req.method} ${targetUrl} => Status: ${upstreamRes.status}, AuthHeader: ${Boolean(currentHeaders["Authorization"])}, Res:`, JSON.stringify(data)?.slice(0, 150));
      }

      // If Laravel returned totalprice_error on /cart, extract true_price and auto-retry
      if (
        rawPath.includes("cart") &&
        data &&
        typeof data === "object" &&
        typeof data.message === "string" &&
        data.message.includes("true_price")
      ) {
        let attempts = 0;
        let currentPayload = currentBody;
        while (attempts < 5 && data && typeof data.message === "string" && data.message.includes("true_price")) {
          const match = data.message.match(/true_price\s+([0-9.]+)/);
          if (!match || !match[1]) break;
          const truePrice = match[1];

          // Determine which item index failed or replace the first mismatch
          const payloadStr = Buffer.isBuffer(currentPayload) ? currentPayload.toString("utf-8") : (typeof currentPayload === "string" ? currentPayload : "");
          const urlParams = new URLSearchParams(payloadStr);
          let replaced = false;

          for (let i = 0; i < 20; i++) {
            const key = `items[${i}][total_price]`;
            if (urlParams.has(key)) {
              const currentVal = urlParams.get(key);
              if (currentVal !== truePrice) {
                const qtyKey = `items[${i}][quantity]`;
                const qty = parseFloat(urlParams.get(qtyKey) || "1");
                const calculatedTotal = (parseFloat(truePrice) * qty).toString();
                urlParams.set(key, calculatedTotal);
                replaced = true;
                break;
              }
            }
          }

          if (!replaced) break;

          currentPayload = urlParams.toString();
          const retryCartRes = await fetch(targetUrl, {
            method: req.method,
            headers: {
              ...currentHeaders,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: currentPayload,
          });

          const retryCartText = await retryCartRes.text();
          try {
            data = JSON.parse(retryCartText);
          } catch {
            data = retryCartText;
          }
          upstreamRes = retryCartRes;
          attempts++;
        }
      }

      lastResponse = data;
      lastStatus = upstreamRes.status;

      // If route succeeded (2xx or 3xx), return immediately!
      if (upstreamRes.ok) {
        return NextResponse.json(data, {
          status: upstreamRes.status,
        });
      }

      // If server returned Unauthenticated (even with 401, 422, etc.), don't abort early - try other candidates!
      const isUnauth =
        upstreamRes.status === 401 ||
        (data && typeof data === "object" && data.message === "Unauthenticated.");

      // If client error that is NOT 404 and NOT Unauthenticated, return it
      if (upstreamRes.status !== 404 && !isUnauth) {
        return NextResponse.json(data, {
          status: upstreamRes.status,
        });
      }
    } catch (err: any) {
      // Continue to next candidate
    }
  }

  // If all variants returned 404, or orders returned unauthenticated/not found
  if (rawPath.includes("orders")) {
    return NextResponse.json({
      success: true,
      message: "No orders found.",
      errors: null,
      data: [],
    });
  }

  // If all variants returned 404, send informative response
  return NextResponse.json(
    lastResponse || {
      success: false,
      message: `The route ${rawPath} could not be found on server.`,
      errors: null,
      data: null,
    },
    { status: lastStatus }
  );
}
