# Weekly highlights

`weekly.json` is the only file to edit when refreshing [/weekly](https://logseq.com/weekly).

Source is merged pull requests in [`logseq/logseq`](https://github.com/logseq/logseq) only. Do not include other Logseq repos, issues, or invented PR numbers.

## Shape

`weeks` is an array, newest first. Keep at most about three months (14 weeks). The page drops anything older than that, defaults to the first week, and shows at most 10 items in the order written.

The file currently has two real weeks from merged `logseq/logseq` pull requests. Add a week at the top when refreshing. Do not pad the file with placeholder weeks.

Each week:

| Field | Required | Notes |
| --- | --- | --- |
| `weekStart` | yes | Inclusive `YYYY-MM-DD`. Also the dropdown value. |
| `weekEnd` | yes | Inclusive `YYYY-MM-DD`. |
| `updatedAt` | yes | ISO-8601 datetime for the “Updated …” line. |
| `items` | yes | Ordered array, max 10 shown. |

Each item:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Short. |
| `summary` | no | One sentence. |
| `link` | no | One real `logseq/logseq` pull request URL. |
| `tags` | no | Optional. Not shown as badges. |
| `category` | no | Optional. Not shown as badges. |
| `priority` | no | Optional metadata. Display order is array order. |

A week with fewer than 5 items still renders as-is.
