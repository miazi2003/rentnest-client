import { cookies } from "next/headers";

const getBaseUrl = () => process.env.BACKEND_URL;

const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    throw new Error("User not logged in");
  }
  return token;
};

export async function getCategoriesApi() {
  try {
    const baseUrl = getBaseUrl();
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    let response = await fetch(`${baseUrl}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const token = await getAuthToken().catch(() => null);
      if (token) {
        response = await fetch(`${baseUrl}/api/admin/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
      }
    }

    const data = await response.json().catch(() => null);
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

export async function createCategoryApi(payload: {
  name: string;
  description: string;
}) {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    const response = await fetch(`${baseUrl}/api/admin/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message || (response.ok ? "Category created successfully" : "Failed to create category"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategoryApi(
  id: string,
  payload: { name: string; description: string }
) {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    let response = await fetch(`${baseUrl}/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (response.status === 405) {
      response = await fetch(`${baseUrl}/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    }

    const data = await response.json().catch(() => null);
    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message || (response.ok ? "Category updated successfully" : "Failed to update category"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryApi(id: string) {
  try {
    const token = await getAuthToken();
    const baseUrl = getBaseUrl();
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    const response = await fetch(`${baseUrl}/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);
    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message || (response.ok ? "Category deleted successfully" : "Failed to delete category"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
