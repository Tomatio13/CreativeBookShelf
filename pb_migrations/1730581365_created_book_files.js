/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "w11n6m4s4s5t7ju",
    "created": "2024-11-02 21:02:45.605Z",
    "updated": "2024-11-02 21:02:45.605Z",
    "name": "book_files",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ekigqhdu",
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
  const collection = dao.findCollectionByNameOrId("w11n6m4s4s5t7ju");

  return dao.deleteCollection(collection);
})
