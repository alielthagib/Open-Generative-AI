const MUAPI_BASE_URL = "https://api.muapi.ai/api/v1";

export async function GET(request, { params }) {
  try {
    const actionKey = request.headers.get("x-chatgpt-action-key");

    if (actionKey !== process.env.CHATGPT_ACTION_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = params;

    const muapiResponse = await fetch(
      `${MUAPI_BASE_URL}/predictions/${requestId}/result`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.MUAPI_API_KEY
        }
      }
    );

    const data = await muapiResponse.json();

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
