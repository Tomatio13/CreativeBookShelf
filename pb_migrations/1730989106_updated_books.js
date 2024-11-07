/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jtsk9qxpgjztksg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bu7bbjyf",
    "name": "wav_path",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jtsk9qxpgjztksg")

  // remove
  collection.schema.removeField("bu7bbjyf")

  return dao.saveCollection(collection)
})
