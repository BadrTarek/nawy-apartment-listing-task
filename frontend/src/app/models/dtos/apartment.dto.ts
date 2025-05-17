import { FilterMeta } from "../common/filter.model";
import { Apartment } from "../domain/apartment.model";


export interface ApartmentResponse {
    data: Apartment[];
    meta: FilterMeta;
}
