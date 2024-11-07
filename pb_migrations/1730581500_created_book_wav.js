/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "kbics6e9cd84ob5",
    "created": "2024-11-02 21:05:00.000Z",
    "updated": "2024-11-02 21:05:00.000Z",
    "name": "book_wav",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "plrepd2m",
        "name": "file",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 52428800,
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bkbics6e9cd84ob5");
  return dao.deleteCollection(collection);
}) 
