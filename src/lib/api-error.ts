type DatabaseError = {
  code?: unknown;
};

export function handleApiError(error: unknown, resource: string) {
  if (error instanceof Error && error.message === "DATABASE_URL is not configured") {
    return Response.json(
      { error: "Database is not configured" },
      { status: 503 },
    );
  }

  if (isDatabaseError(error) && error.code === "P2002") {
    return Response.json(
      { error: `${resource} already exists` },
      { status: 409 },
    );
  }

  if (isDatabaseError(error) && error.code === "P2025") {
    return Response.json(
      { error: `${resource} not found` },
      { status: 404 },
    );
  }

  console.error(`${resource} API error`, error);
  return Response.json(
    { error: "Database request failed" },
    { status: 500 },
  );
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === "object" && error !== null && "code" in error;
}
