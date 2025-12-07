import http from "@/shared/api/http";

export type RegionDto = {
  id: number;
  regionName: string;
  regionCode: string;
};

export type Region = {
  id: number;
  regionName: string;
  regionCode: string;
};

const PATCHED_REGIONS: Region[] = [
  { id: 977, regionName: "Москва", regionCode: "977" },
  { id: 778, regionName: "Санкт-Петербург", regionCode: "778" },
];

const normalizeRegion = (region: RegionDto): Region => ({
  id: region.id,
  regionName: region.regionName?.trim() ?? "",
  regionCode: region.regionCode?.trim() ?? "",
});

export const regionsApi = {
  async list(): Promise<Region[]> {
    const response = await http.get<RegionDto[]>("/api/regions");
    const data = Array.isArray(response.data) ? response.data : [];
    const normalized = data.map(normalizeRegion).filter((region) => region.regionCode);

    const merged = [...normalized];
    for (const patch of PATCHED_REGIONS) {
      const hasRegion = merged.some((region) => region.regionCode === patch.regionCode);
      if (!hasRegion) {
        merged.push(patch);
      }
    }

    return merged;
  },
};
