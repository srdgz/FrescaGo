import ReactPaginateModule from "react-paginate";

type PaginateComponent = typeof ReactPaginateModule;

const resolved = ReactPaginateModule as unknown as
  | PaginateComponent
  | { default: PaginateComponent };

export const Paginate: PaginateComponent =
  typeof resolved === "function" ? resolved : resolved.default;
