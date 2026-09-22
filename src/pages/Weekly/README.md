# Weekly highlights

`weekly.json` is the only file to edit when refreshing [/weekly](https://logseq.com/weekly). The page reads that file. It does not need a UI change.

Replace the file each week. Keep the list short: about 5 to 10 items, most important first.

## Schema

| Field | Required | Notes |
| --- | --- | --- |
| `_note` | no | Marker for sample data. While it is present, the page shows a short placeholder hint. Remove it when the items are real. |
| `weekStart` | yes | Inclusive start date, `YYYY-MM-DD`. |
| `weekEnd` | yes | Inclusive end date, `YYYY-MM-DD`. |
| `updatedAt` | yes | ISO-8601 datetime for the “Updated …” line. |
| `items` | yes | Ordered array. The page shows the first 10 entries and does not reorder them. |

Each item:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Short. |
| `summary` | no | One sentence. |
| `link` | no | A real PR, issue, or blog URL. Use `#` or omit the field for a placeholder. Do not invent GitHub numbers. |
| `tags` | no | Short labels, for example `Sync` or `Mobile`. |
| `category` | no | Optional single label. Shown with `tags`. |
| `priority` | no | Optional number for whoever prepares the file. Display order is the array order, not this field. |

Fewer than 5 items is fine. The page renders whatever is there. An empty `items` array shows a quiet empty state.
