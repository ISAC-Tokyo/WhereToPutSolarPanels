# mongodb のデータ構成

## 積みあげ計算について

日付違いのデータについて、座標が近くても完全に一致はしていないので、座標の精度を落して積み上げ計算をする。


## Databases

- dai2 Server
 - gi 2013年03月のデータのみ
 - test test?
 - wtps ???
- dai3 Server
 - wtps12_5 %12=0のデータのみ。5年分
 - wtps12_8 %12=0のデータのみ。8年分

## Collections 

### cloud_mask

生データ、日毎。

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

### alldate_scaleX

すべての日付の平均、座標は小数点X桁の精度で保持。

```
> db.alldate_scale1.findOne()
{
        "_id" : "20.1_120.1",
        "value" : {
                "loc" : {
                        "lat" : "20.1",
                        "lon" : "120.1"
                },
                "totalScore" : 2,
                "totalLow" : 0,
                "count" : 4, // 集計したデータの個数
                "score" : 0.5,
                "low" : 0
        }
}
```

### scaleX_by_month

月毎に集計、座標は小数点X桁の精度で保持。

```
> db.scale2_by_month.findOne()
{
        "_id" : "201301_20.1_120.1", // keyはmonth + lac + lon
        "value" : {
                "month": "201301"
                "loc" : {
                        "lat" : "20.12",
                        "lon" : "120.15"
                },
                "totalScore" : 2,
                "totalLow" : 0,
                "count" : 4, // 集計したデータの個数
                "score" : 0.5,
                "low" : 0
        }
}
```



