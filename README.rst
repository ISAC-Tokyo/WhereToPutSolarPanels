=====================
WhereToPutSolarPanels
=====================

- Home: http://spaceappschallenge.org/project/where-to-put-solar-panels-/
- Facebook (sometimes private!): http://www.facebook.com/groups/435555353200281/

-------
Members
-------

- Wataru Ohira (Lead)
- Ryota Ayaki
- Hiroki Matsue
- Takashi Nishibayashi (github:haginon3000)
- Eric Platon
- Hajime Sasaki
- Shun Shiramatsu (github:siramatu)
- Mitsuhiro Takano (takano32)

----------
Deployment
----------

*Assuming Ubuntu 12_04*

*See also web_client/README.md for the web server configuration (behind the wtps-web virtual host configured here)*

Package requirements

::

    # As root
    apt-get install build-essential libcurl4-openssl-dev apache2-prefork-dev apache2 nodejs git <必須なパケージを追加してください！>
    \curl -L https://get.rvm.io | bash -s stable --ruby=1.9.3

*If you want to install latest nodejs, see here: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint*

Get the code

::

    cd /srv && \
    git clone git://github.com/International-Space-Apps-Challenge-Tokyo/WhereToPutSolarPanels.git
    # As needed
    RAILS_ENV=production BUNDLE_PATH=vendor/bundle bundle install && \
    RAILS_ENV=production BUNDLE_PATH=vendor/bundle bundle exec passenger-install-apache2-module -a

Install virtual hosts

::

    # As root
    ln -s /srv/WhereToPutSolarPanels/etc/apache2/sites-available/wtps-api /etc/apache2/sites-available/wtps-api
    ln -s /srv/WhereToPutSolarPanels/etc/apache2/sites-available/wtps-web /etc/apache2/sites-available/wtps-web
    a2ensite wtps-web
    a2ensite wtps-api

Start/Restart Apache

::

    sudo apache2ctl start || sudo apache2ctl graceful

-----------------------
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


-------
Servers
-------

CommonSpec

- Ubuntu 12.04 LTS 64bit
- Disk 215GB (/ : 15GB, /mnt/work : 200GB)
- Memory 8GB
- CPU 1.7GHz * 2
- SSH Port 22, Key Authentication only

SSH秘密鍵はfacebookグループにアップロードしました。

::

  ssh root@210.129.195.213 -i ~/.ssh/id_rsa_wtps

でログインできます。

公開サーバー
------------

- global ip address

  - 210.129.195.213

- hostname

  - i-1603-29752-VM

サーバー2
---------

- private ip address

  - 10.1.1.82

- hostname

  - i-1603-29759-VM

サーバー3
---------

- private ip address

  - 10.1.2.94

- hostname

  - i-1603-29760-VM

サーバー4
---------

- private ip address

  - 10.1.2.51

- hostname

  - i-1603-29764-VM

ワーカー1
---------

- private ip address

  - 10.1.0.226

- hostname

  - i-1603-30061-VM

ワーカー2
---------

- private ip address

  - 10.1.0.167

- hostname

  - i-1603-30062-VM

ワーカー3
---------

- private ip address

  - 10.1.0.122

- hostname

  - i-1603-30063-VM

ワーカー4
---------

- private ip address

  - 10.1.1.246

- hostname

  - i-1603-30064-VM

ワーカー5
---------

- private ip address

  - 10.1.0.195

- hostname

  - i-1603-30065-VM

ワーカー6
---------

- private ip address

  - 10.1.2.84

- hostname

  - i-1603-30066-VM

----------
SSH Config
----------

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

  Host wtps01
    Hostname 10.1.0.226

  Host wtps02
    Hostname 10.1.0.167

  Host wtps03
    Hostname 10.1.0.122

  Host wtps04
    Hostname 10.1.1.246

  Host wtps05
    Hostname 10.1.0.195

  Host wtps06
    Hostname 10.1.2.84

  #Host wtps001
  #  Hostname

  #Host wtps002
  #  Hostname

  Host wtps003
    Hostname 10.1.3.162

  Host wtps004
    Hostname 10.1.3.121

  #Host wtps005
  #  Hostname

  Host wtps006
    Hostname 10.1.0.144

  Host wtps
    User root
    IdentityFile ~/.ssh/id_rsa_wtps
    Hostname 210.129.195.213

-------------
SetUp Workers
-------------

::

  # apt-get update
  # apt-get upgrade
  # apt-get dist-upgrade
  # fdisk /dev/sdb
  # mkfs.ext4 /dev/sdb1
  # blkid /dev/sdb1
  # vi /etc/fstab
  # reboot

at 210.129.195.213, foreach new worker's hostname.

::

  # scp -i ~/.ssh/id_rsa_wtps{,} hostname:~/.ssh
  # apt-get install git
  # cd /mnt/work
  # git clone https://github.com/International-Space-Apps-Challenge-Tokyo/WhereToPutSolarPanels.git

return to worker.

::

  # apt-get install python-h5py python-pymongo

let's get started to insert data!

---------------
Data Management
---------------

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

  $ insert_cloud_mask.py [shard_index] [shard_num] [HDF5 File Name]

multiple file insert.

ex. from 2000-01-01 to 2000-12-31 data.

::

  $ echo MOD35_L2.A200[0]*.h5 | xargs -n1 insert_cloud_mask.py [shard_index] [shard_num]

ex. from 2001-01-01 to 2012-12-31 data w/ concurrency 4.

::

  $ echo MOD35_L2.A200[12]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12
  $ echo MOD35_L2.A200[34]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12
  $ echo MOD35_L2.A200[56]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12
  $ echo MOD35_L2.A200[78]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12
  $ echo MOD35_L2.A20[01][09]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12
  $ echo MOD35_L2.A201[12]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py 0 12

ex. and batch insert.

::

  $  i in `seq 0 11`; do echo MOD35_L2.A200[12]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done
  $  i in `seq 0 11`; do echo MOD35_L2.A200[34]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done
  $  i in `seq 0 11`; do echo MOD35_L2.A200[56]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done
  $  i in `seq 0 11`; do echo MOD35_L2.A200[78]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done
  $  i in `seq 0 11`; do echo MOD35_L2.A200[01][09]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done
  $  i in `seq 0 11`; do echo MOD35_L2.A201[12]/*.h5 | xargs -P4 -n1 ./WhereToPutSolarPanels/insert_cloud_mask.py $i 12; done

--------
Mongo DB
--------

Current Data Structure https://github.com/International-Space-Apps-Challenge-Tokyo/WhereToPutSolarPanels/blob/master/mongo/README.md

Create Geo Index
----------------

::

  > db.cloud_mask.ensureIndex({loc: '2d'}) 


Count
-----

::

    > db.cloud_mask.count({query: {
        lat: {$gt: 35, $lt: 35.001},
        lon: {$gt: 134, $lt: 134.001}
        }})

Map Reduce
----------

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

----------
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

