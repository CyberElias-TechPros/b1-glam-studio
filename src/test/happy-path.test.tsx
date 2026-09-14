/**
 * Happy-path integration suite.
 *
 * Mounts the real application (providers, router, layout, pages) and walks the
 * journeys a client or staff member actually takes. Every one of these paths is
 * expected to complete without a dead end.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import App from "@/App";
import { api } from "@/lib/api";

// Any network attempt in tests should land on the offline store, exactly like a
// preview deploy with no VITE_API_URL configured.
const originalFetch = globalThis.fetch;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  globalThis.fetch = vi.fn(() => Promise.reject(new Error("offline test"))) as unknown as typeof fetch;
  window.history.pushState({}, "", "/");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const goTo = (path: string) => {
  window.history.pushState({}, "", path);
};

/** Opens the date popover and chooses the first bookable day (today or later). */
async function pickFirstAvailableDate() {
  fireEvent.click(screen.getByRole("button", { name: /select a date/i }));
  const popover = await screen.findByRole("dialog");
  const dayButtons = Array.from(popover.querySelectorAll("button")).filter(
    (button) =>
      /^\d{1,2}$/.test((button.textContent || "").trim()) && !(button as HTMLButtonElement).disabled,
  );
  expect(dayButtons.length).toBeGreaterThan(0);
  fireEvent.click(dayButtons[0]);
  // Radix keeps the popover mounted until it is dismissed; close it either way
  // so the next interaction happens on the form itself.
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(), { timeout: 5000 });
}

async function waitForHeading(name: RegExp | string) {
  return waitFor(() => {
    expect(screen.getByRole("heading", { name, level: 1 })).toBeInTheDocument();
  });
}

describe("marketing journey", () => {
  it("renders the home page with hero, navigation and primary CTA", async () => {
    render(<App />);

    await waitForHeading(/flawless artistry/i);
    expect(screen.getAllByRole("link", { name: /book a session/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /view full portfolio/i }).length).toBeGreaterThan(0);
    // Signature sections
    expect(screen.getAllByText(/where dark skin meets its perfect canvas/i).length).toBeGreaterThan(0);
    // SplitText exposes the sentence as an accessible name on the heading
    expect(screen.getAllByRole("heading", { name: /artistry for every occasion/i }).length).toBeGreaterThan(0);
  });

  it("navigates through every public page from the header", async () => {
    render(<App />);
    await waitForHeading(/flawless artistry/i);

    const routes: Array<[RegExp, RegExp | string]> = [
      [/^services$/i, /invest in your best look/i],
      [/^about$/i, /where dark skin meets its perfect canvas/i],
      [/^portfolio$/i, /the gallery/i],
      [/^journal$/i, /beauty notes from the studio/i],
      [/^testimonials$/i, /words from our queens/i],
      [/^contact$/i, /let's talk glam/i],
    ];

    for (const [link, heading] of routes) {
      const nav = screen.getAllByRole("link", { name: link })[0];
      fireEvent.click(nav);
      await waitFor(() => {
        expect(screen.getByRole("heading", { name: heading, level: 1 })).toBeInTheDocument();
      });
    }
  });

  it("opens a gallery lightbox from the home page", async () => {
    render(<App />);
    await waitForHeading(/flawless artistry/i);

    fireEvent.click(screen.getByRole("button", { name: /see the work/i }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText(/01 \/ 06/)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("shows the 404 page for an unknown route", async () => {
    goTo("/definitely-not-a-page");
    render(<App />);
    await waitForHeading(/slipped off the vanity/i);
  });
});

describe("booking journey", () => {
  it("submits a booking and returns a reference code", async () => {
    goTo("/booking");
    render(<App />);
    await waitForHeading(/reserve your date/i);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Amaka Test" } });
    fireEvent.change(screen.getByLabelText(/phone \/ whatsapp/i), { target: { value: "+2348012345678" } });
    fireEvent.change(screen.getByLabelText(/occasion/i), { target: { value: "Traditional wedding" } });

    await pickFirstAvailableDate();

    fireEvent.click(screen.getByRole("button", { name: /request booking/i }));

    await waitFor(() => {
      // the confirmation headline is a SplitText, so assert on its accessible name
      expect(
        screen.getByRole("heading", { name: /your request is with the studio/i }),
      ).toBeInTheDocument();
    });

    // the code appears in the confirmation panel and in the toast; take it from
    // whichever node is rendered first, then read the code itself out of it
    const referenceNode = screen.getAllByText(/B1-\d{4}-[A-Z0-9]{4}/)[0];
    const reference = referenceNode.textContent?.match(/B1-\d{4}-[A-Z0-9]{4}/)?.[0];
    expect(reference).toBeTruthy();

    // The booking is retrievable via the tracker
    const lookup = await api.bookings.lookup(reference!);
    expect(lookup.success).toBe(true);
    expect(lookup.data?.name).toBe("Amaka Test");
  });

  it("requires a home address when booking a home visit", async () => {
    goTo("/booking");
    render(<App />);
    await waitForHeading(/reserve your date/i);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "Home Test" } });
    fireEvent.change(screen.getByLabelText(/phone \/ whatsapp/i), { target: { value: "+2348099999999" } });
    fireEvent.change(screen.getByLabelText(/^location$/i), { target: { value: "home" } });

    await pickFirstAvailableDate();

    fireEvent.click(screen.getByRole("button", { name: /request booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/where are we coming to/i)).toBeInTheDocument();
    });
  });

  it("tracks an existing booking by reference code", async () => {
    const created = await api.bookings.create({
      name: "Tracker Test",
      phone: "+2348055555555",
      service: "Bridal Makeup",
      bookingDate: "2026-12-12",
      bookingTime: "11:00 AM",
      locationType: "studio",
      eventType: "Wedding",
    });
    expect(created.success).toBe(true);
    const reference = created.data!.referenceCode;

    goTo(`/booking/lookup?code=${reference}`);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Tracker Test")).toBeInTheDocument();
    });
    expect(screen.getByText(reference)).toBeInTheDocument();
    expect(screen.getByText(/pending review/i)).toBeInTheDocument();
    expect(screen.getByText("Bridal Makeup")).toBeInTheDocument();
  });

  it("reports an unknown reference gracefully", async () => {
    goTo("/booking/lookup");
    render(<App />);
    await waitForHeading(/where is my glam appointment/i);

    fireEvent.change(screen.getByLabelText(/booking reference/i), { target: { value: "B1-2026-ZZZZ" } });
    fireEvent.click(screen.getByRole("button", { name: /check status/i }));

    await waitFor(() => {
      expect(screen.getByText(/no booking found/i)).toBeInTheDocument();
    });
  });
});

describe("engagement journey", () => {
  it("subscribes to the newsletter", async () => {
    goTo("/contact");
    render(<App />);
    await waitForHeading(/let's talk glam/i);

    const input = screen.getByLabelText(/email address/i);
    fireEvent.change(input, { target: { value: "queen@example.com" } });
    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/you're on the vip list/i)).toBeInTheDocument();
    });

    const subscribers = await api.newsletter.list();
    expect(subscribers.data?.some((entry) => entry.email === "queen@example.com")).toBe(true);
  });

  it("sends a contact message", async () => {
    goTo("/contact");
    render(<App />);
    await waitForHeading(/let's talk glam/i);

    fireEvent.change(screen.getByLabelText(/^name \*$/i), { target: { value: "Ada Contact" } });
    fireEvent.change(screen.getByLabelText(/^message \*$/i), {
      target: { value: "Please share bridal availability for December." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/message delivered to the studio/i)).toBeInTheDocument();
    });

    const inquiries = await api.contact.list();
    expect(inquiries.data?.some((entry) => entry.name === "Ada Contact")).toBe(true);
  });

  it("posts a testimonial through the review modal", async () => {
    goTo("/testimonials");
    render(<App />);
    await waitForHeading(/words from our queens/i);

    fireEvent.click(screen.getByRole("button", { name: /share your review/i }));

    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText(/your name/i), { target: { value: "Review Tester" } });
    fireEvent.change(within(dialog).getByLabelText(/your experience/i), {
      target: { value: "The finish lasted from morning until the last dance." },
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "5 stars" }));
    fireEvent.click(within(dialog).getByRole("button", { name: /submit review/i }));

    await waitFor(() => expect(within(dialog).getByText(/^thank you$/i)).toBeInTheDocument());

    const approved = await api.testimonials.getApproved();
    expect(approved.data?.some((entry) => entry.name === "Review Tester")).toBe(true);
  });
});

describe("journal journey", () => {
  it("opens an article and posts a comment", async () => {
    goTo("/blog");
    render(<App />);
    await waitForHeading(/beauty notes from the studio/i);

    const articleLinks = await screen.findAllByRole("link", { name: /bridal makeup looks/i });
    fireEvent.click(articleLinks[0]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: /bridal makeup looks/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^name \*$/i), { target: { value: "Comment Tester" } });
    fireEvent.change(screen.getByLabelText(/your comment \*/i), {
      target: { value: "This was so helpful for my December wedding." },
    });
    fireEvent.click(screen.getByRole("button", { name: /post comment/i }));

    await waitFor(() => {
      expect(screen.getByText("This was so helpful for my December wedding.")).toBeInTheDocument();
    });
  });

  it("filters the journal by category", async () => {
    goTo("/blog");
    render(<App />);
    await waitForHeading(/beauty notes from the studio/i);

    fireEvent.click(screen.getByRole("button", { name: /^bridal$/i }));
    await waitFor(() => {
      expect(screen.queryByText(/nothing matches that search/i)).not.toBeInTheDocument();
    });
  });
});

describe("staff portal", () => {
  it("signs in and shows the dashboard with live metrics", async () => {
    goTo("/admin/login");
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /b1touch studio/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "admin@b1touchartistry.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Admin123!@#" },
    });
    fireEvent.click(screen.getByRole("button", { name: /enter the console/i }));

    await waitFor(
      () => {
        expect(window.location.pathname).toBe("/admin");
      },
      { timeout: 4000 }
    );
  });

  it("blocks the dashboard when signed out", async () => {
    goTo("/admin");
    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/login");
    });
  });
});
