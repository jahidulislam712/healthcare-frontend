import {
  ApiErrorBody,
  ApiRequestOptions,
  ApiResponse,
} from "@/app/types/api.types";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";

/* -------------------------------------------------------------------------- */
/* Configuration & Instance Setup                                             */
/* -------------------------------------------------------------------------- */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DEFAULT_TIMEOUT = 30_000;

if (!API_BASE_URL && typeof window === "undefined") {
  console.warn(
    "WARNING: NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.",
  );
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/* Production-Grade Serializable Custom Error                                 */
/* -------------------------------------------------------------------------- */

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly errors?: unknown;
  readonly isNetworkError: boolean;
  readonly isTimeout: boolean;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      errors?: unknown;
      isNetworkError?: boolean;
      isTimeout?: boolean;
    } = {},
  ) {
    super(message);

    this.name = "ApiClientError";
    this.status = options.status;
    this.code = options.code;
    this.errors = options.errors;
    this.isNetworkError = options.isNetworkError ?? false;
    this.isTimeout = options.isTimeout ?? false;

    // Maintains proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Serializes the error into a plain object.
   * Crucial for preventing Next.js boundary crashes when errors are serialized.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      errors: this.errors,
      isNetworkError: this.isNetworkError,
      isTimeout: this.isTimeout,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Error Normalization                                                        */
/* -------------------------------------------------------------------------- */

function normalizeError(error: unknown): ApiClientError {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return new ApiClientError(
      error instanceof Error ? error.message : "An unexpected error occurred.",
    );
  }

  const axiosError = error as AxiosError<ApiErrorBody>;
  const status = axiosError.response?.status;
  const responseData = axiosError.response?.data;

  const isTimeout =
    axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT";

  // A network error occurs if there is no response and the request was actually sent
  const isNetworkError = !axiosError.response && Boolean(axiosError.request);

  let message: string;

  if (axiosError.code === "ERR_CANCELED") {
    message = "The request was canceled.";
  } else if (isTimeout) {
    message = "The request timed out. Please try again.";
  } else if (responseData?.message) {
    message = responseData.message;
  } else if (isNetworkError) {
    message =
      "Unable to connect to the server. Please check your internet connection.";
  } else {
    message = axiosError.message || "The request failed.";
  }

  return new ApiClientError(message, {
    status,
    code: responseData?.code ?? axiosError.code,
    errors: responseData?.errors,
    isNetworkError,
    isTimeout,
  });
}

/* -------------------------------------------------------------------------- */
/* Core Request Wrapper                                                       */
/* -------------------------------------------------------------------------- */

async function request<TData>(
  method: Method,
  endpoint: string,
  data?: unknown,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<TData>> {
  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    params: options.params,
    headers: options.headers,
    signal: options.signal,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    ...(data !== undefined ? { data } : {}),
  };

  try {
    const response: AxiosResponse<ApiResponse<TData>> =
      await axiosInstance.request<ApiResponse<TData>>(config);

    // CRITICAL: Return ONLY response.data. Returning the raw AxiosResponse
    // object introduces class instances and circular references that break Next.js
    // Server-to-Client boundaries.
    return response.data;
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

/* -------------------------------------------------------------------------- */
/* HTTP Methods Export                                                        */
/* -------------------------------------------------------------------------- */

function get<TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> {
  return request<TData>("GET", endpoint, undefined, options);
}

function post<TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> {
  return request<TData>("POST", endpoint, data, options);
}

function put<TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> {
  return request<TData>("PUT", endpoint, data, options);
}

function patch<TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> {
  return request<TData>("PATCH", endpoint, data, options);
}

function deleteRequest<TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> {
  return request<TData>("DELETE", endpoint, undefined, options);
}

// AI generated code that returns the headers also with body
async function requestWithHeaders<TData>(
  method: Method,
  endpoint: string,
  data?: unknown,
  options: ApiRequestOptions = {},
): Promise<{
  data: ApiResponse<TData>;
  headers: AxiosResponse["headers"];
}> {
  const config: AxiosRequestConfig = {
    method,
    url: endpoint,
    params: options.params,
    headers: options.headers,
    signal: options.signal,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    ...(data !== undefined ? { data } : {}),
  };

  try {
    const response = await axiosInstance.request<ApiResponse<TData>>(config);

    return {
      data: response.data,
      headers: response.headers,
    };
  } catch (error: unknown) {
    throw normalizeError(error);
  }
}

function postWithHeaders<TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
) {
  return requestWithHeaders<TData>("POST", endpoint, data, options);
}

export const httpClient = {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  postWithHeaders,
} as const;
