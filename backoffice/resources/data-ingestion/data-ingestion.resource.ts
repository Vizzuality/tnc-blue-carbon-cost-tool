import { ApiEventsEntity } from "@api/modules/api-events/api-events.entity.js";
import { ResourceWithOptions } from "adminjs";

export const DataIngestionResource: ResourceWithOptions = {
    resource: ApiEventsEntity,
    options: {
        id: "EventsLog",
        navigation: {
            name: "Data Management",
            icon: "Database",
        },
        actions: {
            new: {
                isAccessible: false,
            },
            edit: {
                isAccessible: false,
            },
            delete: {
                isAccessible: false,
            },
            list: { isAccessible: true },
            show: { isAccessible: true },
        },
        properties: {
            '*': {isDisabled: true},
        }
    }
};
