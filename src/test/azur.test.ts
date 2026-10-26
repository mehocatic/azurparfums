import { describe, expect, it } from "vitest";
import { HOUSES, PERFUME_COUNT, buildInquiry, orderText, searchPerfumes, waLink } from "@/lib/azur";

describe("AZUR podaci", () => {
  it("ponuda ima svih 888 mirisa iz 142 kuće", () => {
    expect(PERFUME_COUNT).toBe(888);
    expect(HOUSES).toHaveLength(142);
  });
  it("kuće su poredane po broju mirisa", () => {
    expect(HOUSES[0]?.brand).toBe("Amouage");
    expect(HOUSES[1]?.brand).toBe("Xerjoff");
  });
  it("pretraga radi bez kvačica i po kući", () => {
    expect(searchPerfumes("layton").some((p) => p.name === "Layton" && p.brand === "Parfums de Marly")).toBe(true);
    expect(searchPerfumes("aventus creed").length).toBeGreaterThan(0);
    expect(searchPerfumes("sauvage").length).toBeGreaterThan(0);
    expect(searchPerfumes("")).toEqual([]);
  });
  it("upit sadrži ime, mirise i preuzimanje, a poruku samo ako je upisana", () => {
    const m = buildInquiry({ name: " Amar ", perfumes: ["Layton (inspirisan Parfums de Marly)", "Aventus (inspirisan Creed)"], delivery: "licno" });
    expect(m).toContain("Ime: Amar\n");
    expect(m).toContain("• Layton (inspirisan Parfums de Marly)\n• Aventus (inspirisan Creed)");
    expect(m).toContain("Preuzimanje: Lično u Sanskom Mostu");
    expect(m).not.toContain("Poruka:");
    expect(buildInquiry({ name: "A", perfumes: ["X"], delivery: "dostava", note: "do petka" })).toContain("Preuzimanje: Dostava\nPoruka: do petka");
  });
  it("WhatsApp link ide na broj vlasnika sa porukom", () => {
    expect(waLink("a b")).toBe("https://wa.me/38762685993?text=a%20b");
    expect(orderText("Layton")).toContain("AZUR Layton (50 ml");
  });
});
