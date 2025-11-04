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

const normalizeRegion = (region: RegionDto): Region => ({
  id: region.id,
  regionName: region.regionName?.trim() ?? "",
  regionCode: region.regionCode?.trim() ?? "",
});

export const regionsApi = {
  async list(): Promise<Region[]> {
    const response = await http.get<RegionDto[]>("/api/regions");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeRegion).filter((region) => region.regionCode);
  },
};
