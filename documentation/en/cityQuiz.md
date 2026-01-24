# Metrop | Create a new city quiz
[Go back](./getStarted.md)

>[!CAUTION]
> Outdated : will be updated soon

### 1. Create a JSON

Create a file `yourFileName.json`

> [!IMPORTANT]
> Verify that this name **doesn't** exist already

Copy and paste this in the file :

```json
{
  "cardInfo":{
    "Title":"",
    "Text":"",
    "lang":"EN",
    "pictureURL":"None"
  },
  "type":[]
}
```

---

### 2. Edit basic info (needed)

**Change the language :**

If English :

```json
"lang":"EN",
```

If French :

```json
"lang":"FR",
```

**Add a title :**

Change the second half of this line :

```json
"Title":"Your title here",
```

**Q** : Is the name important ?

**A** : No, you can choose any name you want.

**Add a text :**

Change the second half of this line :

```json
"Text":"Your text here",
```

**Q** : Is the text needed ?

**A** : No, you don't need one.

**Add a picture :**

If you don't want a picture :

```json
"pictureURL":"None",
```

If you want one :

```json
"pictureURL":"https://fr.wikipedia.org/wiki/Uniform_Resource_Locator#/media/Fichier:Firefox_adress_bar_Uniform_Resource_Locator_on_frwiki.png",
```

> [!CAUTION]
> Only Wikipedia sources are accepted (for now).

---

### 3. Edit the type

You have to add the type of activities which are supported :

In `"type"`:

```json
{
  "cardInfo": {
        "Title": "",
        "Text": "",
        "lang": "EN",
        "pictureURL": "None"
    },
    "type": [
        "place",
        "name",
        "guess"
    ]
}
```

If you want to add a *“name it”* add `name`.

If you want to add a *“place it”* add `place`.

If you want to add a *“guess it”* add `guess`.

---

### 4. Add a list

> [!INFO]
> Only cities work **currently**.

First add the `listCity` property :

```json
{
  "cardInfo": {
        "Title": "",
        "Text": "",
        "lang": "EN",
        "pictureURL": "None"
    },
    "type": [
        "",
    ],
    "listCity":[

    ]
}
```

For each point (city) you want, just add :

```json
{
  "name": "city name",
  "country": "country name",
  "lat": 000.000000,
  "lng": 000.000000
}
```

Enter the name in `name`, the country in `country` (not important), and the coordinates in `lat` and `lng`.

---

### 5. Add a learning program (optional)

If you want a learning program :

```json
{
  "cardInfo": {
        "Title": "",
        "Text": "",
        "lang": "EN",
        "pictureURL": "None"
    },
    "type": [
        "",
    ],
    "listCity":[

    ],
    "learning":[

    ]
}
```

---

For each part of the learning path add a *card* :


* **`header`** : add a title to open a chapter :

```json
{
  "type":"header",
  "name":"the name here"
}
```

* **`end`** : add an ending point :

> [!CAUTION]
> The `end` card must be the last one.

```json
{
  "type":"end",
  "name":"the name here"
}
```

* **`guessFromPosi`** : add a *guess* step in the learning path :

> [!WARNING]
> The city name must be the same as in `listCity`.

```json
{
  "type":"guessFromPosi",
  "name":"the name here",
  "listID":[
    "City 1",
    "City 2",
    "City 3"
  ]
}
```

* **`name`** : add a *name* step in the learning path :

> [!WARNING]
> The city name must be the same as in `listCity`.

```json
{
  "type":"name",
  "name":"the name here",
  "listID":[
    "City 1",
    "City 2",
    "City 3"
  ]
}
```

* **`placeCity`** : add a *place* step in the learning path :

> [!WARNING]
> The city name must be the same as in `listCity`.

```json
{
  "type":"placeCity",
  "name":"the name here",
  "listID":[
    "City 1",
    "City 2",
    "City 3"
  ]
}
```

* **`lesson`** : add a lesson step in the learning path (recommended at the beginning of every chapter) :

> [!WARNING]
> The city name must be the same as in `listCity`.

```json
{
  "type":"lesson",
  "name":"the name here",
  "listID":[
    "City 1",
    "City 2",
    "City 3"
}
```

---
### 6. Add the json the the homepage (needed)

**1. Go to the data folder** 

**2. Open the jsonList.json file**

**3. Add a new element : `yourFileName.json`**

>[!CAUTION]
>DO NOT MODIFY THE OTHER LINEs

**4. save**