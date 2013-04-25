# mongodb のデータ構成

## Collections

### 一番粒度の細かいデータ。日毎。

cloud_mask

```
> db.cloud_mask.find.limit(1)
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

### 月毎のデータ、さらに座標の近い物をまとめて平均をとった物

- scale1
- scale2
- scale3
- scale4
- scale5

```
> db.scale5.find().limit(1)
{
  _id: ObjectId("5177e2e33b02d17a04000000"), 
  month: "201201",  //YYYYMM
  loc: {
    lat: 49.116271, // scaleによって小数点以下の桁数がかわる
    lon: 128.44750  // scaleによって小数点以下の桁数がかわる
  },
  score: 0, // 平均
  low: 3,   // 平均
  totalScore: 999,
  totalLow: 100
}
```
