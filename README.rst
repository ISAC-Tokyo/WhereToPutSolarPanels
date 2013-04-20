=====================
WhereToPutSolarPanels
=====================

- Facebook

  - http://www.facebook.com/groups/435555353200281/


Members
=======

- takano32
- Takashi Nishibayashi (github:haginon3000)
- Shun Shiramatsu (github:siramatu)

Softwares and Libraries
=======================

- HDF

  - https://eosweb.larc.nasa.gov/HBDOCS/hdf.html

- HDF Java

  - http://www.hdfgroup.org/hdf-java-html/

- HDF4 to HDF5

  - http://www.hdfgroup.org/h4toh5/download.html

- HDF5 to XML Format

  - http://www.hdfgroup.org/HDF5/doc/RM/Tools.html#Tools-Dump

Servers
=======

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
たかのさんが作業中

サーバー3

- private ip address: 10.1.2.94
- hostname: i-1603-29760-VM

サーバー4

- private ip address: 10.1.2.51
- hostname: i-1603-29764-VM


Server API
==========

/api/v1/rank
------------

HTTP GET

- Request Parameters

  - lat (中心座標)
  - lan (中心座標)

Response

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

Example

::

  http://xxxxx.com?/api/v1/rank?lat=35.666666&lan=135.333333333


/api/v1/range_rank
------------------

- Request Parameters

  - lat (中心座標)
  - lon (中心座標)
  - scale (Google MapsのScaleの値をそのまま送る)

Response

ランクの配列、指定したレンジの左上から右へ。

::

  -------
  |1|2|3|
  -------
  |4|5|6|
  -------

- Content-Type:application/json

::

  {
    size: 400, // データの個数
    ranks: [5, 6, 8 ....... ] // レンジのランク
  }


Example

::

  http://xxxxx.com/api/v1/range_rank?lat=35.666666&lon=135.333333333&scale=10

