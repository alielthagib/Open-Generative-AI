const MUAPI_BASE_URL = "https://api.muapi.ai/api/v1";

const MODEL_ENDPOINTS = {
  "flux-schnell": "flux-schnell-image",
  "nano-banana-pro": "nano-banana-pro"
};

export async function POST(request) {
  try {
    const actionKey = request.headers.get("x-chatgpt-action-key");

    if (actionKey !== process.env.CHATGPT_ACTION_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      prompt,
      model = "flux-schnell",
      aspect_ratio = "1:1"
    } = body;

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const endpoint = MODEL_ENDPOINTS[model];

    if (!endpoint) {
      return Response.json(
        { error: `Unsupported model: ${model}` },
        { status: 400 }
      );
    }

    const muapiResponse = await fetch(`${MUAPI_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MUAPI_API_KEY
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio
      })
    });

    const data = await muapiResponse.json();

    if (!muapiResponse.ok) {
      return Response.json(
        { error: "MuAPI request failed", details: data },
        { status: muapiResponse.status }
      );
    }

    return Response.json({
      status: "submitted",
      request_id: data.request_id || data.id,
      message: "Generation started. Use getGenerationResult to check the result."
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
