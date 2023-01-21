// BE
export type ApiSuccessResponse = {
  status: true;
  data: unknown | ItemsResponse;
};

export type ApiErrorResponse = {
  status: false;
  message: string;
};

export type ItemsResponse = {
  items: unknown[];
  totalItems: number;
  itemPerPage: number;
};
