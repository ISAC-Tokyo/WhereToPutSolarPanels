# mongodb のデータ構成

## Collections

- cloud_mask

  一番粒度の細かいデータ。日毎。

```
{
  _id: ObjectId("5177e2e33b02d17a04000000"), 
  date: ISODate("2013-03-01T00:00:00Z"), 
  loc: {
    lat: 49.11627197265625,
    lon: 128.447509765625
  },
  score: 0,
  low: 3
}
```
