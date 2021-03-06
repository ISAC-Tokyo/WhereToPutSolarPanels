=====================
WhereToPutSolarPanels
=====================

- Home: http://solar-energy.no32.tk
- Space Apps Challenge Project Home: http://spaceappschallenge.org/project/where-to-put-solar-panels-/
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
- TAKANO Mitsuhiro a.k.a. takano32 (Lead Engineer / Big Data Administrator)

----------
Deployment
----------

*Assuming Ubuntu 12_04*

*See also web_client/README.md for more detail on the client code*

Package requirements

::

    # As root
    apt-get install build-essential libcurl4-openssl-dev apache2-prefork-dev apache2 nodejs git <必須なパケージを追加してください！>
    \curl -L https://get.rvm.io | bash -s stable --ruby=1.9.3

*If you want to install latest nodejs, see here: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint*

Get the code the *first time*

::

    cd /srv && \
    git clone git://github.com/International-Space-Apps-Challenge-Tokyo/WhereToPutSolarPanels.git
    # As needed
    cd /srv/WhereToPutSolarPanels/web_server
    BUNDLE_PATH=vendor/bundle bundle install && \
    BUNDLE_PATH=vendor/bundle bundle exec passenger-install-apache2-module -a
    cd /srv/WhereToPutSolarPanels/web_client
    bower install

Get code updates (very primitive, but the way to date!)

::

    cd /srv/WhereToPutSolarPanels
    git checkout master && git pull
    cd /srv/WhereToPutSolarPanels/web_server && BUNDLE_PATH=vendor/bundle bundle install
    cd /srv/WhereToPutSolarPanels/web_client && bower install

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

SSH keys are shared in the private Facebook group.

Getting to the main server:

::

  ssh root@210.129.195.213 -i ~/.ssh/id_rsa_wtps


Public Server (HTTP front end and Web API)
------------------------------------------

- Global IP address: 210.129.195.213

- Hostname: i-1603-29752-VM

Backend server "dai2"
---------------------

- Private IP address: 10.1.1.82

- Hostname: i-1603-29759-VM

Backend server "dai3"
---------------------

- Private IP address: 10.1.2.94

- Hostname: i-1603-29760-VM

----------
SSH Config
----------

`SSH_CONFIG.rst <SSH_CONFIG.rst>`_

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

- Current Data Structure 

  - `./mongo/README.md <./mongo/README.md>`_

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

  - lat: latitude
  - lan: longitude

- Response

  - Content-Type:application/json

::

  {
    rank: 5,
    total_score: 3600, // Total over 10 years
    series: {
      from: "2000-01",
      to: "2010-12",
      data: [100, 105, 100, 30] // Number of sunny days each month over 10 years.
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

- Response: Array of 400 data points (lat, lon, rank), where the rank is the number of sunny days on average at that position.


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

