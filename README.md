# TNC Blue Carbon Cost Tool

## Methodology

### Sources

**This section explains how the table of model components and their sources is rendered in the methodology page.**

The methodology sources implementation is somewhat tricky due to a series of decisions influenced by limiting factors, such as the integration between AdminJS (UI and entity management) and the API entities, along with various trade-offs.

> **Note:** AdminJS's `position: number` property, which determines field order, does not work as expected. Instead, we use `listProperties`, `showProperties`, and `editProperties` for ordering.

---

## Configuration

Configuration is managed in:

```
api/src/modules/methodology/methodology.config.ts
```

This file contains all the entities that appear in the table. There are two types of relationships:

### 1-to-N (`1n`)

Entities in which each row can be related to **one and only one** source.

#### How to Add a New Entity with a 1n Relationship to `ModelComponentSource`

1. Define the `@ManyToOne` and `@OneToMany` TypeORM relationships between your entity and `ModelComponentSource` (use string-based references instead of anonymous functions for AdminJS compatibility).
2. Add the new entity to the configuration file:  
   ```
   api/src/modules/methodology/methodology.config.ts
   ```

---

### Many-to-Many (`m2m`)

Entities in which rows can have multiple columns, each related to different sources.

#### How to Add a New Entity with an `m2m` Relationship to `ModelComponentSource`

1. Import and add the following actions to an AdminJS resource options:

    ```typescript
    properties: {
        sources: {
            isVisible: { show: true, edit: true, list: true, filter: false },
            components: {
                list: Components.Many2ManySources,
                show: Components.Many2ManySources,
                edit: Components.Many2ManySources,
            },
        }
    },
    actions: {
        fetchRelatedSourcesAction: {
            actionType: 'record',
            isVisible: false,
            handler: fetchRelatedSourcesActionHandler,
        },
        addSourceAction: {
            actionType: 'record',
            isVisible: false,
            handler: addSourceActionHandler,
        },
        deleteSourceAction: {
            actionType: 'record',
            isVisible: false,
            handler: deleteSourceActionHandler,
        },
        fetchAvailableSourceTypesAction: {
            actionType: 'record',
            isVisible: false,
            handler: fetchAvailableSourceTypesActionHandler,
        }
    }
    ```

2. Add the new entity to the configuration file:  
   ```
   api/src/modules/methodology/methodology.config.ts
   ```

---

### Notes

- Always ensure AdminJS compatibility by using **string-based** references in TypeORM relationships.
-  Field ordering on AdminJS does not work as expected, rely on `listProperties`, `showProperties`, and `editProperties` to order fields in the different views.
