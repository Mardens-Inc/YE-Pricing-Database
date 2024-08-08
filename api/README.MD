# Years End Pricing Database API Overview

The Years End Pricing Database API is a web-service to interact with a pricing database. It allows you to List, Create, Update, and Delete records from the database.

## List Records

##### Endpoint: `GET /`

The 'List Records' endpoint fetches a list of records from the database. It accepts query parameters to filter and sort the records.

#### Parameters:

| Parameter    | Type    | Description                                             |
|--------------|---------|---------------------------------------------------------|
| `limit`      | integer | The number of records to return per page (default: 1)   |  
| `page`       | integer | The page number to return (default: 1)                  |
| `store`      | integer | The id of the store (default: 0)                        |
| `department` | integer | The id of the department (default: 0)                   |
| `tag_number` | integer | The number on the tag (default: 1234)                   |
| `asc`        | boolean | Determines the sorting order (default: false)           |
| `query`      | string  | A string to search for in the records (default: 'test') |
| `from`       | string  | The start date for the records (default: '2024-01-01')  |
| `to`         | string  | The end date for the recordsl (default: '2025-01-01')   |

#### Javascript Example:

```javascript
fetch('https://yeinv.mardens.com/api/?limit=1&page=1')
    .then(response => response.json())
    .then(data => console.log(data));
```

#### Curl Example:

```bash
curl -G https://yeinv.mardens.com/api/ \
  --data-urlencode "limit=1" \
  --data-urlencode "page=1"
```

---

## Create Record

##### Endpoint: `POST /`

The 'Create Record' endpoint adds a new record to the database.

#### Request Body:

An object with the following properties:

| Property        | Type    | Description                                   |
|-----------------|---------|-----------------------------------------------|
| `tag_number`    | integer | Number on the tag                             |
| `store`         | integer | The id of the store                           |
| `department`    | integer | The id of the department                      |
| `percent`       | integer | The percent off                               |
| `mardens_price` | number  | The price at Mardens                          |
| `quantity`      | integer | The quantity available                        |
| `employee`      | integer | The id of the employee who created the record |
| `description`   | string  | A brief description of the record             |

#### Javascript Example:

```javascript
fetch('https://yeinv.mardens.com/api/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        tag_number: 1234,
        store: 0,
        department: 0,
        percent: 40,
        mardens_price: 19.99,
        quantity: 88,
        employee: 89,
        description: "super duper test",
    }),
})
    .then(response => response.json())
    .then(data => console.log(data));
```

#### Curl Example:

```bash
curl -X POST https://yeinv.mardens.com/api/ \
  -H "Content-Type: application/json" \
  -d '{
    "tag_number": 1234,
    "store": 0,
    "department": 0,
    "percent": 40,
    "mardens_price": 19.99,
    "quantity": 88,
    "employee": 89,
    "description": "super duper test"
  }'
```

---

## Update Record

##### Endpoint: `PATCH /`

The 'Update Record' endpoint updates an existing record in the database.

#### Parameters:

| Parameter | Type    | Description                    |
|-----------|---------|--------------------------------|
| `id`      | integer | The id of the record to update |

#### Request Body:

An object with the following properties:

| Property        | Type    | Description                                   |
|-----------------|---------|-----------------------------------------------|
| `tag_number`    | integer | Number on the tag                             |
| `store`         | integer | The id of the store                           |
| `department`    | integer | The id of the department                      |
| `percent`       | integer | The percent off                               |
| `mardens_price` | number  | The price at Mardens                          |
| `quantity`      | integer | The quantity available                        |
| `employee`      | integer | The id of the employee who updated the record |
| `description`   | string  | A brief description of the record             |

#### Javascript Example:

```javascript
fetch('https://yeinv.mardens.com/api/?id=1', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        tag_number: 1234,
        store: 0,
        department: 0,
        percent: 40,
        mardens_price: 19.99,
        quantity: 88,
        employee: 989,
        description: "super duper test updated",
    }),
})
    .then(response => response.json())
    .then(data => console.log(data));
```

#### Curl Example:

```bash
curl -X PATCH https://yeinv.mardens.com/api/?id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "tag_number": 1234,
    "store": 0,
    "department": 0,
    "percent": 40,
    "mardens_price": 19.99,
    "quantity": 88,
    "employee": 897,
    "description": "super duper test updated"
  }'
```

---

## Delete Record

##### Endpoint: `DELETE /`

The 'Delete Record' endpoint removes a record from the database.

#### Parameters:

| Parameter | Type    | Description                    |
|-----------|---------|--------------------------------|
| `id`      | integer | The id of the record to delete |

#### Javascript Example:

```javascript
fetch('https://yeinv.mardens.com/api/?id=1', {
    method: 'DELETE',
})
    .then(response => response.json())
    .then(data => console.log(data));
```

#### Curl Example:

```bash
curl -X DELETE https://yeinv.mardens.com/api/?id=1
```


