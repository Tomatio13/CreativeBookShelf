/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "atue1qyfb729sje",
    "created": "2024-11-02 21:03:37.090Z",
    "updated": "2024-11-02 21:03:37.090Z",
    "name": "book_covers",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fvonedvc",
        "name": "file",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 5242880,
          "protected": false
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
  const collection = dao.findCollectionByNameOrId("atue1qyfb729sje");

  return dao.deleteCollection(collection);
})
