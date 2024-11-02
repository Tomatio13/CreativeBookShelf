/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "lpbgnnggspzq6yd",
    "created": "2024-10-29 12:04:41.594Z",
    "updated": "2024-10-29 12:04:41.594Z",
    "name": "likes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xgsaygia",
        "name": "book_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "qvdgbtrj",
        "name": "user_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lpbgnnggspzq6yd");

  return dao.deleteCollection(collection);
})
