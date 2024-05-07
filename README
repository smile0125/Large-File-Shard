## version

node v16.20.0

## Usage

```js
npm i large-file-shard
```

## Example

```js
function fileChange(e) {
  const file = e.files[0];
  const fileShard = new FileShard(file);
  fileShard.init(file, 2 * 1024 * 1024);
  console.log(fileShard.getAllChunks());
  fileShard.getAllChunkHash().then((res) => {
    console.log(res);
  });
  fileShard.getFileHash().then((res) => {
    console.log(res);
  });
}
```
