export type PlateSelectValue = {
  text: string;
  regionCode: string;
  regionId: number | null;
};

export const DEFAULT_PLATE_VALUE: PlateSelectValue = {
  text: "******",
  regionCode: "",
  regionId: null,
};
