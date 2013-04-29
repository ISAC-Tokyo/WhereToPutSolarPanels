WhereToPutSolarPanels
=====================

- Facebook

  - http://www.facebook.com/groups/435555353200281/


Members
-------

- takano32
- Takashi Nishibayashi (github:haginon3000)
- Shun Shiramatsu (github:siramatu)

Softwares and Libraries
-----------------------

- HDF

  - https://eosweb.larc.nasa.gov/HBDOCS/hdf.html

- HDF Java

  - http://www.hdfgroup.org/hdf-java-html/

- HDF4 to HDF5

  - http://www.hdfgroup.org/h4toh5/download.html

- HDF5 to XML Format

  - http://www.hdfgroup.org/HDF5/doc/RM/Tools.html#Tools-Dump

Servers
-------

CommonSpec

- Ubuntu 12.04 LTS 64bit
- Disk 215GB (/ : 15GB, /mnt/work : 200GB)
- Memory 8GB
- CPU 1.7GHz * 2
- SSH Port 22, Key Authentication only

SSH秘密鍵はfacebookグループにアップロードしました。

    ssh root@210.129.195.213 -i ~/.ssh/id_rsa_wtps

でログインできます。

公開サーバー

- global ip address: 210.129.195.213
- hostname: i-1603-29752-VM

サーバー2

- private ip address: 10.1.1.82
- hostname: i-1603-29759-VM

サーバー3

- private ip address: 10.1.2.94
- hostname: i-1603-29760-VM

サーバー4

- private ip address: 10.1.2.51
- hostname: i-1603-29764-VM

SSH Config
^^^^^^^^^^

::

  Host wtps*
    User root
    IdentityFile ~/.ssh/id_rsa_wtps
    ProxyCommand ssh -i ~/.ssh/id_rsa_wtps root@210.129.195.213 nc -w 60 %h %p

  Host wtps2
    Hostname 10.1.1.82

  Host wtps3
    Hostname 10.1.2.94

  Host wtps4
    Hostname 10.1.2.51

  Host wtps
    User root
    IdentityFile ~/.ssh/id_rsa_wtps
    Hostname 210.129.195.213

Convert HDF4 to HDF5
--------------------

install hdf5-tools

::

  apt-get install hdf5-tools

use h4toh5.

Insert Data from HDF5
---------------------

``insert_cloud_mask.py`` using h5py and pymongo.

::

  $ sudo apt-get install python-h5py python-pymongo

usage

::

  $ insert_cloud_mask.py [HDF5 File Name]

multiple file insert.

ex. from 2000-01-01 to 2000-12-31 data.

::

  $ ls MOD35_L2.A200[0]*.h5 | xargs -n1 insert_cloud_mask.py


Mongo DB
--------

Create Geo Index
^^^^^^^^^^^^^^^^

::

  > db.cloud_mask.ensureIndex({loc: '2d'}) 


Count
^^^^^

::

    > db.cloud_mask.count({query: {
        lat: {$gt: 35, $lt: 35.001},
        lon: {$gt: 134, $lt: 134.001}
        }})

Map Reduce
^^^^^^^^^^

::

    > var _m = function() {
      emit(this._id, {score: this.score});
    };
    > var _r = function(key, values) {
      var result = {count: 0, score: 0};
      values.forEach(function(value){
        result.count++;
        result.score += value.score;
      });
      return result;
    };

::

    > db.cloud_mask.mapReduce(_m, _r,
      {out: {inline: 1},
        query: {
          lat: {$gt: 35, $lt: 35.01},
          lon: {$gt: 134, $lt: 134.01}
          }})

Server API
----------

* GET /api/v1/rank

- Request Parameters

  - lat (中心座標)
  - lan (中心座標)

- Response

  - Content-Type:application/json

::

  {
    rank: 5,
    total_score: 3600, // 10年分の合計
    series: {
      from: "2000-01",
      to: "2010-12",
      data: [100, 105, 100, 30] // 10年分の月毎の晴れてる度
    }
  }

- Example

::

  http://xxxxx.com/api/v1/rank?lat=35.666666&lan=135.333333333


* GET /api/v1/rank/range

- Request Parameters

  - type1

    - lat_s: latitude start of range
    - lat_e: latitude end of range
    - lon_s: longitude start of range
    - lon_e: longitude end of range

  - type2

    - lat_r: latitude range
    - lon_r: longitude range

- Response

ランクの配列、指定したレンジの左上から右へ。
配列の長さは400。

::

  -------
  |1|2|3|
  -------
  |4|5|6|
  -------

- Content-Type:application/json

::

  [
    {
    "lat": 32.123,
    "lon": 139.123,
    "weight": 123
    },
    ...
    {
    "lat": 38.123,
    "lon": 142.123,
    "weight": 321
    },
  ]


- Examples

  - http://xxxxx.com/api/v1/rank/range?lat_s=20&lat_e=22&lon_s=120&lon_e=122

  - http://xxxxx.com/api/v1/rank/range?lon_r%5B%5D=139.73101258770754&lon_r%5B%5D=141.8147120048218&lat_r%5B%5D=37.04133331398954&lat_r%5B%5D=39.079552354108294

