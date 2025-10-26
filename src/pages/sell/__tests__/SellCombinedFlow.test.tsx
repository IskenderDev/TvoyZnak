import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AxiosError } from "axios";

import {
  submitCombinedListing,
  type CombinedSellFormValues,
} from "@/pages/sell/lib/submitCombinedListing";
import type { CreateNumberPayload, NumberItem } from "@/shared/services/numbersApi";
import { ProtectedRoute } from "@/shared/routes/ProtectedRoute";

vi.mock("@/shared/contexts/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "@/shared/contexts/AuthProvider";

describe("submitCombinedListing", () => {
  const baseValues: CombinedSellFormValues = {
    plate: "А123ВС",
    region: "77",
    price: 150000,
    comment: "",
    consent: true,
    fullName: "Иван Иванов",
    phone: "+7 (999) 111-22-33",
    email: "test@example.com",
    password: "password",
  };

  const createListing = (overrides?: Partial<NumberItem>): NumberItem => ({
    id: "123",
    plate: baseValues.plate,
    region: baseValues.region,
    price: baseValues.price,
    comment: baseValues.comment ?? "",
    phone: baseValues.phone,
    ...overrides,
  });

  it("registers a user and creates a listing", async () => {
    const register = vi.fn().mockResolvedValue({ id: 1, fullName: "Иван", email: baseValues.email });
    const login = vi.fn();
    const ensureSession = vi.fn().mockResolvedValue({ id: 1, fullName: "Иван", email: baseValues.email });
    const create = vi.fn<[], Promise<NumberItem>>().mockResolvedValue(createListing());

    const result = await submitCombinedListing(baseValues, {
      auth: { user: null, register, login, ensureSession },
      numbers: { create: create as (payload: CreateNumberPayload) => Promise<NumberItem> },
    });

    expect(register).toHaveBeenCalledWith({
      fullName: baseValues.fullName,
      email: baseValues.email,
      password: baseValues.password,
      phone: baseValues.phone,
    });
    expect(login).not.toHaveBeenCalled();
    expect(ensureSession).toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      plate: baseValues.plate,
      region: baseValues.region,
      price: baseValues.price,
      comment: baseValues.comment,
      phone: baseValues.phone,
    });
    expect(result.id).toBe("123");
  });

  it("logs in when email already exists", async () => {
    const axiosError = new AxiosError("Conflict", undefined, {}, {}, {
      status: 409,
      statusText: "Conflict",
      headers: {},
      config: {},
      data: {},
    });

    const register = vi.fn().mockRejectedValue(axiosError);
    const login = vi.fn().mockResolvedValue({ id: 2, fullName: baseValues.fullName, email: baseValues.email });
    const ensureSession = vi.fn().mockResolvedValue({ id: 2, fullName: baseValues.fullName, email: baseValues.email });
    const create = vi.fn<[], Promise<NumberItem>>().mockResolvedValue(createListing({ id: "456" }));

    const result = await submitCombinedListing(baseValues, {
      auth: { user: null, register, login, ensureSession },
      numbers: { create: create as (payload: CreateNumberPayload) => Promise<NumberItem> },
    });

    expect(register).toHaveBeenCalledTimes(1);
    expect(login).toHaveBeenCalledWith(baseValues.email, baseValues.password);
    expect(ensureSession).toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith({
      plate: baseValues.plate,
      region: baseValues.region,
      price: baseValues.price,
      comment: baseValues.comment,
      phone: baseValues.phone,
    });
    expect(result.id).toBe("456");
  });
});

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users with next param", async () => {
    (useAuth as unknown as vi.Mock).mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
      role: undefined,
      login: vi.fn(),
      register: vi.fn(),
      ensureSession: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
    });

    const router = createMemoryRouter(
      [
        {
          path: "/sell/new",
          element: (
            <ProtectedRoute>
              <div>Should not see</div>
            </ProtectedRoute>
          ),
        },
        { path: "/sell", element: <div>Sell page</div> },
      ],
      { initialEntries: ["/sell/new"] },
    );

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText("Sell page")).toBeInTheDocument();
    });
    expect(router.state.location.pathname).toBe("/sell");
    expect(router.state.location.search).toBe("?next=%2Fsell%2Fnew");
  });
});
