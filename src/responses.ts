export const ResponseInvalid = () => new Response(JSON.stringify({ errors: ["Invalid request data"] }), {
  status: 400,
  statusText: "Unauthorized",
  headers: {
    "Content-Type": "text/json",
  }
});

export const ResponseUnauthorized = () => new Response(JSON.stringify({ errors: ["Unauthorized. You didn't set the right headers"] }), {
  status: 401,
  statusText: "Unauthorized",
  headers: {
    "Content-Type": "text/json",
  }
});

// For CORS
export const ResponsePreflight = () => new Response(JSON.stringify({ errors: [] }), {
  status: 200,
  statusText: "OK",
  headers: {
    "Content-Type": "text/json",
  }
});